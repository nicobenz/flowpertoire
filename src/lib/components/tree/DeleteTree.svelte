<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { enhance } from '$app/forms';

	interface Props {
		open: boolean;
		tree: { id: number; name: string } | null;
		onSuccess?: () => void;
	}
	let { open = $bindable(), tree = null, onSuccess }: Props = $props();

	let error = $state('');
	let submitting = $state(false);

	$effect(() => {
		if (open) error = '';
	});

	function handleResult(result: {
		data?: { deleteTree?: { success?: boolean; error?: string } };
	}) {
		const deleteTree = result?.data?.deleteTree;
		if (deleteTree?.success) {
			open = false;
			error = '';
			onSuccess?.();
		} else if (deleteTree?.error) {
			error = deleteTree.error;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			method="POST"
			action="/tree?/deleteTree"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					try {
						if (result.type === 'success' && result.data) {
							handleResult(
								result as { data: { deleteTree?: { success?: boolean; error?: string } } }
							);
						}
						await update();
					} finally {
						submitting = false;
					}
				};
			}}
		>
			{#if tree}
				<input type="hidden" name="treeId" value={tree.id} />
			{/if}
			<Dialog.Header>
				<Dialog.Title>Delete tree</Dialog.Title>
				<Dialog.Description>
					{#if tree}
						Delete &quot;{tree.name}&quot;? This will remove the tree and all its nodes.
					{:else}
						This will remove the tree and all its nodes.
					{/if}
				</Dialog.Description>
			</Dialog.Header>
			{#if error}
				<p class="py-2 text-sm text-destructive">{error}</p>
			{/if}
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })} disabled={submitting}
					>Cancel</Dialog.Close
				>
				<Button type="submit" variant="destructive" disabled={submitting}>
					<span class="relative inline-flex items-center justify-center">
						<span class:invisible={submitting}>Delete</span>
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
