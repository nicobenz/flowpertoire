import { fail, redirect } from '@sveltejs/kit';
import {
	getRootTreeIdBySlug,
	getTreeData,
	addChildGroup,
	addChildSkill
} from '$lib/server/db/queries';
import { DEFAULT_USER_ID } from '$lib/server/db/default-user';
import type { GraphStructure } from '$lib/types';

export async function load({ params }) {
	const treeName = params.treeName;
	if (!treeName) throw redirect(302, '/tree');

	const rootId = await getRootTreeIdBySlug(DEFAULT_USER_ID, treeName);
	if (rootId == null) throw redirect(302, '/tree');

	const treeData = await getTreeData(DEFAULT_USER_ID, rootId);
	if (!treeData) throw redirect(302, '/tree');

	const graphStructure: GraphStructure = {
		nodes: treeData.nodes,
		edges: treeData.edges,
		groups: treeData.groups,
		skills: treeData.skills
			.filter((s): s is typeof s & { id: number } => s.id != null)
			.map((s) => ({ id: s.id, title: s.title }))
	};

	return { treeData, graphStructure, treeName };
}

export const actions = {
	addGroup: async ({ request }) => {
		const formData = await request.formData();
		const parentNodeIdRaw = formData.get('parentNodeId');
		const label = formData.get('label');
		const description = formData.get('description');
		const parentNodeId =
			typeof parentNodeIdRaw === 'string' ? parseInt(parentNodeIdRaw, 10) : NaN;
		if (Number.isNaN(parentNodeId) || typeof label !== 'string') {
			return fail(400, { addGroup: { error: 'Parent node and label are required' } });
		}
		try {
			await addChildGroup(
				DEFAULT_USER_ID,
				parentNodeId,
				label,
				typeof description === 'string' ? description : null
			);
			return { addGroup: { success: true } };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to add group';
			return fail(500, { addGroup: { error: message } });
		}
	},
	addSkill: async ({ request }) => {
		const formData = await request.formData();
		const parentNodeIdRaw = formData.get('parentNodeId');
		const title = formData.get('title');
		const parentNodeId =
			typeof parentNodeIdRaw === 'string' ? parseInt(parentNodeIdRaw, 10) : NaN;
		if (Number.isNaN(parentNodeId) || typeof title !== 'string') {
			return fail(400, { addSkill: { error: 'Parent node and title are required' } });
		}
		try {
			await addChildSkill(DEFAULT_USER_ID, parentNodeId, title);
			return { addSkill: { success: true } };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to add skill';
			return fail(500, { addSkill: { error: message } });
		}
	}
};
