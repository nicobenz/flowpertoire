<script lang="ts" module>
	import { teams, sidebarMenuItems } from '$lib/nav-config.js';

	const data = {
		user: {
			name: 'Emmy Example',
			email: 'emmy@example.com',
			avatar: '/avatars/emmy.jpg'
		},
		teams,
		sidebarMenuItems
	};
</script>

<script lang="ts">
	import NavMenu from './nav-menu.svelte';
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMenu label="" items={data.sidebarMenuItems} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
