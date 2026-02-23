<script lang="ts" module>
	import { sidebarMenuItems } from '$lib/nav-config.js';
	import { user } from '$lib/state/state.svelte';

	const data = {
		user,
		sidebarMenuItems
	};
</script>

<script lang="ts">
	import { effectiveTreeSlug } from '$lib/state/tree-cache';
	import { slugify } from '$lib/utils';
	import NavMenu from './nav-menu.svelte';
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import type { TreeSummary } from '$lib/types';
	import type { NavItem } from './nav-menu.svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		trees = [] as TreeSummary[],
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { trees?: TreeSummary[] } = $props();

	const listViewSlug = $derived(
		$effectiveTreeSlug ?? (trees[0] ? slugify(trees[0].name) || String(trees[0].id) : '')
	);
	const sidebarItems = $derived.by((): NavItem[] => {
		const base = data.sidebarMenuItems as NavItem[];
		return base.map((item) => {
			if (item.title === 'Skills' && item.items?.length) {
				return {
					...item,
					items: item.items.map((sub: { title: string; url: string }) => {
						if (sub.title === 'Graph View') {
							return { ...sub, url: listViewSlug ? `/tree/${encodeURIComponent(listViewSlug)}` : '/tree' };
						}
						if (sub.title === 'List View') {
							return { ...sub, url: listViewSlug ? `/list/${encodeURIComponent(listViewSlug)}` : '/list' };
						}
						return sub;
					})
				};
			}
			return item;
		});
	});
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher {trees} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMenu label="" items={sidebarItems} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
