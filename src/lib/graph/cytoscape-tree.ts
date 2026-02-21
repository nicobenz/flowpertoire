/**
 * Convert TreeData (nodes, moves, categories) to Cytoscape elements (nodes + edges).
 * Node labels come from move title or category label.
 * TreeGraph class encapsulates all cytoscape instance, layout, and event logic.
 */

import cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
import type {
	TreeData,
	GraphStructure,
	Node,
	Move,
	Category,
	NodeEdgeType,
	ResolvedNode
} from '$lib/types';

cytoscape.use(d3Force);

/** Resolved theme values (e.g. from CSS variables) for graph styling. */
export interface TreeGraphTheme {
	primary: string;
	gradientBackground: string;
	primaryFg: string;
	border: string;
	accent: string;
	fontFamily: string;
}

function buildStylesheet(theme: TreeGraphTheme): cytoscape.StylesheetJson {
	const { primary, gradientBackground, primaryFg, border, accent, fontFamily } = theme;
	return [
		{
			selector: 'node',
			style: {
				label: 'data(label)',
				'text-valign': 'bottom',
				'text-halign': 'center',
				'text-margin-y': 4,
				'background-color': primary,
				color: primaryFg,
				'text-opacity': 1,
				'background-opacity': 1,
				'font-family': fontFamily,
				'font-size': 9,
				width: 28,
				height: 28,
				shape: 'ellipse',
				'border-width': 0,
				'outline-width': 1,
				'outline-color': primary,
				'outline-opacity': 1,
				'outline-offset': 0,
				'background-fill': (node: cytoscape.NodeSingular) =>
					node.data('fillPercent') != null ? 'linear-gradient' : 'solid',
				'background-gradient-direction': 'to-top',
				'background-gradient-stop-positions': (node: cytoscape.NodeSingular) => {
					const p = Math.max(0, node.data('fillPercent') ?? 0);
					return ['0%', `${p}%`, `${p}%`, '100%'];
				},
				'background-gradient-stop-colors': (node: cytoscape.NodeSingular) => {
					const p = node.data('fillPercent') ?? 0;
					if (p <= 0)
						return [
							gradientBackground,
							gradientBackground,
							gradientBackground,
							gradientBackground
						];
					return [primary, primary, gradientBackground, gradientBackground];
				}
			}
		},
		{
			selector: 'node[isRoot="true"]',
			style: { shape: 'round-diamond', width: 50, height: 50 }
		},
		{
			selector: 'node[isCategoryNonRoot="true"]',
			style: { width: 15, height: 15 }
		},
		{
			selector: 'node.dimmed',
			style: { 'background-opacity': 0.25, 'text-opacity': 0.4, 'outline-opacity': 0.25 }
		},
		{
			selector: 'node.highlight',
			style: { 'background-opacity': 1, 'text-opacity': 1 }
		},
		{
			selector: 'node:selected',
			style: {
				'outline-color': accent,
				'background-color': (node: cytoscape.NodeSingular) => {
					const p = node.data('fillPercent') as number | undefined;
					if (p == null) return accent;
					return p > 0 ? accent : gradientBackground;
				},
				'background-gradient-stop-colors': (node: cytoscape.NodeSingular) => {
					const p = node.data('fillPercent') as number | undefined;
					if (p != null && p <= 0)
						return [
							gradientBackground,
							gradientBackground,
							gradientBackground,
							gradientBackground
						];
					if (p == null) return [accent, accent, accent, accent];
					return [accent, accent, gradientBackground, gradientBackground];
				}
			}
		},
		{
			selector: 'edge',
			style: {
				'curve-style': 'bezier',
				'target-arrow-shape': 'triangle',
				width: 1,
				'line-color': border,
				'target-arrow-color': border,
				'line-opacity': 1
			}
		},
		{ selector: 'edge.dimmed', style: { 'line-opacity': 0.2 } },
		{ selector: 'edge.highlight', style: { 'line-opacity': 1 } },
		{
			selector: 'edge[edgeType="concept"]',
			style: { 'target-arrow-shape': 'none', 'line-style': 'dashed' }
		}
	];
}

/**
 * Encapsulates a Cytoscape tree graph: instance, layout, styling, and event handlers.
 * Call setStructure() when graph structure changes; call updateFillPercents() when only
 * move skill ratings change. Use onSelectionChange to react to node selection.
 */
export class TreeGraph {
	private cy: cytoscape.Core | undefined;
	private layout: ReturnType<cytoscape.Core['layout']> | undefined;
	private container: HTMLDivElement;
	private theme: TreeGraphTheme;
	private selectedNodeId: number | null = null;
	private onSelectionChange: (id: number | null) => void;

