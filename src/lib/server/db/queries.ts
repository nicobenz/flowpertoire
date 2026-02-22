import { eq, and, or, sql, inArray } from 'drizzle-orm';
import { slugify } from '$lib/utils';
import { db } from './index';
import { nodes, groups, nodeEdges, skills } from './schema';
import type { TreeData } from '$lib/types';

export type RootTree = { id: number; name: string };

function toISO(d: Date): string {
	return d.toISOString();
}

/**
 * Returns root trees for a user: group nodes that have no parent edge.
 * Ordered by node id for stable ordering.
 */
export async function getRootTrees(userId: number): Promise<RootTree[]> {
	const rows = await db
		.select({
			id: nodes.id,
			label: groups.label
		})
		.from(nodes)
		.innerJoin(groups, eq(nodes.groupId, groups.id))
		.where(
			and(
				eq(nodes.userId, userId),
				eq(nodes.nodeType, 'group'),
				sql`${nodes.id} NOT IN (SELECT child_id FROM node_edges WHERE type = 'parent')`
			)
		)
		.orderBy(nodes.id);

	return rows.map((r) => ({ id: r.id, name: r.label }));
}

/**
 * Creates a new root tree: a group and its group node (no parent edge).
 * Returns the new root tree { id: nodeId, name: label }.
 */
export async function createRootTree(userId: number, label: string): Promise<RootTree> {
	const trimmed = label.trim();
	if (!trimmed) throw new Error('Label is required');

	const [group] = await db
		.insert(groups)
		.values({ label: trimmed })
		.returning({ id: groups.id });

	if (!group) throw new Error('Failed to create group');

	const [node] = await db
		.insert(nodes)
		.values({
			nodeType: 'group',
			groupId: group.id,
			skillId: null,
			userId,
			sortOrder: 0
		})
		.returning({ id: nodes.id });

	if (!node) throw new Error('Failed to create node');

	return { id: node.id, name: trimmed };
}

/**
 * Resolves a URL slug (tree name segment) to the root node id for the user.
 * Returns null if no tree matches. Single query to avoid fetching all trees (e.g. after create redirect).
 */
export async function getRootTreeIdBySlug(userId: number, urlSlug: string): Promise<number | null> {
	const slug = decodeURIComponent(urlSlug).toLowerCase().trim();
	if (!slug) return null;
	// Match slug by normalizing group label in SQL (same rules as slugify: lower, trim, non-alnum to '-', trim dashes)
	const rows = await db
		.select({ id: nodes.id })
		.from(nodes)
		.innerJoin(groups, eq(nodes.groupId, groups.id))
		.where(
			and(
				eq(nodes.userId, userId),
				eq(nodes.nodeType, 'group'),
				sql`${nodes.id} NOT IN (SELECT child_id FROM node_edges WHERE type = 'parent')`,
				sql`trim(both '-' from regexp_replace(lower(trim(${groups.label})), '[^a-z0-9]+', '-', 'g')) = ${slug}`
			)
		)
		.limit(1);
	return rows[0]?.id ?? null;
}

/**
 * Collects node id and all descendant node ids (via parent edges). Includes rootId.
 * Uses a single recursive CTE instead of one query per level to reduce DB round-trips.
 */
async function getSubtreeNodeIds(rootId: number): Promise<number[]> {
	const result = await db.execute<{ id: number }>(sql`
		WITH RECURSIVE subtree(id) AS (
			SELECT id FROM nodes WHERE id = ${rootId}
			UNION
			SELECT child_id FROM node_edges
			INNER JOIN subtree s ON node_edges.parent_id = s.id
			WHERE type = 'parent'
		)
		SELECT id FROM subtree
	`);
	const rows = 'rows' in result ? result.rows : result;
	return Array.isArray(rows) ? rows.map((r) => r.id) : [];
}

/**
 * Deletes a root tree and its entire subtree (nodes, edges, and referenced skills/groups).
 * Verifies the root node belongs to the user. Throws if not found or not owner.
 */
export async function deleteRootTree(userId: number, rootNodeId: number): Promise<void> {
	const [root] = await db
		.select()
		.from(nodes)
		.where(and(eq(nodes.id, rootNodeId), eq(nodes.userId, userId), eq(nodes.nodeType, 'group')))
		.limit(1);
	if (!root) throw new Error('Tree not found or you do not own it');

	const subtreeIds = await getSubtreeNodeIds(rootNodeId);
	const nodeRows = await db
		.select({ id: nodes.id, skillId: nodes.skillId, groupId: nodes.groupId })
		.from(nodes)
		.where(inArray(nodes.id, subtreeIds));

	const skillIds = nodeRows.map((r) => r.skillId).filter((id): id is number => id != null);
	const groupIds = nodeRows.map((r) => r.groupId).filter((id): id is number => id != null);

	await db
		.delete(nodeEdges)
		.where(or(inArray(nodeEdges.parentId, subtreeIds), inArray(nodeEdges.childId, subtreeIds)));
	await db.delete(nodes).where(inArray(nodes.id, subtreeIds));
	if (skillIds.length > 0) await db.delete(skills).where(inArray(skills.id, skillIds));
	if (groupIds.length > 0) await db.delete(groups).where(inArray(groups.id, groupIds));
}

/**
 * Loads full tree data for a root (subtree): nodes, edges, skills, groups.
 * Verifies the root belongs to the user. Returns null if not found or not owner.
 */
