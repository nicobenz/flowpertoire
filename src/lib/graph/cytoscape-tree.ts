/**
 * Convert TreeData (nodes, moves, categories) to Cytoscape elements (nodes + edges).
 * Node labels come from move title or category label.
 */

import type {
	TreeData,
	GraphStructure,
	Node,
	Move,
	Category,
	NodeEdgeType,
	ResolvedNode
} from '$lib/types';

function getLabel(
	node: Node,
	moves: { id: number; title: string }[],
	categories: { id: number; label: string }[]
): string {
	if (node.nodeType === 'move') {
		const m = moves.find((x) => x.id === node.moveId);
		if (m) return m.title;
	} else {
		const c = categories.find((x) => x.id === node.categoryId);
		if (c) return c.label;
	}
	return `Node ${node.id}`;
}

/**
 * Resolve a node with label, and with skillRating (if move) or description (if category).
 */
export function resolveNode(data: TreeData, node: Node): ResolvedNode {
	const movesList = data.moves as Move[];
	const categoriesList = data.categories as Category[];
	const label = getLabel(node, movesList, categoriesList);
	const resolved: ResolvedNode = { ...node, label };
	if (node.nodeType === 'move') {
		const move = movesList.find((m) => m.id === node.moveId);
		if (move) resolved.skillRating = move.skillRating;
	} else {
		const category = categoriesList.find((c) => c.id === node.categoryId);
		if (category) resolved.description = category.description ?? null;
	}
	return resolved;
}

export interface CytoscapeElement {
	group: 'nodes' | 'edges';
	data: {
		id: string;
		label?: string;
		source?: string;
		target?: string;
		edgeType?: NodeEdgeType;
		isRoot?: string;
		/** True for category nodes that are not roots (small 10×10 shape). */
		isCategoryNonRoot?: string;
		/** 0–100, from move skillRating (0→0%, 1→20%, …, 5→100%). Omit for category-only nodes. */
		fillPercent?: number;
	};
}

/**
 * Build Cytoscape elements from DAG data: one node per node, one edge per (parentId, childId).
 * Skips nodes without an id (templates may omit ids).
 * Accepts GraphStructure (no skillRating) so layout effect doesn't depend on ratings.
 */
export function treeToCytoscapeElements(
	data: TreeData | GraphStructure,
	skipFillPercent?: boolean
): CytoscapeElement[] {
	const { nodes, edges, moves, categories } = data;
	const elements: CytoscapeElement[] = [];
	const movesList = moves as Move[];
	const categoriesList = categories as Category[];

	// Nodes that appear as child in any parent edge are not roots
	const childIds = new Set(
		edges.filter((e) => (e.type ?? 'parent') === 'parent').map((e) => e.childId)
	);

	for (const node of nodes) {
		const nodeId = node.id;
		if (nodeId == null) continue;
		const id = String(nodeId);
		const isRoot = !childIds.has(nodeId);
		let fillPercent: number | undefined;
		if (!skipFillPercent && node.nodeType === 'move') {
			const move = movesList.find((m) => m.id === node.moveId);
			if (move) {
				const r = Math.min(5, Math.max(0, move.skillRating));
				fillPercent = (r / 5) * 100;
			}
		}
		const isCategoryNonRoot = !isRoot && node.nodeType === 'category';
		elements.push({
			group: 'nodes',
			data: {
				id,
				label: getLabel(node as Node, movesList, categoriesList),
				...(isRoot && { isRoot: 'true' }),
				...(isCategoryNonRoot && { isCategoryNonRoot: 'true' }),
				...(fillPercent !== undefined && { fillPercent })
			}
		});
	}

	for (const edge of edges) {
		const edgeType = edge.type ?? 'parent';
		const edgeId =
			edgeType === 'concept'
				? `e-concept-${Math.min(edge.parentId, edge.childId)}-${Math.max(edge.parentId, edge.childId)}`
				: `e-parent-${edge.parentId}-${edge.childId}`;
		elements.push({
			group: 'edges',
			data: {
				id: edgeId,
				source: String(edge.parentId),
				target: String(edge.childId),
				edgeType
			}
		});
	}

	return elements;
}

/**
 * Update fillPercent on existing Cytoscape nodes from tree data (move skill ratings).
 * Call this when only skill ratings changed so the graph is not recreated.
 */
export function updateNodeFillPercents(
	cy: {
		getElementById: (id: string) => {
			length: number;
			data: (key: string, value?: number) => unknown;
			removeData: (key: string) => void;
		};
	},
	data: TreeData
): void {
	const movesList = data.moves as Move[];
	for (const node of data.nodes) {
		if (node.id == null || node.nodeType !== 'move') continue;
		const move = movesList.find((m) => m.id === node.moveId);
		const fillPercent = move
			? (Math.min(5, Math.max(0, move.skillRating)) / 5) * 100
			: undefined;
		const el = cy.getElementById(String(node.id));
		if (el.length) {
			if (fillPercent !== undefined) el.data('fillPercent', fillPercent);
			else el.removeData('fillPercent');
		}
	}
}
