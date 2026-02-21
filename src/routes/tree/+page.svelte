<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import PlusIcon from '@lucide/svelte/icons/plus';

	// Only rendered when there are no trees (load redirects to /tree/[id] when there are trees)
	const showEmpty = $derived($page.url.pathname === '/tree');
</script>

{#if showEmpty}
	<div class="flex flex-col items-center justify-center gap-4 min-h-[50vh] text-center text-muted-foreground">
		<p>No trees yet. Create one from the sidebar.</p>
		<Button onclick={() => (window.location.href = '/')}>
			<PlusIcon class="size-4" />
			Open sidebar to add a tree
		</Button>
	</div>
{/if}
