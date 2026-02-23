/**
 * Client-side cache for tree page data keyed by tree slug.
 * Used so navigating back to the same tree doesn't trigger a server round-trip.
 */

import { writable } from 'svelte/store';
import type { GraphStructure } from '$lib/types';
import type { TreeData } from '$lib/types';

export interface CachedTree {
	treeData: TreeData;
	graphStructure: GraphStructure;
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
