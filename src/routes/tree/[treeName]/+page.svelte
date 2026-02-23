<script lang="ts">
	import { enhance } from '$app/forms';
	import { clearTreeCache } from '$lib/state/tree-cache';
	import {
		TreeGraph,
		type TreeGraphTheme,
		resolveNode
	} from '$lib/graph/cytoscape-tree';
	import SkillOverview from '$lib/components/nodes/SkillOverview.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import type { Skill, Node, ResolvedNode } from '$lib/types';

	let { data } = $props();

	let cyContainer: HTMLDivElement | undefined;
	let graph: TreeGraph | undefined;
	let selectedNodeId = $state<number | null>(null);

	let deleteDialogOpen = $state(false);
	let nodeToDelete = $state<ResolvedNode | null>(null);
	let deleteNodeError = $state('');
	let deleteSubmitting = $state(false);

	function openDeleteDialog(node: ResolvedNode) {
		nodeToDelete = node;
		deleteNodeError = '';
		deleteDialogOpen = true;
	}

	function handleDeleteNodeResult(result: {
		data?: { deleteNode?: { success?: boolean; error?: string } };
	}) {
		const deleteNode = result?.data?.deleteNode;
		if (deleteNode?.success) {
			deleteDialogOpen = false;
			nodeToDelete = null;
			deleteNodeError = '';
			selectedNodeId = null;
		} else if (deleteNode?.error) {
			deleteNodeError = deleteNode.error;
		}
	}

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
				onDelete={openDeleteDialog}
			/>
		</div>
	{/if}
</div>

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			method="POST"
			action="?/deleteNode"
			use:enhance={() => {
				deleteSubmitting = true;
				return async ({ result, update }) => {
					try {
						if (result.type === 'success' && result.data) {
							handleDeleteNodeResult(
								result as { data: { deleteNode?: { success?: boolean; error?: string } } }
							);
							clearTreeCache(data.treeName);
						}
						await update();
					} finally {
						deleteSubmitting = false;
					}
				};
			}}
		>
			{#if nodeToDelete?.id != null}
				<input type="hidden" name="nodeId" value={nodeToDelete.id} />
			{/if}
			<Dialog.Header>
				<Dialog.Title>Delete node</Dialog.Title>
				<Dialog.Description>
					{#if nodeToDelete}
						Delete &quot;{nodeToDelete.label}&quot;? This will remove this node and all its children.
					{:else}
						This will remove the node and all its children.
					{/if}
				</Dialog.Description>
			</Dialog.Header>
			{#if deleteNodeError}
				<p class="py-2 text-sm text-destructive">{deleteNodeError}</p>
			{/if}
			<Dialog.Footer>
				<Dialog.Close
					class={buttonVariants({ variant: 'outline' })}
					disabled={deleteSubmitting}
				>
					Cancel
				</Dialog.Close>
				<Button type="submit" variant="destructive" disabled={deleteSubmitting}>
					<span class="relative inline-flex items-center justify-center">
						<span class:invisible={deleteSubmitting}>Delete</span>
						{#if deleteSubmitting}
							<span class="absolute inset-0 flex items-center justify-center">
								<Spinner class="size-4" />
							</span>
						{/if}
					</span>
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
