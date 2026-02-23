<script lang="ts">
	import { tick } from 'svelte';
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import type { ResolvedNode, Skill } from '$lib/types';
	import { clearTreeCache } from '$lib/state/tree-cache';
	import AttachPopover from './AttachPopover.svelte';

	let {
		node,
		skill,
		effectiveRating,
		treeName,
		onRatingChange,
		onDelete
	}: {
		node: ResolvedNode;
		skill?: Skill;
		/** Override or DB rating so radio stays in sync with graph fill */
		effectiveRating?: number;
		treeName?: string;
		onRatingChange?: (skillId: number, rating: number) => void;
		onDelete?: (node: ResolvedNode) => void;
	} = $props();

	let ratingForm = $state<HTMLFormElement | undefined>();
	// Local rating driven by effectiveRating (override or DB) so radio and graph fill stay in sync
	let localRating = $state(0);
	$effect(() => {
		if (effectiveRating !== undefined) localRating = effectiveRating;
	});

	const updateRatingAction = $derived(
		treeName != null ? `/tree/${encodeURIComponent(treeName)}?/updateSkillRating` : '#'
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{node.label}</Card.Title>
		{#if node.description != null && node.description !== ''}
			<Card.Description>{node.description}</Card.Description>
		{/if}
		
			<div data-slot="card-action" class="row-span-2 self-start justify-self-end">
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					aria-label="Delete"
					onclick={() => onDelete?.(node)}
				>
					<Trash2Icon class="size-4 text-muted-foreground" />
				</Button>
			</div>
		
	</Card.Header>
	<Card.Content>
		{#if skill != null}
			<form
				bind:this={ratingForm}
				method="POST"
				action={updateRatingAction}
				use:enhance={() => {
					// No invalidateAll: fill is driven by onRatingChange + ratingOverrides (no full graph redraw)
					return async ({ result }) => {
						if (result.type === 'success' && treeName) clearTreeCache(treeName);
					};
				}}
			>
				<input type="hidden" name="skillId" value={skill.id} />
				<input type="hidden" name="skillRating" value={localRating} />
				<Label for="skill-rating" class="mb-2">Skill Rating</Label>
				<RadioGroup.Root
					bind:value={
						() => String(localRating),
						(v) => {
							const num = Math.min(5, Math.max(0, Number(v)));
							localRating = num;
							onRatingChange?.(skill.id, num);
							tick().then(() => ratingForm?.requestSubmit());
						}
					}
					id="skill-rating"
				>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="0" id="r0" />
						<Label for="r0">Not yet tried</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="1" id="r1" />
						<Label for="r1">Just started</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="2" id="r2" />
						<Label for="r2">Rough but there</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="3" id="r3" />
						<Label for="r3">Getting comfortable</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="4" id="r4" />
						<Label for="r4">Feeling confident</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="5" id="r5" />
						<Label for="r5">Fully polished</Label>
					</div>
				</RadioGroup.Root>
			</form>
		{:else}
			<Label for="skill-aggregate" class="mb-2">Skill Aggregate</Label>
			<p class="text-muted-foreground" id="skill-aggregate">
				{node.aggregateSkillRating != null
					? (() => {
							const r = Math.round(node.aggregateSkillRating! * 10) / 10;
							return Math.round(r * 10) % 10 === 0 ? String(Math.round(r)) : r.toFixed(1);
						})()
					: '—'}
			</p>
		{/if}
	</Card.Content>
	<Card.Footer>
		<AttachPopover parentNodeId={node.id} treeName={treeName} />
	</Card.Footer>
</Card.Root>
