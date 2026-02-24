<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import BrainIcon from '@lucide/svelte/icons/brain';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { page } from '$app/stores';
	import { goto, preloadData } from '$app/navigation';
	import { slugify } from '$lib/utils';
	import type { TreeSummary } from '$lib/types';
	import { addTreeDialog } from '$lib/state/state.svelte.js';
	import { setEffectiveTreeSlug, getLastTreeSlug, setLastTreeSlug } from '$lib/state/tree-cache';
	import AddTree from './tree/AddTree.svelte';
	import DeleteTree from './tree/DeleteTree.svelte';

	let { trees = [] }: { trees?: TreeSummary[] } = $props();

	const sidebar = useSidebar();

	// Display list: each tree gets a default icon and plan label for the button UI
	const teams = $derived(
		trees.map((t) => ({
			id: t.id,
			name: t.name,
			logo: BrainIcon,
			plan: 'Skill Tree'
		}))
	);

	// Selected tree from URL (/tree/... or /list/... -> slug)
	const currentTreeSlug = $derived.by(() => {
		const treeMatch = $page.url.pathname.match(/^\/tree\/([^/]+)$/);
		const listMatch = $page.url.pathname.match(/^\/list\/([^/]+)$/);
		const match = treeMatch ?? listMatch;
		return match ? decodeURIComponent(match[1]).toLowerCase().trim() : null;
	});

	// Persist last selected tree so sidebar shows it when on non-tree routes (e.g. /settings)
	let lastSelectedTreeSlug = $state<string | null>(browser ? getLastTreeSlug() : null);
	$effect(() => {
		if (currentTreeSlug) lastSelectedTreeSlug = currentTreeSlug;
	});

	const effectiveTreeSlug = $derived(currentTreeSlug ?? lastSelectedTreeSlug);
	$effect(() => {
		setEffectiveTreeSlug(effectiveTreeSlug);
		if (effectiveTreeSlug) setLastTreeSlug(effectiveTreeSlug);
	});
	const activeTeam = $derived(
		teams.find((t) => slugify(t.name) === effectiveTreeSlug) ??
			teams[0] ?? { name: 'Add tree', logo: PlusIcon, plan: '' }
	);

	function changeTeam(_team: { id: number; name: string }) {
		const slug = slugify(_team.name) || String(_team.id);
		goto(`/tree/${encodeURIComponent(slug)}`);
	}

	function preloadTree(team: { id: number; name: string }) {
		if (!browser) return;
		const slug = slugify(team.name) || String(team.id);
		if (slug && slug !== effectiveTreeSlug) {
			preloadData(`/tree/${encodeURIComponent(slug)}`);
		}
	}

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	let deleteDialogOpen = $state(false);
	let treeToDelete = $state<{ id: number; name: string } | null>(null);
	let dropdownOpen = $state(false);

	function openDeleteDialog(team: { id: number; name: string }) {
		treeToDelete = team;
		deleteDialogOpen = true;
	}

	function onDeleteSuccess() {
		deleteDialogOpen = false;
		dropdownOpen = false;
		treeToDelete = null;
	}
</script>

{#if mounted}
	<AddTree />
	<DeleteTree
		bind:open={deleteDialogOpen}
		tree={treeToDelete}
		onSuccess={onDeleteSuccess}
	/>
{/if}

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root bind:open={dropdownOpen}>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
						>
							<activeTeam.logo class="size-4" />
						</div>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">
								{activeTeam.name}
							</span>
							<span class="truncate text-xs">{activeTeam.plan}</span>
						</div>
						<ChevronsUpDownIcon class="ms-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-xs text-muted-foreground">Skill Trees</DropdownMenu.Label>
				{#if teams.length === 0}
					<p class="px-2 py-1.5 text-sm text-muted-foreground">No trees yet. Add one below.</p>
				{:else}
					{#each teams as team (team.id)}
						<DropdownMenu.Item
							onSelect={() => changeTeam(team)}
							class="gap-2 p-2"
							{...mounted ? { onmouseenter: () => preloadTree(team) } : {}}
						>
							<div class="flex size-6 shrink-0 items-center justify-center rounded-md border">
								<team.logo class="size-3.5 shrink-0" />
							</div>
							<span class="min-w-0 flex-1 truncate">{team.name}</span>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								class="size-7 shrink-0 text-muted-foreground hover:text-destructive"
								aria-label="Delete tree"
								onclick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									openDeleteDialog(team);
								}}
							>
								<Trash2Icon class="size-4" />
							</Button>
						</DropdownMenu.Item>
					{/each}
				{/if}
				<DropdownMenu.Separator />
				<DropdownMenu.Item onSelect={() => (addTreeDialog.open = true)} class="gap-2 p-2">
					<div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
						<PlusIcon class="size-4" />
					</div>
					<div class="font-medium text-muted-foreground">Add tree</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
