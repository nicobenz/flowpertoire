import { eq, and, or, sql, inArray } from 'drizzle-orm';
import { db } from './index';
import { nodes, categories, nodeEdges, moves } from './schema';
import type { TreeData } from '$lib/types';

export type RootTree = { id: number; name: string };

function toISO(d: Date): string {
	return d.toISOString();
}

/**
 * Returns root trees for a user: category nodes that have no parent edge.
 * Ordered by node id for stable ordering.
 */
export async function getRootTrees(userId: number): Promise<RootTree[]> {
	const rows = await db
		.select({
			id: nodes.id,
			label: categories.label
		})
		.from(nodes)
		.innerJoin(categories, eq(nodes.categoryId, categories.id))
		.where(
			and(
				eq(nodes.userId, userId),
				eq(nodes.nodeType, 'category'),
				sql`${nodes.id} NOT IN (SELECT child_id FROM node_edges WHERE type = 'parent')`
			)
		)
		.orderBy(nodes.id);

	return rows.map((r) => ({ id: r.id, name: r.label }));
}

/**
 * Creates a new root tree: a category and its category node (no parent edge).
 * Returns the new root tree { id: nodeId, name: label }.
 */
export async function createRootTree(userId: number, label: string): Promise<RootTree> {
	const trimmed = label.trim();
	if (!trimmed) throw new Error('Label is required');

	const [category] = await db
		.insert(categories)
		.values({ label: trimmed })
		.returning({ id: categories.id });

	if (!category) throw new Error('Failed to create category');

	const [node] = await db
		.insert(nodes)
		.values({
			nodeType: 'category',
			categoryId: category.id,
			moveId: null,
			userId,
			sortOrder: 0
		})
		.returning({ id: nodes.id });

	if (!node) throw new Error('Failed to create node');

	return { id: node.id, name: trimmed };
}

/**
 * Collects node id and all descendant node ids (via parent edges). Includes rootId.
 */
async function getSubtreeNodeIds(rootId: number): Promise<number[]> {
	const result = new Set<number>([rootId]);
	let frontier = [rootId];
	while (frontier.length > 0) {
		const rows = await db
			.select({ childId: nodeEdges.childId })
			.from(nodeEdges)
			.where(
				and(eq(nodeEdges.type, 'parent'), inArray(nodeEdges.parentId, frontier))
			);
		frontier = [];
		for (const r of rows) {
			if (!result.has(r.childId)) {
				result.add(r.childId);
				frontier.push(r.childId);
			}
		}
	}
	return [...result];
}

/**
 * Deletes a root tree and its entire subtree (nodes, edges, and referenced moves/categories).
 * Verifies the root node belongs to the user. Throws if not found or not owner.
 */
export async function deleteRootTree(userId: number, rootNodeId: number): Promise<void> {
	const [root] = await db
		.select()
		.from(nodes)
		.where(and(eq(nodes.id, rootNodeId), eq(nodes.userId, userId), eq(nodes.nodeType, 'category')))
		.limit(1);
	if (!root) throw new Error('Tree not found or you do not own it');

	const subtreeIds = await getSubtreeNodeIds(rootNodeId);
	const nodeRows = await db
		.select({ id: nodes.id, moveId: nodes.moveId, categoryId: nodes.categoryId })
		.from(nodes)
		.where(inArray(nodes.id, subtreeIds));

	const moveIds = nodeRows.map((r) => r.moveId).filter((id): id is number => id != null);
	const categoryIds = nodeRows.map((r) => r.categoryId).filter((id): id is number => id != null);

	await db
		.delete(nodeEdges)
		.where(or(inArray(nodeEdges.parentId, subtreeIds), inArray(nodeEdges.childId, subtreeIds)));
	await db.delete(nodes).where(inArray(nodes.id, subtreeIds));
	if (moveIds.length > 0) await db.delete(moves).where(inArray(moves.id, moveIds));
	if (categoryIds.length > 0) await db.delete(categories).where(inArray(categories.id, categoryIds));
}

/**
 * Loads full tree data for a root (subtree): nodes, edges, moves, categories.
 * Verifies the root belongs to the user. Returns null if not found or not owner.
 */
export async function getTreeData(userId: number, rootNodeId: number): Promise<TreeData | null> {
	const [root] = await db
		.select()
		.from(nodes)
		.where(and(eq(nodes.id, rootNodeId), eq(nodes.userId, userId), eq(nodes.nodeType, 'category')))
		.limit(1);
	if (!root) return null;

	const subtreeIds = await getSubtreeNodeIds(rootNodeId);

	const nodeRows = await db.select().from(nodes).where(inArray(nodes.id, subtreeIds));
	const moveIds = nodeRows.map((r) => r.moveId).filter((id): id is number => id != null);
	const categoryIds = nodeRows.map((r) => r.categoryId).filter((id): id is number => id != null);

	const edgeRows = await db
		.select()
		.from(nodeEdges)
		.where(
			and(
				inArray(nodeEdges.parentId, subtreeIds),
				inArray(nodeEdges.childId, subtreeIds)
			)
		);

	const moveRows =
		moveIds.length > 0 ? await db.select().from(moves).where(inArray(moves.id, moveIds)) : [];
	const categoryRows =
		categoryIds.length > 0
			? await db.select().from(categories).where(inArray(categories.id, categoryIds))
			: [];

	return {
		nodes: nodeRows.map((n) => ({
			id: n.id,
			nodeType: n.nodeType,
			moveId: n.moveId,
			categoryId: n.categoryId,
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
		moves: moveRows.map((m) => ({
			id: m.id,
			title: m.title,
			skillRating: m.skillRating,
			firstLandedAt: m.firstLandedAt ? toISO(m.firstLandedAt) : null,
			createdAt: toISO(m.createdAt),
			updatedAt: toISO(m.updatedAt)
		})),
		categories: categoryRows.map((c) => ({
			id: c.id,
			conceptId: c.conceptId,
			label: c.label,
			description: c.description,
			createdAt: toISO(c.createdAt),
			updatedAt: toISO(c.updatedAt)
		}))
	};
}
