<script lang="ts" module>
	import { sidebarMenuItems } from '$lib/nav-config.js';
	import { user } from '$lib/state/state.svelte';

	const data = {
		user,
		sidebarMenuItems
	};
</script>

<script lang="ts">
	import NavMenu from './nav-menu.svelte';
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import type { TreeSummary } from '$lib/types';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		trees = [] as TreeSummary[],
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { trees?: TreeSummary[] } = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher {trees} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMenu label="" items={data.sidebarMenuItems} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
