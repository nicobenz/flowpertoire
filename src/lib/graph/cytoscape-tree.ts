/**
 * Convert TreeData (nodes, moves, categories) to Cytoscape elements (nodes + edges).
 * Node labels come from move title or category label.
 */

import type { TreeData, Node, Move, Category } from '$lib/types';

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
	};
}

/**
 * Build Cytoscape elements from tree data: one node per node, one edge per parent-child.
 * Skips nodes without an id (templates may omit ids).
 */
export function treeToCytoscapeElements(data: TreeData): CytoscapeElement[] {
	const { nodes, moves, categories } = data;
	const elements: CytoscapeElement[] = [];
	const movesList = moves as Move[];
	const categoriesList = categories as Category[];

	for (const node of nodes) {
		const nodeId = node.id;
		if (nodeId == null) continue;
		const id = String(nodeId);
		elements.push({
			group: 'nodes',
			data: {
				id,
				label: getLabel({ ...node, id: nodeId }, movesList, categoriesList)
			}
		});
		if (node.parentId != null) {
			elements.push({
				group: 'edges',
				data: {
					id: `e-${node.parentId}-${nodeId}`,
					source: String(node.parentId),
					target: id
				}
			});
		}
	}

	return elements;
}
