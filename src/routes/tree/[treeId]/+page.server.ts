import { redirect } from '@sveltejs/kit';
import { getTreeData } from '$lib/server/db/queries';
import { DEFAULT_USER_ID } from '$lib/server/db/default-user';
import type { GraphStructure } from '$lib/types';

export async function load({ params }) {
	const treeId = parseInt(params.treeId, 10);
	if (Number.isNaN(treeId)) throw redirect(302, '/tree');

	const treeData = await getTreeData(DEFAULT_USER_ID, treeId);
	if (!treeData) throw redirect(302, '/tree');

	const graphStructure: GraphStructure = {
		nodes: treeData.nodes,
		edges: treeData.edges,
		categories: treeData.categories,
		moves: treeData.moves
			.filter((m): m is typeof m & { id: number } => m.id != null)
			.map((m) => ({ id: m.id, title: m.title }))
	};

	return { treeData, graphStructure };
}
