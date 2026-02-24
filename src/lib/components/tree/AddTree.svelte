<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { enhance } from '$app/forms';
	import { addTreeDialog } from '$lib/state/state.svelte.js';

	let label = $state('');
	let error = $state('');
	let submitting = $state(false);

	function handleResult(result: {
		data?: { createTree?: { success?: boolean; error?: string; treeId?: number } };
	}) {
		const createTree = result?.data?.createTree;
		if (createTree?.success) {
			addTreeDialog.open = false;
			label = '';
			error = '';
		} else if (createTree?.error) {
			error = createTree.error;
		}
	}
</script>

<Dialog.Root bind:open={addTreeDialog.open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			method="POST"
			action="/tree?/createTree"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					try {
						if (result.type === 'redirect') {
							addTreeDialog.open = false;
							label = '';
							error = '';
						} else if (result.type === 'success' && result.data) {
							handleResult(
								result as {
									data: { createTree?: { success?: boolean; error?: string; treeId?: number } };
								}
							);
						}
						await update();
					} finally {
						submitting = false;
					}
				};
			}}
		>
			<Dialog.Header>
				<Dialog.Title>Add tree</Dialog.Title>
				<Dialog.Description>Create a new skill tree (root group).</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="tree-label">Name</Label>
					<Input
						id="tree-label"
						name="label"
						type="text"
						placeholder="e.g. Calisthenics"
						required
						bind:value={label}
						aria-invalid={!!error}
					/>
					{#if error}
						<p class="text-sm text-destructive">{error}</p>
					{/if}
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })} disabled={submitting}
					>Cancel</Dialog.Close
				>
				<Button type="submit" disabled={submitting}>
					<span class="relative inline-flex items-center justify-center">
						<span class:invisible={submitting}>Create</span>
						{#if submitting}
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
