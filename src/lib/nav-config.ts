import BirdhouseIcon from '@lucide/svelte/icons/birdhouse';
import BicepsFlexed from '@lucide/svelte/icons/biceps-flexed';
import CherryIcon from '@lucide/svelte/icons/cherry';
import PersonStandingIcon from '@lucide/svelte/icons/person-standing';
import TreesIcon from '@lucide/svelte/icons/trees';
import PartyPopperIcon from '@lucide/svelte/icons/party-popper';
import Settings2Icon from '@lucide/svelte/icons/settings-2';
import GaugeIcon from '@lucide/svelte/icons/gauge';

export const projects = [
	{ name: 'Home', url: '/', icon: BirdhouseIcon },
	{ name: 'Skill Tree', url: '/tree', icon: TreesIcon },
	{ name: 'Celebrate', url: '/celebrate', icon: PartyPopperIcon },
	{ name: 'Progress', url: '/progress', icon: GaugeIcon},
	{ name: 'Settings', url: '/settings', icon: Settings2Icon }
];

export const teams = [
	{ name: 'Calisthenics', logo: BicepsFlexed, plan: 'Root Tree' },
	{ name: 'Flow Arts', logo: CherryIcon, plan: 'Root Tree' },
	{ name: 'Dance', logo: PersonStandingIcon, plan: 'Root Tree' }
];

export function getProjectLabel(pathname: string): string {
	const project = projects.find((p) => p.url === pathname || (p.url !== '/' && pathname.startsWith(p.url + '/')));
	return project?.name ?? (pathname || 'Home');
}
