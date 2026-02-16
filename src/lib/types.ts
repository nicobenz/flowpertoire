/**
 * Client-side types aligned with the DB schema.
 * Used by moveState and (later) API layer.
 */

export type MoveStatus = 'wishlist' | 'learning' | 'mastered';

export interface Move {
	id: number;
	conceptId: number | null;
	title: string;
	skillRating: number; // 1–10
	status: MoveStatus;
	firstLandedAt: string | null; // ISO string for serialization
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	id: number;
	label: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Node {
	id: number;
	parentId: number | null;
	moveId: number | null;
	categoryId: number | null;
	userId: number;
	showInGraph: boolean;
	showInPortfolioList: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

/** Shape for template trees or initial seed data (no ids = will be assigned on load). */
export interface TreeData {
	nodes: Array<Omit<Node, 'id'> & { id?: number }>;
	moves: Array<Omit<Move, 'id'> & { id?: number }>;
	categories: Array<Omit<Category, 'id'> & { id?: number }>;
}
