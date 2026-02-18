import {
	pgTable,
	serial,
	integer,
	text,
	boolean,
	timestamp,
	primaryKey,
	pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---- Users (minimal; Auth.js will extend later) ----

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email'),
	// Auth.js adds more columns when we wire it up
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Move concepts (same category across props: e.g. "Weaves" in poi and hoop) ----

export const moveConcepts = pgTable('move_concepts', {
	id: serial('id').primaryKey()
	// Optional: canonical name/slug later; for now the concept is just a grouping id
});

// ---- Moves (concrete move: user-set skill rating 0–5) ----

export const moves = pgTable('moves', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	skillRating: integer('skill_rating').notNull().default(0), // 0–5
	firstLandedAt: timestamp('first_landed_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Categories (label + description; optional link to cross-prop concept) ----

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	conceptId: integer('concept_id').references(() => moveConcepts.id, { onDelete: 'set null' }),
	label: text('label').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Nodes (DAG vertex; references move and/or category; structure via node_edges) ----

export const nodes = pgTable('nodes', {
	id: serial('id').primaryKey(),
	moveId: integer('move_id').references(() => moves.id, { onDelete: 'cascade' }),
	categoryId: integer('category_id').references(() => categories.id, {
		onDelete: 'cascade'
	}),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	showInGraph: boolean('show_in_graph').notNull().default(true),
	showInPortfolioList: boolean('show_in_portfolio_list').notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0), // sibling order (when rendered under one parent)
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Node edge type: directed (parent→child) or undirected (same concept) ----

export const nodeEdgeTypeEnum = pgEnum('node_edge_type', ['parent', 'concept']);

// ---- Node edges (DAG parent→child + undirected concept links; (parent_id, child_id, type) unique) ----

export const nodeEdges = pgTable(
	'node_edges',
	{
		parentId: integer('parent_id')
			.notNull()
			.references(() => nodes.id, { onDelete: 'cascade' }),
		childId: integer('child_id')
			.notNull()
			.references(() => nodes.id, { onDelete: 'cascade' }),
		type: nodeEdgeTypeEnum('type').notNull().default('parent'),
		sortOrder: integer('sort_order').notNull().default(0)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.parentId, table.childId, table.type] })
	})
);

// ---- Relations (for typed queries / joins) ----

export const usersRelations = relations(users, ({ many }) => ({
	nodes: many(nodes)
}));

export const moveConceptsRelations = relations(moveConcepts, ({ many }) => ({
	categories: many(categories)
}));

export const movesRelations = relations(moves, ({ one }) => ({
	node: one(nodes)
}));

export const categoriesRelations = relations(categories, ({ one }) => ({
	concept: one(moveConcepts, { fields: [categories.conceptId], references: [moveConcepts.id] }),
	node: one(nodes)
}));

export const nodeEdgesRelations = relations(nodeEdges, ({ one }) => ({
	parent: one(nodes, {
		fields: [nodeEdges.parentId],
		references: [nodes.id],
		relationName: 'parentEdges'
	}),
	child: one(nodes, {
		fields: [nodeEdges.childId],
		references: [nodes.id],
		relationName: 'childEdges'
	})
}));

export const nodesRelations = relations(nodes, ({ one, many }) => ({
	parentEdges: many(nodeEdges, { relationName: 'childEdges' }), // edges where this node is the child
	childEdges: many(nodeEdges, { relationName: 'parentEdges' }), // edges where this node is the parent
	move: one(moves, { fields: [nodes.moveId], references: [moves.id] }),
	category: one(categories, { fields: [nodes.categoryId], references: [categories.id] }),
	user: one(users, { fields: [nodes.userId], references: [users.id] })
}));
