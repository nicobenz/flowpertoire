<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import cytoscape from 'cytoscape';
	import d3Force from 'cytoscape-d3-force';
	import { tree } from '$lib/state/state.svelte';
	import { treeToCytoscapeElements } from '$lib/graph/cytoscape-tree';

	cytoscape.use(d3Force);

	let cyContainer: HTMLDivElement | undefined;
	let cy: cytoscape.Core | undefined;
	let layout: ReturnType<cytoscape.Core['layout']> | undefined;

	onMount(() => {
		if (!cyContainer) return;
		const data = tree.default;
		const elements = treeToCytoscapeElements(data);
		cy = cytoscape({
			container: cyContainer,
			elements,
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(label)',
						'text-valign': 'bottom',
						'text-halign': 'center',
						'text-margin-y': 4,
						'background-color': '#6366f1',
						color: '#000',
						width: 28,
						height: 28,
						'font-size': 9
					}
				},
				{
					selector: 'edge',
					style: {
						'curve-style': 'bezier',
						'target-arrow-shape': 'triangle',
						width: 2
					}
				}
			]
		});

		// d3-force infinite: edges act as springs — when you drag and stretch an edge, the link force pulls nodes back together.
		layout = cy.layout({
			name: 'd3-force',
			infinite: true,
			animate: true,
			fit: false,
			padding: 30,
			linkId: (d: { id?: string }) => d.id,
			linkDistance: 80,
			linkStrength: 1,
			velocityDecay: 0.75,
			manyBodyStrength: -6,
			collideRadius: 44,
			collideStrength: 1,
			ungrabifyWhileSimulating: false,
			randomize: false
		} as cytoscape.LayoutOptions);
		layout.run();
	});

	onDestroy(() => {
		layout?.stop();
		cy?.destroy();
	});
</script>

<div class="graph-container">
	<div bind:this={cyContainer} class="cy"></div>
</div>

<style>
	.graph-container {
		width: 100%;
		height: 100vh;
		min-height: 400px;
	}
	.cy {
		width: 100%;
		height: 100%;
	}
</style>
