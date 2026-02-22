import {
	pgTable,
	serial,
	integer,
	text,
	boolean,
	timestamp,
	primaryKey,
	pgEnum,
	check
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// ---- Users (minimal; Auth.js will extend later) ----

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email'),
	// Auth.js adds more columns when we wire it up
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Skills (concrete skill: user-set skill rating 0–5) ----

export const skills = pgTable('skills', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	skillRating: integer('skill_rating').notNull().default(0), // 0–5
	firstLandedAt: timestamp('first_landed_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Groups (label + description) ----

export const groups = pgTable('groups', {
	id: serial('id').primaryKey(),
	label: text('label').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// ---- Node type: each node is either a skill or a group (no hybrid) ----

export const nodeTypeEnum = pgEnum('node_type', ['skill', 'group']);

// ---- Nodes (DAG vertex; exactly one of skill or group; structure via node_edges) ----

export const nodes = pgTable(
	'nodes',
	{
		id: serial('id').primaryKey(),
		nodeType: nodeTypeEnum('node_type').notNull(),
		skillId: integer('skill_id').references(() => skills.id, { onDelete: 'cascade' }),
		groupId: integer('group_id').references(() => groups.id, {
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
	},
	(table) => [
		// Enforce: skill node has skillId set and groupId null; group node the opposite
		check(
			'node_type_skill_or_group',
			sql`(
        (${table.nodeType} = 'skill' AND ${table.skillId} IS NOT NULL AND ${table.groupId} IS NULL) OR
        (${table.nodeType} = 'group' AND ${table.skillId} IS NULL AND ${table.groupId} IS NOT NULL)
      )`
		)
	]
);

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

export const skillsRelations = relations(skills, ({ one }) => ({
	node: one(nodes)
}));

export const groupsRelations = relations(groups, ({ one }) => ({
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
	skill: one(skills, { fields: [nodes.skillId], references: [skills.id] }),
	group: one(groups, { fields: [nodes.groupId], references: [groups.id] }),
	user: one(users, { fields: [nodes.userId], references: [users.id] })
}));
