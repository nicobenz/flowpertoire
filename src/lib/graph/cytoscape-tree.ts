/**
 * Convert TreeData (nodes, moves, categories) to Cytoscape elements (nodes + edges).
 * Node labels come from move title or category label.
 */

import type { TreeData, Node, Move, Category, NodeEdgeType } from '$lib/types';

function getLabel(
	node: Node,
	moves: { id: number; title: string }[],
	categories: { id: number; label: string }[]
): string {
	if (node.moveId != null) {
		const m = moves.find((x) => x.id === node.moveId);
		if (m) return m.title;
	}
	if (node.categoryId != null) {
		const c = categories.find((x) => x.id === node.categoryId);
		if (c) return c.label;
	}
	return `Node ${node.id}`;
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
		/** 0–100, from move skillRating (0→0%, 1→20%, …, 5→100%). Omit for category-only nodes. */
		fillPercent?: number;
	};
}

/**
 * Build Cytoscape elements from DAG data: one node per node, one edge per (parentId, childId).
 * Skips nodes without an id (templates may omit ids).
 */
export function treeToCytoscapeElements(data: TreeData): CytoscapeElement[] {
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
		// skillRating 0–5 → fill 0%, 20%, 40%, 60%, 80%, 100%; only moves have skillRating
		let fillPercent: number | undefined;
		if (node.moveId != null) {
			const move = movesList.find((m) => m.id === node.moveId);
			if (move) {
				const r = Math.min(5, Math.max(0, move.skillRating));
				fillPercent = (r / 5) * 100;
			}
		}
		elements.push({
			group: 'nodes',
			data: {
				id,
				label: getLabel({ ...node, id: nodeId }, movesList, categoriesList),
				...(isRoot && { isRoot: 'true' }),
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
