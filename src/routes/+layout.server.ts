import { getRootTrees } from '$lib/server/db/queries';
import { DEFAULT_USER_ID } from '$lib/server/db/default-user';

export async function load() {
	const trees = await getRootTrees(DEFAULT_USER_ID);
	return { trees };
}
