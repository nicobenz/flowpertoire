import { json } from '@sveltejs/kit';
import { getRootTreeIdBySlug, getTreeData } from '$lib/server/db/queries';
import { DEFAULT_USER_ID } from '$lib/server/db/default-user';
import type { GraphStructure } from '$lib/types';

export async function GET({ params }) {
	const treeName = params.treeName;
	if (!treeName) {
		return json({ error: 'Missing tree name' }, { status: 400 });
	}

	const rootId = await getRootTreeIdBySlug(DEFAULT_USER_ID, treeName);
	if (rootId == null) {
		return json({ error: 'Tree not found' }, { status: 404 });
	}

	const treeData = await getTreeData(DEFAULT_USER_ID, rootId);
	if (!treeData) {
		return json({ error: 'Tree not found' }, { status: 404 });
	}

	const graphStructure: GraphStructure = {
		nodes: treeData.nodes,
		edges: treeData.edges,
		groups: treeData.groups,
		skills: treeData.skills
			.filter((s): s is typeof s & { id: number } => s.id != null)
			.map((s) => ({ id: s.id, title: s.title }))
	};

	return json({ treeData, graphStructure });
}
