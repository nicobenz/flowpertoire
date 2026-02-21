/**
 * Client-side types aligned with the DB schema.
 * Used by moveState and (later) API layer.
 */

export interface Move {
	id: number;
	title: string;
	skillRating: number; // 0–5
	firstLandedAt: string | null; // ISO string for serialization
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	id: number;
	conceptId: number | null;
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

/** Node that represents a move (exactly one of moveId or categoryId is set). */
export interface MoveNode extends NodeBase {
	nodeType: 'move';
	moveId: number;
	categoryId: null;
}

/** Node that represents a category. */
export interface CategoryNode extends NodeBase {
	nodeType: 'category';
	moveId: null;
	categoryId: number;
}

/** A node is either a move or a category—never both (no hybrid). */
export type Node = MoveNode | CategoryNode;

/**
 * Node with resolved display fields from linked move/category.
 * - label: from move.title or category.label
 * - skillRating: present when node is a move (from move.skillRating)
 * - description: present when node is a category (from category.description)
 * - aggregateSkillRating: present when node is a category (average 0–5 of moves in subtree)
 */
export type ResolvedNode = Node & {
	label: string;
	/** Set when node is a move. */
	skillRating?: number;
	/** Set when node is a category. */
	description?: string | null;
	/** Set when node is a category: average skill rating (0–5) of all moves in subtree. */
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
	moves: Array<Omit<Move, 'id'> & { id?: number }>;
	categories: Array<Omit<Category, 'id'> & { id?: number }>;
}

/** Summary of a root tree for the switcher (id = node id, name = category label). */
export interface TreeSummary {
	id: number;
	name: string;
}

/** Tree shape without move skillRating – for graph layout so rating changes don’t redraw. */
export interface GraphStructure {
	nodes: TreeData['nodes'];
	edges: TreeData['edges'];
	categories: TreeData['categories'];
	moves: Array<{ id: number; title: string }>;
}