	constructor(options: {
		container: HTMLDivElement;
		theme: TreeGraphTheme;
		onSelectionChange?: (id: number | null) => void;
	}) {
		this.container = options.container;
		this.theme = options.theme;
		this.onSelectionChange = options.onSelectionChange ?? (() => {});
	}

	getSelectedNodeId(): number | null {
		return this.selectedNodeId;
	}

	/** Rebuild graph from structure. Selection is cleared. */
	setStructure(structure: GraphStructure): void {
		this.selectedNodeId = null;
		this.onSelectionChange(null);
		this.layout?.stop();
		this.cy?.destroy();
		this.cy = undefined;
		this.layout = undefined;

		const elements = treeToCytoscapeElements(structure, true);
		const style = buildStylesheet(this.theme);
		this.cy = cytoscape({
			container: this.container,
			elements,
			style,
			desktopTapThreshold: 8,
			touchTapThreshold: 12
		});

		this.attachEventHandlers();
		this.runLayout();
	}

	/** Update fill percent on existing nodes (e.g. when skill ratings change). No full redraw. */
	updateFillPercents(data: TreeData): void {
		if (!this.cy) return;
		updateNodeFillPercents(this.cy, data);
	}

	destroy(): void {
		this.layout?.stop();
		this.cy?.destroy();
		this.cy = undefined;
		this.layout = undefined;
		this.selectedNodeId = null;
	}

	private clearHighlight(): void {
		this.cy?.elements().removeClass('highlight dimmed');
	}

	private highlightSubtree(node: cytoscape.NodeSingular): void {
		this.clearHighlight();
		const cy = this.cy!;
		const subtreeNodes = cy.collection().merge(node);
		const seen = new Set<string>([node.id()]);
		let frontier: cytoscape.NodeSingular[] = [node];
		while (frontier.length > 0) {
			const next: cytoscape.NodeSingular[] = [];
			for (const n of frontier) {
				for (const edge of n.outgoers('edge').edges()) {
					if (edge.data('edgeType') !== 'parent') continue;
					const target = edge.target();
					const id = target.id();
					if (!seen.has(id)) {
						seen.add(id);
						subtreeNodes.merge(target);
						next.push(target);
					}
				}
			}
			frontier = next;
		}
		const subtreeEdges = subtreeNodes
			.connectedEdges()
			.filter(
				(e: cytoscape.EdgeSingular) =>
					e.data('edgeType') === 'parent' &&
					subtreeNodes.contains(e.source()) &&
					subtreeNodes.contains(e.target())
			);
		subtreeNodes.addClass('highlight');
		subtreeEdges.addClass('highlight');
		cy.elements().not(subtreeNodes).not(subtreeEdges).addClass('dimmed');
	}

	private attachEventHandlers(): void {
		const cy = this.cy!;
		cy.on('mouseover', 'node', (evt) => this.highlightSubtree(evt.target));
		cy.on('mouseout', 'node', () => this.clearHighlight());

		cy.on('tap', 'node', (evt) => {
			const node = evt.target;
			if (!evt.originalEvent?.shiftKey && !evt.originalEvent?.metaKey) {
				cy.elements().unselect();
			}
			node.select();
			this.selectedNodeId = parseInt(node.id(), 10);
			this.onSelectionChange(this.selectedNodeId);
		});

		cy.on('tap', (evt) => {
			if (evt.target === cy) {
				cy.elements().unselect();
				this.selectedNodeId = null;
				this.onSelectionChange(null);
			}
		});

		cy.on('grasp', 'node', () => {});
		cy.on('drag', 'node', () => {
			this.getSimulation()?.alphaTarget(0.3).restart();
		});
		cy.on('free', 'node', () => {
			this.getSimulation()?.alphaTarget(0);
		});
		cy.on('tapstart', 'node', () => {
			this.getSimulation()?.alphaTarget(0);
		});
	}

	private getSimulation(): { alphaTarget: (v: number) => { restart: () => void } } | undefined {
		const layout = this.layout as
			| { simulation?: { alphaTarget: (v: number) => { restart: () => void } } }
			| undefined;
		return layout?.simulation;
	}

