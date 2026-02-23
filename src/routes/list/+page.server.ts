import { redirect } from '@sveltejs/kit';
import { slugify } from '$lib/utils';

export async function load({ parent }) {
	const parentData = await parent();
	const trees = (parentData.trees ?? []) as { id: number; name: string }[];
	if (!trees.length) {
		return {};
	}
	const firstTree = trees[0];
	const slug = slugify(firstTree.name) || String(firstTree.id);
	throw redirect(302, `/list/${encodeURIComponent(slug)}`);
}
