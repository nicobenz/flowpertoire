<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import BrainIcon from '@lucide/svelte/icons/brain';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { slugify } from '$lib/utils';
	import type { TreeSummary } from '$lib/types';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { addTreeDialog } from '$lib/state/state.svelte.js';

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

	// Selected tree from URL (/tree/bjj -> slug "bjj")
	const currentTreeSlug = $derived.by(() => {
		const match = $page.url.pathname.match(/^\/tree\/([^/]+)$/);
		return match ? decodeURIComponent(match[1]).toLowerCase().trim() : null;
	});

	const activeTeam = $derived(
		teams.find((t) => slugify(t.name) === currentTreeSlug) ??
			teams[0] ?? { name: 'Add tree', logo: PlusIcon, plan: '' }
	);

	function changeTeam(_team: { id: number; name: string }) {
		const slug = slugify(_team.name) || String(_team.id);
		goto(`/tree/${encodeURIComponent(slug)}`);
	}

	let addTreeLabel = $state('');
	let addTreeError = $state('');
	let createSubmitting = $state(false);

	function handleAddTreeResult(result: {
		data?: { createTree?: { success?: boolean; error?: string; treeId?: number } };
	}) {
		const createTree = result?.data?.createTree;
		if (createTree?.success) {
			addTreeDialog.open = false;
			addTreeLabel = '';
			addTreeError = '';
			// Server redirects to the new tree on success, so no client goto needed
		} else if (createTree?.error) {
			addTreeError = createTree.error;
		}
	}

	let deleteDialogOpen = $state(false);
	let treeToDelete = $state<{ id: number; name: string } | null>(null);
	let deleteTreeError = $state('');
	let dropdownOpen = $state(false);
	let deleteSubmitting = $state(false);

	function openDeleteDialog(team: { id: number; name: string }) {
		treeToDelete = team;
		deleteTreeError = '';
		deleteDialogOpen = true;
	}

	function handleDeleteTreeResult(result: {
		data?: { deleteTree?: { success?: boolean; error?: string } };
	}) {
		const deleteTree = result?.data?.deleteTree;
		if (deleteTree?.success) {
			deleteDialogOpen = false;
			dropdownOpen = false;
			treeToDelete = null;
			deleteTreeError = '';
		} else if (deleteTree?.error) {
			deleteTreeError = deleteTree.error;
		}
	}
</script>

<Dialog.Root bind:open={addTreeDialog.open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			method="POST"
			action="/tree?/createTree"
			use:enhance={() => {
				createSubmitting = true;
				return async ({ result, update }) => {
					try {
						if (result.type === 'redirect') {
							// Server redirected to the new tree; close dialog and clear form before navigation
							addTreeDialog.open = false;
							addTreeLabel = '';
							addTreeError = '';
						} else if (result.type === 'success' && result.data) {
							handleAddTreeResult(
								result as {
									data: { createTree?: { success?: boolean; error?: string; treeId?: number } };
								}
							);
						}
						await update();
					} finally {
						createSubmitting = false;
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
						bind:value={addTreeLabel}
						aria-invalid={!!addTreeError}
					/>
					{#if addTreeError}
						<p class="text-sm text-destructive">{addTreeError}</p>
					{/if}
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })} disabled={createSubmitting}
					>Cancel</Dialog.Close
				>
				<Button type="submit" disabled={createSubmitting}>
					<span class="relative inline-flex items-center justify-center">
						<span class:invisible={createSubmitting}>Create</span>
						{#if createSubmitting}
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

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			method="POST"
			action="/tree?/deleteTree"
			use:enhance={() => {
				deleteSubmitting = true;
				return async ({ result, update }) => {
					try {
						if (result.type === 'success' && result.data) {
							handleDeleteTreeResult(
								result as { data: { deleteTree?: { success?: boolean; error?: string } } }
							);
						}
						await update();
					} finally {
						deleteSubmitting = false;
					}
				};
			}}
		>
			{#if treeToDelete}
				<input type="hidden" name="treeId" value={treeToDelete.id} />
			{/if}
			<Dialog.Header>
				<Dialog.Title>Delete tree</Dialog.Title>
				<Dialog.Description>
					{#if treeToDelete}
						Delete &quot;{treeToDelete.name}&quot;? This will remove the tree and all its nodes.
					{:else}
						This will remove the tree and all its nodes.
					{/if}
				</Dialog.Description>
			</Dialog.Header>
			{#if deleteTreeError}
				<p class="py-2 text-sm text-destructive">{deleteTreeError}</p>
			{/if}
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })} disabled={deleteSubmitting}
					>Cancel</Dialog.Close
				>
				<Button type="submit" variant="destructive" disabled={deleteSubmitting}>
					<span class="relative inline-flex items-center justify-center">
						<span class:invisible={deleteSubmitting}>Delete</span>
						{#if deleteSubmitting}
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
						<DropdownMenu.Item onSelect={() => changeTeam(team)} class="gap-2 p-2">
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