	private runLayout(): void {
		const cy = this.cy!;
		this.layout = cy.layout({
			name: 'd3-force',
			infinite: true,
			animate: true,
			fit: false,
			padding: 30,
			linkId: (d: { id?: string }) => d.id,
			linkDistance: (d: { edgeType?: string }) => (d.edgeType === 'concept' ? 240 : 60),
			linkStrength: (d: { edgeType?: string }) => (d.edgeType === 'concept' ? 0.25 : 1),
			velocityDecay: 0.55,
			alphaTarget: 0,
			alpha: 0.1,
			alphaRestart: 0.1,
			xStrength: 0.05,
			yStrength: 0.05,
			manyBodyStrength: -18,
			manyBodyDistanceMax: 220,
			collideRadius: 48,
			collideStrength: 1,
			alphaDecay: 0.02,
			ungrabifyWhileSimulating: false,
			randomize: false
		} as cytoscape.LayoutOptions);
		this.layout.run();

		const sim = (this.layout as {
			simulation?: {
				force: (name: string, f: unknown) => unknown;
				alphaTarget: (v: number) => { restart: () => void };
			};
		}).simulation;
		if (sim) {
			sim.force('center', null);
			sim.force('x', null);
			sim.force('y', null);
		}
	}
}

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
 * Resolve a node with label, and with skillRating (if move) or description + aggregateSkillRating (if category).
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
		const childIdsByParent = getChildIdsByParent(data.edges);
		const fillPercent = categoryFillFromSubtree(
			node.id!,
			data.nodes,
			childIdsByParent,
			movesList
		);
		resolved.aggregateSkillRating = (fillPercent / 100) * 5;
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
		/** 0–100: moves from skillRating; categories from average of all moves in subtree. */
		fillPercent?: number;
	};
}

/** Build map parentId -> direct child ids (parent edges only). */
function getChildIdsByParent(edges: TreeData['edges']): Map<number, number[]> {
	const map = new Map<number, number[]>();
	for (const e of edges) {
		if ((e.type ?? 'parent') !== 'parent') continue;
		const list = map.get(e.parentId) ?? [];
		list.push(e.childId);
		map.set(e.parentId, list);
	}
	return map;
}

/** All descendant node ids reachable from startId via parent→child edges. */
function getDescendantIds(
	startId: number,
	childIdsByParent: Map<number, number[]>
): Set<number> {
	const out = new Set<number>();
	let frontier: number[] = [startId];
	while (frontier.length > 0) {
		const next: number[] = [];
		for (const id of frontier) {
			for (const c of childIdsByParent.get(id) ?? []) {
				if (!out.has(c)) {
					out.add(c);
					next.push(c);
				}
			}
		}
		frontier = next;
	}
	return out;
}

/**
 * Average fill (0–100) for a category from all moves in its subtree.
 * Traverses nested categories to include every move in the subtree.
 * Returns 0 if the subtree has no moves.
 */
function categoryFillFromSubtree(
	nodeId: number,
	nodes: TreeData['nodes'],
	childIdsByParent: Map<number, number[]>,
	movesList: Move[]
): number {
	const nodeById = new Map<number, Node>();
	for (const n of nodes) {
		if (n.id != null) nodeById.set(n.id, n as Node);
	}
	const descendantIds = getDescendantIds(nodeId, childIdsByParent);
	let sum = 0;
	let count = 0;
	for (const id of descendantIds) {
		const node = nodeById.get(id) as Node | undefined;
		if (!node || node.nodeType !== 'move') continue;
		const move = movesList.find((m) => m.id === node.moveId);
		if (move == null) continue;
		sum += Math.min(5, Math.max(0, move.skillRating));
		count += 1;
	}
	if (count === 0) return 0;
	return ((sum / count) / 5) * 100;
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
	const childIdsByParent = getChildIdsByParent(edges);

	for (const node of nodes) {
		const nodeId = node.id;
		if (nodeId == null) continue;
		const id = String(nodeId);
		const isRoot = !childIds.has(nodeId);
		let fillPercent: number | undefined;
		if (!skipFillPercent) {
			if (node.nodeType === 'move') {
				const move = movesList.find((m) => m.id === node.moveId);
				if (move) {
					const r = Math.min(5, Math.max(0, move.skillRating));
					fillPercent = (r / 5) * 100;
				}
			} else {
				// Category: aggregate of all moves in subtree (including nested categories)
				fillPercent = categoryFillFromSubtree(
					nodeId,
					nodes,
					childIdsByParent,
					movesList
				);
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
 * Update fillPercent on existing Cytoscape nodes from tree data.
 * Moves: own skillRating. Categories: average of all moves in subtree.
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
	const childIdsByParent = getChildIdsByParent(data.edges);
	for (const node of data.nodes) {
		if (node.id == null) continue;
		let fillPercent: number | undefined;
		if (node.nodeType === 'move') {
			const move = movesList.find((m) => m.id === node.moveId);
			fillPercent = move
				? (Math.min(5, Math.max(0, move.skillRating)) / 5) * 100
				: undefined;
		} else {
			fillPercent = categoryFillFromSubtree(
				node.id,
				data.nodes,
				childIdsByParent,
				movesList
			);
		}
		const el = cy.getElementById(String(node.id));
		if (el.length) {
			if (fillPercent !== undefined) el.data('fillPercent', fillPercent);
			else el.removeData('fillPercent');
		}
	}
}
