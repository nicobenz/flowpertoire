<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { ResolvedNode } from '$lib/types';
	import type { Move } from '$lib/types';

	let { node, move }: { node: ResolvedNode; move?: Move } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{node.label}</Card.Title>
		{#if node.description != null && node.description !== ''}
			<Card.Description>{node.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content>
		{#if move != null}
			<Label for="skill-rating" class="mb-2">Skill Rating</Label>
			<RadioGroup.Root
				bind:value={
					() => String(move.skillRating),
					(v) => {
						move.skillRating = Math.min(5, Math.max(0, Number(v)));
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
            Skill rating aggregate from subtree: WIP
		{/if}
        
	</Card.Content>
</Card.Root>
