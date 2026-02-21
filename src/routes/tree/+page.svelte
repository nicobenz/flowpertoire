<script lang="ts">
	import { getCurrentGraphStructure, getCurrentTreeData } from '$lib/state/state.svelte';
	import {
		TreeGraph,
		type TreeGraphTheme,
		resolveNode
	} from '$lib/graph/cytoscape-tree';
	import SkillOverview from '$lib/components/nodes/SkillOverview.svelte';
	import type { Move, Node, ResolvedNode } from '$lib/types';

	let cyContainer: HTMLDivElement | undefined;
	let graph: TreeGraph | undefined;
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

	function getTheme(): TreeGraphTheme {
		return {
			primary: resolveColor('--primary'),
			gradientBackground: resolveColor('--background'),
			primaryFg: resolveColor('--foreground'),
			border: resolveColor('--secondary'),
			accent: resolveColor('--accent'),
			fontFamily: resolveFont('--font-sans')
		};
	}

	// Create/destroy graph when container is available; update selection via callback
	$effect(() => {
		if (!cyContainer) return;
		const theme = getTheme();
		graph = new TreeGraph({
			container: cyContainer,
			theme,
			onSelectionChange: (id) => {
				selectedNodeId = id;
			}
		});
		return () => {
			graph?.destroy();
			graph = undefined;
		};
	});

	// When graph structure changes, rebuild graph (selection is cleared inside TreeGraph)
	$effect(() => {
		if (!graph) return;
		const structure = getCurrentGraphStructure();
		if (!structure) return;
		graph.setStructure(structure);
	});

	// When only move skill ratings change, update node fill in place (no full redraw)
	$effect(() => {
		if (!graph) return;
		const data = getCurrentTreeData();
		if (!data) return;
		graph.updateFillPercents(data);
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

<div class="relative w-full h-screen min-h-[400px]">
	<div bind:this={cyContainer} class="absolute inset-0 w-full h-full z-0"></div>
	{#if selectedResolvedNode}
		<div class="absolute top-0 left-0 z-10">
			<SkillOverview node={selectedResolvedNode} move={selectedMove as Move | undefined} />
		</div>
	{/if}
</div>
