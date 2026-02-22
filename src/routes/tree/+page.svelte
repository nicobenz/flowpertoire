<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { addTreeDialog } from '$lib/state/state.svelte.js';

	// Only rendered when there are no trees (load redirects to /tree/[name] when there are trees)
	const showEmpty = $derived($page.url.pathname === '/tree');
</script>

{#if showEmpty}
	<div
		class="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center text-muted-foreground"
	>
		<p>No trees yet. Create one from the sidebar.</p>
		<Button onclick={() => (addTreeDialog.open = true)}>
			<PlusIcon class="size-4" />
			Add a tree
		</Button>
	</div>
{/if}
