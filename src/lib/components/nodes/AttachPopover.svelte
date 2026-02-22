<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let { parentNodeId, treeName }: { parentNodeId: number; treeName?: string } = $props();

	let groupOpen = $state(false);
	let skillOpen = $state(false);
	let groupName = $state('');
	let groupDesc = $state('');
	let skillName = $state('');

	const canSubmit = $derived(!!treeName && parentNodeId != null);
	const groupAction = $derived(treeName ? `/tree/${encodeURIComponent(treeName)}?/addGroup` : '#');
	const skillAction = $derived(treeName ? `/tree/${encodeURIComponent(treeName)}?/addSkill` : '#');
</script>

<ButtonGroup.Root>
	<Popover.Root bind:open={groupOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props} disabled={!canSubmit}>Attach Group</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content>
			<form
				method="POST"
				action={groupAction}
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type !== 'success') return;
						const data = result.data as { addGroup?: { success?: boolean } } | undefined;
						if (data?.addGroup?.success) {
							groupName = '';
							groupDesc = '';
							groupOpen = false;
							await invalidateAll();
						}
					};
				}}
			>
				<input type="hidden" name="parentNodeId" value={parentNodeId} />
				<Field.Set>
					<Field.Legend>Attach a group</Field.Legend>
					<Field.Description
						>A group acts as a container for skills or other groups.</Field.Description
					>
					<Field.Group>
						<Field.Field>
							<Input
								id="groupName"
								name="label"
								placeholder="Group name"
								bind:value={groupName}
							/>
						</Field.Field>
						<Field.Field>
							<Textarea
								id="groupDescription"
								name="description"
								placeholder="Optional group description"
								bind:value={groupDesc}
								rows={4}
							/>
						</Field.Field>
						<Field.Field orientation="responsive">
							<Button type="submit" disabled={groupName.trim() === ''}>Attach</Button>
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</form>
		</Popover.Content>
	</Popover.Root>
	<Popover.Root bind:open={skillOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props} disabled={!canSubmit}>Attach Skill</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content>
			<form
				method="POST"
				action={skillAction}
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type !== 'success') return;
						const data = result.data as { addSkill?: { success?: boolean } } | undefined;
						if (data?.addSkill?.success) {
							skillName = '';
							skillOpen = false;
							await invalidateAll();
						}
					};
				}}
			>
				<input type="hidden" name="parentNodeId" value={parentNodeId} />
				<Field.Set>
					<Field.Legend>Attach a skill</Field.Legend>
					<Field.Description
						>A skill is something you want to learn or already know.</Field.Description
					>
					<Field.Group>
						<Field.Field>
							<Input
								id="skillName"
								name="title"
								placeholder="Skill name"
								bind:value={skillName}
							/>
						</Field.Field>
						<Field.Field orientation="responsive">
							<Button type="submit" disabled={skillName.trim() === ''}>Attach</Button>
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</form>
		</Popover.Content>
	</Popover.Root>
</ButtonGroup.Root>
