/**
 * Client-side cache for tree page data keyed by tree slug.
 * Used so navigating back to the same tree doesn't trigger a server round-trip.
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { GraphStructure } from '$lib/types';
import type { TreeData } from '$lib/types';

export interface CachedTree {
	treeData: TreeData;
	graphStructure: GraphStructure;
}

const LAST_TREE_STORAGE_KEY = 'flowpertoire-last-tree';

export function getLastTreeSlug(): string | null {
	if (!browser) return null;
	try {
		return localStorage.getItem(LAST_TREE_STORAGE_KEY);
	} catch {
		return null;
	}
}

export function setLastTreeSlug(slug: string | null): void {
	if (!browser) return;
	try {
		if (slug) localStorage.setItem(LAST_TREE_STORAGE_KEY, slug);
		else localStorage.removeItem(LAST_TREE_STORAGE_KEY);
	} catch {
		// ignore
	}
}

/** Pre-fetch tree data into cache so /tree and /list load instantly. Call from layout on first visit. */
export async function prefetchTreeData(
	slug: string,
	fetchFn: typeof fetch = fetch
): Promise<void> {
	if (!slug || getCachedTree(slug)) return;
	try {
		const res = await fetchFn(`/api/tree/${encodeURIComponent(slug)}/data`);
		if (!res.ok) return;
		const json = (await res.json()) as { treeData: TreeData; graphStructure: GraphStructure };
		setCachedTree(slug, { treeData: json.treeData, graphStructure: json.graphStructure });
	} catch {
		// ignore; page load will fetch again
	}
}

const cache = new Map<string, CachedTree>();

export function getCachedTree(treeName: string): CachedTree | undefined {
	return cache.get(treeName);
}

export function setCachedTree(treeName: string, data: CachedTree): void {
	cache.set(treeName, data);
}

/** Clear cache for one tree (call after mutations so next visit refetches). */
export function clearTreeCache(treeName: string): void {
	cache.delete(treeName);
}

/** Currently selected tree slug (from URL or last selected). Used for List View link and list redirect. */
export const effectiveTreeSlug = writable<string | null>(null);

/** Call from team-switcher when effective slug changes so nav can show the right list link. */
export function setEffectiveTreeSlug(slug: string | null): void {
	effectiveTreeSlug.set(slug);
}
