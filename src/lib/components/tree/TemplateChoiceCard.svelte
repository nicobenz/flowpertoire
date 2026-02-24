<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	import { selection, templateSelection } from '$lib/state/state.svelte';
</script>

<ScrollArea class="h-[200px] w-full">
	<div class="w-full max-w-md">
		<Field.Group>
			<Field.Set>
				<Field.Label for="compute-environment-p8w"></Field.Label>
				<Field.Description></Field.Description>
				<RadioGroup.Root bind:value={selection.template}>
					{#each templateSelection.templates as template}
						<Field.Label for={template.labelId}>
							<Field.Field orientation="horizontal">
								<Field.Content>
									<Field.Title>{template.title}</Field.Title>
									<Field.Description>{template.desc}</Field.Description>
								</Field.Content>
								<RadioGroup.Item value={template.value} id={template.labelId} />
							</Field.Field>
						</Field.Label>
					{/each}
				</RadioGroup.Root>
			</Field.Set>
		</Field.Group>
	</div>
</ScrollArea>
