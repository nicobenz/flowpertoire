<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { addTreeDialog } from '$lib/state/state.svelte.js';

	// Only rendered when there are no trees (load redirects to /tree/[name] when there are trees)
	const showEmpty = $derived($page.url.pathname === '/tree');
</script>

{#if showEmpty}
	<div
		class="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center text-muted-foreground"
	>
		<p>No trees yet. Create one from the sidebar.</p>
		<Button onclick={() => (addTreeDialog.open = true)} disabled={addTreeDialog.creating}>
			<span class="relative inline-flex items-center justify-center gap-2">
				<span class:invisible={addTreeDialog.creating} class="inline-flex items-center gap-2">
					<PlusIcon class="size-4" />
					Add a tree
				</span>
				{#if addTreeDialog.creating}
					<span class="absolute inset-0 flex items-center justify-center">
						<Spinner class="size-4" />
					</span>
				{/if}
			</span>
		</Button>
	</div>
{/if}
