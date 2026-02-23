import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { getCachedTree, setCachedTree } from '$lib/state/tree-cache';
import type { TreeData, GraphStructure } from '$lib/types';

export async function load({ data, fetch }) {
	const treeName = data.treeName;
	if (!treeName) return data;

	if (browser) {
		const cached = getCachedTree(treeName);
		if (cached) {
			return { ...data, treeData: cached.treeData, graphStructure: cached.graphStructure };
		}
	}

	const res = await fetch(`/api/tree/${encodeURIComponent(treeName)}/data`);
	if (!res.ok) {
		if (res.status === 404) throw redirect(302, '/tree');
		throw new Error(`Failed to load tree: ${res.status}`);
	}

	const json = (await res.json()) as { treeData: TreeData; graphStructure: GraphStructure };
	if (browser) {
		setCachedTree(treeName, { treeData: json.treeData, graphStructure: json.graphStructure });
	}
	return { ...data, treeData: json.treeData, graphStructure: json.graphStructure };
}
