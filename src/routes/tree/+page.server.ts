import { fail, redirect } from '@sveltejs/kit';
import { createRootTree, deleteRootTree, getRootTrees } from '$lib/server/db/queries';
import { DEFAULT_USER_ID } from '$lib/server/db/default-user';

export async function load() {
	const trees = await getRootTrees(DEFAULT_USER_ID);
	if (trees.length > 0) throw redirect(302, `/tree/${trees[0].id}`);
	return {};
}

export const actions = {
	createTree: async ({ request }) => {
		const formData = await request.formData();
		const label = formData.get('label');
		if (typeof label !== 'string') {
			return fail(400, { createTree: { error: 'Label is required' } });
		}
		try {
			const created = await createRootTree(DEFAULT_USER_ID, label);
			throw redirect(303, `/tree/${created.id}`);
		} catch (err) {
			// Rethrow redirect so the client follows it (and lands on the new tree)
			const r = err as { status?: number; location?: string };
			if (r && typeof r.status === 'number' && r.status >= 300 && r.status < 400) throw err;
			const message = err instanceof Error ? err.message : 'Failed to create tree';
			return fail(500, { createTree: { error: message } });
		}
	},
	deleteTree: async ({ request }) => {
		const formData = await request.formData();
		const treeId = formData.get('treeId');
		const id = typeof treeId === 'string' ? parseInt(treeId, 10) : NaN;
		if (Number.isNaN(id)) {
			return fail(400, { deleteTree: { error: 'Invalid tree' } });
		}
		try {
			await deleteRootTree(DEFAULT_USER_ID, id);
			return { deleteTree: { success: true } };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to delete tree';
			return fail(500, { deleteTree: { error: message } });
		}
	}
};
