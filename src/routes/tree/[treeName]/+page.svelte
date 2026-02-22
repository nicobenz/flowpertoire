<script lang="ts">
	import {
		TreeGraph,
		type TreeGraphTheme,
		resolveNode
	} from '$lib/graph/cytoscape-tree';
	import SkillOverview from '$lib/components/nodes/SkillOverview.svelte';
	import type { Skill, Node, ResolvedNode } from '$lib/types';

	let { data } = $props();

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

	const treeData = $derived(data.treeData);
	const graphStructure = $derived(data.graphStructure);

	// Optimistic rating overrides: drive graph fill from UI without refetch (no full redraw)
	let ratingOverrides = $state<Record<number, number>>({});
	const treeDataForFill = $derived.by(() => {
		if (!treeData) return null;
		const overrides = ratingOverrides;
		return {
			...treeData,
			skills: treeData.skills.map((s) => {
				if (s.id != null && s.id in overrides) {
					return { ...s, skillRating: overrides[s.id] };
				}
				return s;
			})
		};
	});

	function onRatingChange(skillId: number, rating: number): void {
		ratingOverrides = { ...ratingOverrides, [skillId]: rating };
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
		if (!graphStructure) return;
		graph.setStructure(graphStructure);
	});

	// When skill ratings change (treeData or optimistic overrides), update node fill in place (no full redraw)
	$effect(() => {
		if (!graph) return;
		if (!treeDataForFill) return;
		graph.updateFillPercents(treeDataForFill);
	});

	// Selected node resolved for SkillOverview (reactive to rating overrides for aggregate)
	const selectedResolvedNode = $derived.by((): ResolvedNode | undefined => {
		if (selectedNodeId == null) return undefined;
		if (!treeData?.nodes?.length) return undefined;
		const node = treeData.nodes.find((n) => n.id === selectedNodeId);
		if (!node || node.id == null) return undefined;
		const dataForResolve = treeDataForFill ?? treeData;
		return resolveNode(dataForResolve, node as Node);
	});

	const selectedSkill = $derived.by(() => {
		if (selectedNodeId == null) return undefined;
		if (!treeData) return undefined;
		const node = treeData.nodes.find((n) => n.id === selectedNodeId);
		if (node?.nodeType !== 'skill') return undefined;
		return treeData.skills.find((s) => s.id === node.skillId);
	});

	// Effective rating for selected skill (override or DB) so radio and fill stay in sync
	const effectiveSkillRating = $derived.by(() => {
		const s = selectedSkill;
		if (!s || s.id == null) return undefined;
		return s.id in ratingOverrides ? ratingOverrides[s.id] : s.skillRating;
	});
</script>

<div class="relative w-full h-screen min-h-[400px]">
	<div bind:this={cyContainer} class="absolute inset-0 w-full h-full z-0"></div>
	{#if selectedResolvedNode}
		<div class="absolute top-0 left-0 z-10">
			<SkillOverview
				node={selectedResolvedNode}
				skill={selectedSkill as Skill | undefined}
				effectiveRating={effectiveSkillRating}
				treeName={data.treeName}
				onRatingChange={onRatingChange}
			/>
		</div>
	{/if}
</div>
