/**
 * Client-side types aligned with the DB schema.
 * Used by moveState and (later) API layer.
 */

export interface Skill {
	id: number;
	title: string;
	skillRating: number; // 0–5
	firstLandedAt: string | null; // ISO string for serialization
	createdAt: string;
	updatedAt: string;
}

export interface Group {
	id: number;
	label: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

/** Base fields shared by all nodes. */
interface NodeBase {
	id: number;
	userId: number;
	showInGraph: boolean;
	showInPortfolioList: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

/** Node that represents a skill (exactly one of skillId or groupId is set). */
export interface SkillNode extends NodeBase {
	nodeType: 'skill';
	skillId: number;
	groupId: null;
}

/** Node that represents a group. */
export interface GroupNode extends NodeBase {
	nodeType: 'group';
	skillId: null;
	groupId: number;
}

/** A node is either a skill or a group—never both (no hybrid). */
export type Node = SkillNode | GroupNode;

/**
 * Node with resolved display fields from linked skill/group.
 * - label: from skill.title or group.label
 * - skillRating: present when node is a skill (from skill.skillRating)
 * - description: present when node is a group (from group.description)
 * - aggregateSkillRating: present when node is a group (average 0–5 of skills in subtree)
 */
export type ResolvedNode = Node & {
	label: string;
	/** Set when node is a skill. */
	skillRating?: number;
	/** Set when node is a group. */
	description?: string | null;
	/** Set when node is a group: average skill rating (0–5) of all skills in subtree. */
	aggregateSkillRating?: number;
};

/** Edge type: 'parent' = directed DAG edge; 'concept' = undirected link between nodes of same concept. */
export type NodeEdgeType = 'parent' | 'concept';

/** DAG edge (parent→child) or concept edge (undirected, same conceptId). */
export interface NodeEdge {
	parentId: number;
	childId: number;
	type?: NodeEdgeType; // default 'parent'
	sortOrder?: number;
}

/** Shape for template trees or initial seed data (no ids = will be assigned on load). */
export interface TreeData {
	nodes: Array<Omit<Node, 'id'> & { id?: number }>;
	edges: Array<NodeEdge>;
	skills: Array<Omit<Skill, 'id'> & { id?: number }>;
	groups: Array<Omit<Group, 'id'> & { id?: number }>;
}

/** Summary of a root tree for the switcher (id = node id, name = group label). */
export interface TreeSummary {
	id: number;
	name: string;
}

/** Tree shape without skill rating – for graph layout so rating changes don't redraw. */
export interface GraphStructure {
	nodes: TreeData['nodes'];
	edges: TreeData['edges'];
	groups: TreeData['groups'];
	skills: Array<{ id: number; title: string }>;
}