export async function getTreeData(userId: number, rootNodeId: number): Promise<TreeData | null> {
	const [root] = await db
		.select()
		.from(nodes)
		.where(and(eq(nodes.id, rootNodeId), eq(nodes.userId, userId), eq(nodes.nodeType, 'group')))
		.limit(1);
	if (!root) return null;

	const subtreeIds = await getSubtreeNodeIds(rootNodeId);

	const nodeRows = await db.select().from(nodes).where(inArray(nodes.id, subtreeIds));
	const skillIds = nodeRows.map((r) => r.skillId).filter((id): id is number => id != null);
	const groupIds = nodeRows.map((r) => r.groupId).filter((id): id is number => id != null);

	const edgeRows = await db
		.select()
		.from(nodeEdges)
		.where(
			and(
				inArray(nodeEdges.parentId, subtreeIds),
				inArray(nodeEdges.childId, subtreeIds)
			)
		);

	const skillRows =
		skillIds.length > 0 ? await db.select().from(skills).where(inArray(skills.id, skillIds)) : [];
	const groupRows =
		groupIds.length > 0
			? await db.select().from(groups).where(inArray(groups.id, groupIds))
			: [];

	return {
		nodes: nodeRows.map((n) => ({
			id: n.id,
			nodeType: n.nodeType,
			skillId: n.skillId,
			groupId: n.groupId,
			userId: n.userId,
			showInGraph: n.showInGraph,
			showInPortfolioList: n.showInPortfolioList,
			sortOrder: n.sortOrder,
			createdAt: toISO(n.createdAt),
			updatedAt: toISO(n.updatedAt)
		})),
		edges: edgeRows.map((e) => ({
			parentId: e.parentId,
			childId: e.childId,
			type: e.type,
			sortOrder: e.sortOrder
		})),
		skills: skillRows.map((m) => ({
			id: m.id,
			title: m.title,
			skillRating: m.skillRating,
			firstLandedAt: m.firstLandedAt ? toISO(m.firstLandedAt) : null,
			createdAt: toISO(m.createdAt),
			updatedAt: toISO(m.updatedAt)
		})),
		groups: groupRows.map((c) => ({
			id: c.id,
			label: c.label,
			description: c.description,
			createdAt: toISO(c.createdAt),
			updatedAt: toISO(c.updatedAt)
		}))
	};
}

/**
 * Gets the next sort order for a new child under parentId (max existing + 1).
 */
async function getNextChildSortOrder(parentId: number): Promise<number> {
	const result = await db
		.select({ maxOrder: sql<number>`max(${nodeEdges.sortOrder})` })
		.from(nodeEdges)
		.where(
			and(eq(nodeEdges.parentId, parentId), eq(nodeEdges.type, 'parent'))
		);
	const maxOrder = result[0]?.maxOrder;
	return typeof maxOrder === 'number' ? maxOrder + 1 : 0;
}

/**
 * Adds a new group as a child of the given parent node. Creates the group, its node, and the parent edge.
 * Verifies parent exists and belongs to user. Returns the new node id.
 */
export async function addChildGroup(
	userId: number,
	parentNodeId: number,
	label: string,
	description?: string | null
): Promise<number> {
	const trimmed = label.trim();
	if (!trimmed) throw new Error('Label is required');

	const [parent] = await db
		.select()
		.from(nodes)
		.where(and(eq(nodes.id, parentNodeId), eq(nodes.userId, userId)))
		.limit(1);
	if (!parent) throw new Error('Parent node not found or you do not own it');

	const [group] = await db
		.insert(groups)
		.values({ label: trimmed, description: description?.trim() || null })
		.returning({ id: groups.id });
	if (!group) throw new Error('Failed to create group');

	const [node] = await db
		.insert(nodes)
		.values({
			nodeType: 'group',
			groupId: group.id,
			skillId: null,
			userId,
			sortOrder: 0
		})
		.returning({ id: nodes.id });
	if (!node) throw new Error('Failed to create node');

	const sortOrder = await getNextChildSortOrder(parentNodeId);
	await db.insert(nodeEdges).values({
		parentId: parentNodeId,
		childId: node.id,
		type: 'parent',
		sortOrder
	});
	return node.id;
}

/**
 * Adds a new skill as a child of the given parent node. Creates the skill, its node, and the parent edge.
 * Verifies parent exists and belongs to user. Returns the new node id.
 */
export async function addChildSkill(
	userId: number,
	parentNodeId: number,
	title: string
): Promise<number> {
	const trimmed = title.trim();
	if (!trimmed) throw new Error('Title is required');

	const [parent] = await db
		.select()
		.from(nodes)
		.where(and(eq(nodes.id, parentNodeId), eq(nodes.userId, userId)))
		.limit(1);
	if (!parent) throw new Error('Parent node not found or you do not own it');

	const [skill] = await db
		.insert(skills)
		.values({ title: trimmed })
		.returning({ id: skills.id });
	if (!skill) throw new Error('Failed to create skill');

	const [node] = await db
		.insert(nodes)
		.values({
			nodeType: 'skill',
			skillId: skill.id,
			groupId: null,
			userId,
			sortOrder: 0
		})
		.returning({ id: nodes.id });
	if (!node) throw new Error('Failed to create node');

	const sortOrder = await getNextChildSortOrder(parentNodeId);
	await db.insert(nodeEdges).values({
		parentId: parentNodeId,
		childId: node.id,
		type: 'parent',
		sortOrder
	});
	return node.id;
}
