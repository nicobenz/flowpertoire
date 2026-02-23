import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const treeName = params.treeName;
	if (!treeName) throw redirect(302, '/list');
	return { treeName };
}
