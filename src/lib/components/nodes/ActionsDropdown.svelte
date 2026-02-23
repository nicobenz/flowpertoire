<script lang="ts">
	import { enhance } from '$app/forms';
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
			<form
				method="POST"
				action="?/updateNodeFavorited"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success' && treeName) clearTreeCache(treeName);
					};
				}}
			>
				<input type="hidden" name="nodeId" value={node.id} />
				<button
					type="submit"
					name="favorited"
					value={node.favorited ? 'false' : 'true'}
					onclick={() => onFavoriteChange?.(node.id, !node.favorited)}
					class="relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
				>
					<StarIcon class={node.favorited ? 'fill-yellow-500 stroke-yellow-500' : ''} />
					Favorite
				</button>
			</form>
			<form
				method="POST"
				action="?/updateNodeWishlisted"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success' && treeName) clearTreeCache(treeName);
					};
				}}
			>
				<input type="hidden" name="nodeId" value={node.id} />
				<button
					type="submit"
					name="wishlisted"
					value={node.wishlisted ? 'false' : 'true'}
					onclick={() => onWishlistChange?.(node.id, !node.wishlisted)}
					class="relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
				>
					<SproutIcon class={node.wishlisted ? 'fill-green-500 stroke-green-500' : ''} />
					Wishlist
				</button>
			</form>
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
