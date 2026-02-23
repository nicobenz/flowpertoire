<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import type { TreeData, Node, Skill } from '$lib/types';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';

	let { data } = $props();

	const treeData = $derived(data.treeData as TreeData | null);
	const treeNameSlug = $derived(data.treeName as string | null);

	/** Display name: root group label from treeData, or slug. */
	const treeDisplayName = $derived.by(() => {
		if (!treeData?.nodes?.length || !treeData?.groups?.length) return treeNameSlug ?? '';
		const childIds = new Set((treeData.edges ?? []).map((e) => e.childId));
		const rootNode = (treeData.nodes as Node[]).find(
			(n) => n.nodeType === 'group' && !childIds.has(n.id!)
		);
		if (!rootNode?.groupId) return treeNameSlug ?? '';
		const group = (treeData.groups as { id: number; label: string }[]).find(
			(g) => g.id === rootNode.groupId
		);
		return group?.label ?? treeNameSlug ?? '';
	});

	/** Rows for the table: skill nodes joined with skill title and rating. */
	const rows = $derived.by(() => {
		if (!treeData) return [];
		const skillsById = new Map<number, Skill>(
			(treeData.skills as Skill[]).filter((s) => s.id != null).map((s) => [s.id!, s])
		);
		return (treeData.nodes as Node[])
			.filter((n) => n.nodeType === 'skill' && n.skillId != null)
			.map((node) => {
				const skill = skillsById.get(node.skillId!);
				return {
					id: node.id,
					skill: skill?.title ?? `Skill ${node.skillId}`,
					rating: skill?.skillRating ?? 0,
					wishlisted: node.wishlisted,
					favorited: node.favorited
				};
			})
			.sort((a, b) => a.skill.localeCompare(b.skill));
	});
</script>

<div class="space-y-4">
	{#if !treeData}
		<p class="text-muted-foreground">No tree selected.</p>
	{:else if rows.length === 0}
		<p class="text-muted-foreground">No skills in this tree yet.</p>
	{:else}
		<Table.Root>
			<Table.Caption></Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Skill</Table.Head>
					<Table.Head>Rating</Table.Head>
					<Table.Head>Wishlist</Table.Head>
					<Table.Head>Favorite</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each rows as row (row.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{row.skill}</Table.Cell>
						<Table.Cell>{row.rating}</Table.Cell>
						<Table.Cell class="text-muted-foreground">
							{#if row.wishlisted}
								<CheckIcon />
							{:else}
								<XIcon strokeWidth={1.5} />
							{/if}
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">
							{#if row.favorited}
								<CheckIcon />
							{:else}
								<XIcon strokeWidth={1.5} />
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
