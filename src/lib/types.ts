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

export interface Node {
	id: number;
	moveId: number | null;
	categoryId: number | null;
	userId: number;
	showInGraph: boolean;
	showInPortfolioList: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

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
