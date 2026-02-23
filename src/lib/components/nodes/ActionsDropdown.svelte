<script lang="ts">
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import SproutIcon from '@lucide/svelte/icons/sprout';
	import StarIcon from '@lucide/svelte/icons/star';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { clearTreeCache } from '$lib/state/tree-cache';
	import type { ResolvedNode } from '$lib/types';

	let {
		node,
		treeName,
		onFavoriteChange,
		onWishlistChange,
		onDelete
	}: {
		node: ResolvedNode;
		treeName?: string;
		onFavoriteChange?: (nodeId: number, favorited: boolean) => void;
		onWishlistChange?: (nodeId: number, wishlisted: boolean) => void;
		onDelete?: (node: ResolvedNode) => void;
	} = $props();

	function persistFavorite(favorited: boolean) {
		if (!treeName) return;
		const formData = new FormData();
		formData.set('nodeId', String(node.id));
		formData.set('favorited', favorited ? 'true' : 'false');
		fetch(`/tree/${encodeURIComponent(treeName)}?/updateNodeFavorited`, {
			method: 'POST',
			body: formData
		}).then((res) => {
			if (res.ok) clearTreeCache(treeName);
		});
	}

	function persistWishlisted(wishlisted: boolean) {
		if (!treeName) return;
		const formData = new FormData();
		formData.set('nodeId', String(node.id));
		formData.set('wishlisted', wishlisted ? 'true' : 'false');
		fetch(`/tree/${encodeURIComponent(treeName)}?/updateNodeWishlisted`, {
			method: 'POST',
			body: formData
		}).then((res) => {
			if (res.ok) clearTreeCache(treeName);
		});
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="ghost" size="icon-sm" aria-label="Node actions">
			<MoreHorizontal strokeWidth={1.5} />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-44" align="end">
		<DropdownMenu.Label>Node Actions</DropdownMenu.Label>
		<DropdownMenu.Group>
			<DropdownMenu.Item
				onSelect={() => {
					const next = !node.favorited;
					onFavoriteChange?.(node.id, next);
					persistFavorite(next);
				}}
				class="cursor-pointer"
			>
				<StarIcon class={node.favorited ? 'fill-yellow-500 stroke-yellow-500' : ''} />
				Favorite
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					const next = !node.wishlisted;
					onWishlistChange?.(node.id, next);
					persistWishlisted(next);
				}}
				class="cursor-pointer"
			>
				<SproutIcon class={node.wishlisted ? 'fill-green-500 stroke-green-500' : ''} />
				Wishlist
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				variant="destructive"
				onSelect={() => onDelete?.(node)}
				class="cursor-pointer"
			>
				<Trash2Icon /> Delete
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
