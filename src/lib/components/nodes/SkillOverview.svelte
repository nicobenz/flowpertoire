<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { ResolvedNode, Skill } from '$lib/types';
	import AttachPopover from './AttachPopover.svelte';

	let { node, skill, treeName }: { node: ResolvedNode; skill?: Skill; treeName?: string } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{node.label}</Card.Title>
		{#if node.description != null && node.description !== ''}
			<Card.Description>{node.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content>
		{#if skill != null}
			<Label for="skill-rating" class="mb-2">Skill Rating</Label>
			<RadioGroup.Root
				bind:value={
					() => String(skill.skillRating),
					(v) => {
						skill.skillRating = Math.min(5, Math.max(0, Number(v)));
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
