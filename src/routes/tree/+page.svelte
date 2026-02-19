<script lang="ts">
	import cytoscape from 'cytoscape';
	import d3Force from 'cytoscape-d3-force';
	import { getCurrentGraphStructure, getCurrentTreeData } from '$lib/state/state.svelte';
	import {
		treeToCytoscapeElements,
		updateNodeFillPercents,
		resolveNode
	} from '$lib/graph/cytoscape-tree';
	import SkillOverview from '$lib/components/nodes/SkillOverview.svelte';
	import type { Move, Node, ResolvedNode } from '$lib/types';

	cytoscape.use(d3Force);

	let cyContainer: HTMLDivElement | undefined;
	let cy: cytoscape.Core | undefined;
	let layout: ReturnType<cytoscape.Core['layout']> | undefined;
	let selectedNodeId = $state<number | null>(null);

	/** Resolve a CSS variable to rgb() – Cytoscape doesn't accept var(), only concrete colors. */
	function resolveColor(varName: string): string {
		const el = document.createElement('span');
		el.style.setProperty('color', `var(${varName})`);
		el.style.position = 'absolute';
		el.style.visibility = 'hidden';
		document.body.appendChild(el);
		const computed = getComputedStyle(el).color;
		el.remove();
		if (!computed) return 'rgb(0,0,0)';
		if (/^rgb|^rgba|^#/.test(computed)) return computed;
		try {
			const canvas = document.createElement('canvas');
			canvas.width = 1;
			canvas.height = 1;
			const ctx = canvas.getContext('2d');
			if (!ctx) return computed;
			ctx.fillStyle = computed;
			ctx.fillRect(0, 0, 1, 1);
			const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
			return `rgb(${r},${g},${b})`;
		} catch {
			return computed;
		}
	}

	/** Read font-family from layout.css (e.g. --font-sans). */
	function resolveFont(varName: string): string {
		const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
		return value || 'sans-serif';
	}

	// Depend only on graph structure (no skillRating) so rating changes don’t redraw or deselect
	$effect(() => {
		if (!cyContainer) return;
		const structure = getCurrentGraphStructure();
		if (!structure) return;
		selectedNodeId = null;
		const elements = treeToCytoscapeElements(structure, true);
		const primary = resolveColor('--primary');
		const gradientBackground = resolveColor('--background');
		const primaryFg = resolveColor('--foreground');
		const border = resolveColor('--secondary');
		const accent = resolveColor('--accent');
		const fontFamily = resolveFont('--font-sans');
		const cyStyle: cytoscape.StylesheetJson = [
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
					// skillRating 0→0% primary, 1→20%, …, 5→100% (bottom to top; fill = primary, rest = foreground)
					'background-fill': (node: cytoscape.NodeSingular) =>
						node.data('fillPercent') != null ? 'linear-gradient' : 'solid',
					'background-gradient-direction': 'to-top',
					'background-gradient-stop-positions': (node: cytoscape.NodeSingular) => {
						const p = Math.max(0, node.data('fillPercent') ?? 0);
						return [`0%`, `${p}%`, `${p}%`, `100%`];
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
				style: {
					shape: 'round-diamond',
					width: 50,
					height: 50,
				}
			},
			{
				selector: 'node[isCategoryNonRoot="true"]',
				style: {
					width: 15,
					height: 15,
				}
			},
			{
				selector: 'node.dimmed',
				style: {
					'background-opacity': 0.25,
					'text-opacity': 0.4,
					'outline-opacity': 0.25
				}
			},
			{
				selector: 'node.highlight',
				style: {
					'background-opacity': 1,
					'text-opacity': 1
				}
			},
			{
				selector: 'node:selected',
				style: {
					'outline-color': accent,
					'background-color': (node: cytoscape.NodeSingular) => {
						const p = node.data('fillPercent') as number | undefined;
						// Only move nodes have fillPercent; category nodes get full accent
						if (p == null) return accent;
						return p > 0 ? accent : gradientBackground;
					},
					'background-gradient-stop-colors': (node: cytoscape.NodeSingular) => {
						const p = node.data('fillPercent') as number | undefined;
						// Move with 0%: only outline visible (background fill)
						if (p != null && p <= 0)
							return [
								gradientBackground,
								gradientBackground,
								gradientBackground,
								gradientBackground
							];
						// Category: full accent; move with fill: accent gradient
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
			{
				selector: 'edge.dimmed',
				style: {
					'line-opacity': 0.2
				}
			},
			{
				selector: 'edge.highlight',
				style: {
					'line-opacity': 1
				}
			},
			{
				selector: 'edge[edgeType="concept"]',
				style: {
					'target-arrow-shape': 'none',
					'line-style': 'dashed'
				}
			}
		];

		// Tear down previous instance when data or selection changes
		layout?.stop();
		cy?.destroy();
		cy = undefined;
		layout = undefined;

		cy = cytoscape({
			container: cyContainer,
			elements,
			style: cyStyle,
			desktopTapThreshold: 8,
			touchTapThreshold: 12
		});

		// Highlight full subtree (node + descendants + edges) on mouseover; dim the rest
		function clearHighlight() {
			cy?.elements().removeClass('highlight dimmed');
		}
		function highlightSubtree(node: cytoscape.NodeSingular) {
			clearHighlight();
			// Traverse only along parent edges (successors(selector) filters out nodes; traverse manually)
			const subtreeNodes = cy!.collection().merge(node);
			const seen = new Set<string>([node.id()]);
			let frontier = [node];
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
			cy?.elements().not(subtreeNodes).not(subtreeEdges).addClass('dimmed');
		}
		cy.on('mouseover', 'node', (evt) => highlightSubtree(evt.target));
		cy.on('mouseout', 'node', () => clearHighlight());

		cy.on('tap', 'node', (evt) => {
			const node = evt.target;
			// Allow multiple selection with modifier; otherwise select only this node
			if (!evt.originalEvent?.shiftKey && !evt.originalEvent?.metaKey) {
				cy!.elements().unselect();
			}
			node.select();
			selectedNodeId = parseInt(node.id(), 10);
		});

		cy.on('tap', (evt) => {
			if (cy && evt.target === cy) {
				cy.elements().unselect();
				selectedNodeId = null;
			}
		});

		// d3-force: only link force (along edges) attracts; no center/x/y so unconnected nodes don't gravitate together.
		layout = cy.layout({
			name: 'd3-force',
			infinite: true,
			animate: true,
			fit: false,
			padding: 30,
			linkId: (d: { id?: string }) => d.id,
			// Shorter parent links = children stay near parents; longer concept links = less pull across tree
			linkDistance: (d: { edgeType?: string }) => (d.edgeType === 'concept' ? 240 : 60),
			linkStrength: (d: { edgeType?: string }) => (d.edgeType === 'concept' ? 0.25 : 1),
			velocityDecay: 0.55,
			// Stronger repulsion spreads siblings; distanceMax so only nearby nodes repel = subtrees stay coherent
			manyBodyStrength: -18,
			manyBodyDistanceMax: 220,
			collideRadius: 48,
			collideStrength: 1,
			// Slightly slower decay so layout has more time to settle into a less tangled state
			alphaDecay: 0.02,
			ungrabifyWhileSimulating: false,
			randomize: false
		} as cytoscape.LayoutOptions);
		layout.run();
		// Remove center and x/y forces so only link (edge) attraction and many-body repulsion apply
		const sim = (layout as { simulation?: { force: (name: string, f: unknown) => unknown } })
			.simulation;
		if (sim) {
			sim.force('center', null);
			sim.force('x', null);
			sim.force('y', null);
		}


		return () => {
			layout?.stop();
			cy?.destroy();
			cy = undefined;
			layout = undefined;
		};
	});

	// When only move skill ratings change, update node fill in place (no full redraw)
	$effect(() => {
		if (!cy) return;
		const data = getCurrentTreeData();
		if (!data) return;
		updateNodeFillPercents(cy, data);
	});

	// Selected node resolved for SkillOverview (top-left overlay)
	const selectedResolvedNode = $derived.by((): ResolvedNode | undefined => {
		if (selectedNodeId == null) return undefined;
		const data = getCurrentTreeData();
		if (!data?.nodes?.length) return undefined;
		const node = data.nodes.find((n) => n.id === selectedNodeId);
		return node && node.id != null ? resolveNode(data, node as Node) : undefined;
	});

	// The move object from state (for move nodes) – binding to move.skillRating updates state directly
	const selectedMove = $derived.by(() => {
		if (selectedNodeId == null) return undefined;
		const data = getCurrentTreeData();
		if (!data) return undefined;
		const node = data.nodes.find((n) => n.id === selectedNodeId);
		if (node?.nodeType !== 'move') return undefined;
		return data.moves.find((m) => m.id === node.moveId);
	});
</script>

<div class="graph-container">
	<div bind:this={cyContainer} class="cy"></div>
	{#if selectedResolvedNode}
		<div class="skill-overview-overlay">
			<SkillOverview node={selectedResolvedNode} move={selectedMove as Move | undefined} />
		</div>
	{/if}
</div>

<style>
	.graph-container {
		position: relative;
		width: 100%;
		height: 100vh;
		min-height: 400px;
	}
	.cy {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
	.skill-overview-overlay {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
</style>
