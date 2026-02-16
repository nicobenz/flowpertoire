import {
	pgTable,
	serial,
	integer,
	text,
	boolean,
	timestamp,
	pgEnum,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---- Enums ----

export const moveStatusEnum = pgEnum('move_status', [
	'wishlist',
	'learning',
	'mastered'
]);

// ---- Users (minimal; Auth.js will extend later) ----

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email'),
	// Auth.js adds more columns when we wire it up
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Move concepts (same move across props: e.g. "Three beat weave" in poi and hoop) ----

export const moveConcepts = pgTable('move_concepts', {
	id: serial('id').primaryKey()
	// Optional: canonical name/slug later; for now the concept is just a grouping id
});

// ---- Moves (concrete move: user-set rating and status; optional link to cross-prop concept) ----

export const moves = pgTable('moves', {
	id: serial('id').primaryKey(),
	conceptId: integer('concept_id').references(() => moveConcepts.id, { onDelete: 'set null' }),
	title: text('title').notNull(),
	skillRating: integer('skill_rating').notNull(), // 1–10
	status: moveStatusEnum('status').notNull().default('wishlist'),
	firstLandedAt: timestamp('first_landed_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Categories (label + description; rating is aggregate from children) ----

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	label: text('label').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Nodes (tree position; references move and/or category) ----

export const nodes = pgTable(
	'nodes',
	{
		id: serial('id').primaryKey(),
		parentId: integer('parent_id').references((): AnyPgColumn => nodes.id, {
			onDelete: 'cascade'
		}),
		moveId: integer('move_id').references(() => moves.id, { onDelete: 'cascade' }),
		categoryId: integer('category_id').references(() => categories.id, {
			onDelete: 'cascade'
		}),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		showInGraph: boolean('show_in_graph').notNull().default(true),
		showInPortfolioList: boolean('show_in_portfolio_list').notNull().default(true),
		sortOrder: integer('sort_order').notNull().default(0), // sibling order
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => [
		// At least one of move_id or category_id must be set
		// (enforced in app or via CHECK; Drizzle doesn't support CHECK in schema DSL easily, so we rely on app logic or raw migration)
	]
);

// ---- Relations (for typed queries / joins) ----

export const usersRelations = relations(users, ({ many }) => ({
	nodes: many(nodes)
}));

export const moveConceptsRelations = relations(moveConcepts, ({ many }) => ({
	moves: many(moves)
}));

export const movesRelations = relations(moves, ({ one }) => ({
	concept: one(moveConcepts, { fields: [moves.conceptId], references: [moveConcepts.id] }),
	node: one(nodes)
}));

export const categoriesRelations = relations(categories, ({ one }) => ({
	node: one(nodes)
}));

export const nodesRelations = relations(nodes, ({ one, many }) => ({
	parent: one(nodes, { fields: [nodes.parentId], references: [nodes.id] }),
	children: many(nodes),
	move: one(moves, { fields: [nodes.moveId], references: [moves.id] }),
	category: one(categories, { fields: [nodes.categoryId], references: [categories.id] }),
	user: one(users, { fields: [nodes.userId], references: [users.id] })
}));
