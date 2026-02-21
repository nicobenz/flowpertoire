import BirdhouseIcon from '@lucide/svelte/icons/birdhouse';
import BicepsFlexed from '@lucide/svelte/icons/biceps-flexed';
import CherryIcon from '@lucide/svelte/icons/cherry';
import PersonStandingIcon from '@lucide/svelte/icons/person-standing';
import BrainIcon from '@lucide/svelte/icons/brain';
import PartyPopperIcon from '@lucide/svelte/icons/party-popper';
import Settings2Icon from '@lucide/svelte/icons/settings-2';
import GaugeIcon from '@lucide/svelte/icons/gauge';

export const projects = [
	{ name: 'Home', url: '/', icon: BirdhouseIcon },
	{ name: 'Skills', url: '/tree', icon: BrainIcon },
	{ name: 'Celebrate', url: '/celebrate', icon: PartyPopperIcon },
	{ name: 'Progress', url: '/progress', icon: GaugeIcon },
	{ name: 'Settings', url: '/settings', icon: Settings2Icon }
];

export const teams = [
	{ name: 'Calisthenics', logo: BicepsFlexed, plan: 'Skill Tree' },
	{ name: 'Flow Arts', logo: CherryIcon, plan: 'Skill Tree' },
	{ name: 'Dance', logo: PersonStandingIcon, plan: 'Skill Tree' }
];

/** Skill Tree as expandable nav item (from nav-main style) */
const skillTreeNavItem = {
	title: 'Skills',
	url: '/tree',
	icon: BrainIcon,
	isActive: true,
	items: [
		{ title: 'Graph View', url: '/tree' },
		{ title: 'List View', url: '/list' }
	]
};

/** Sidebar menu: Home first, then Skill Tree (expandable), then other projects as regular links */
export const sidebarMenuItems = [
	...projects
		.filter((p) => p.name === 'Home')
		.map((p) => ({ title: p.name, url: p.url, icon: p.icon })),
	skillTreeNavItem,
	...projects
		.filter((p) => p.name !== 'Home' && p.name !== 'Skills')
		.map((p) => ({ title: p.name, url: p.url, icon: p.icon }))
];

export function getProjectLabel(pathname: string): string {
	const project = projects.find(
		(p) => p.url === pathname || (p.url !== '/' && pathname.startsWith(p.url + '/'))
	);
	return project?.name ?? (pathname || 'Home');
}
