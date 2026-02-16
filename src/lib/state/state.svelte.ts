import type { TreeData } from '$lib/types';

const sampleDate = '2025-01-01T00:00:00.000Z';

const defaultTreeData: TreeData = {
	categories: [
		{ id: 1, label: 'Calisthenics', description: 'Bodyweight strength skills', createdAt: sampleDate, updatedAt: sampleDate },
		{ id: 2, label: 'Push-up variations', description: 'Horizontal pushing progressions', createdAt: sampleDate, updatedAt: sampleDate },
		{ id: 3, label: 'Salsa dance', description: null, createdAt: sampleDate, updatedAt: sampleDate }
	],
	moves: [
		{ id: 1, conceptId: null, title: 'Regular Push-up', skillRating: 5, status: 'mastered', firstLandedAt: sampleDate, createdAt: sampleDate, updatedAt: sampleDate },
		{ id: 2, conceptId: null, title: 'Diamond Push-up', skillRating: 4, status: 'learning', firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
		{ id: 3, conceptId: null, title: 'Archer Push-up', skillRating: 3, status: 'learning', firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
		{ id: 4, conceptId: null, title: 'Pseudo Planche Push-up', skillRating: 2, status: 'wishlist', firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate }
	],
	nodes: [
		// Root: Calisthenics category
		{ id: 1, parentId: null, moveId: null, categoryId: 1, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 0, createdAt: sampleDate, updatedAt: sampleDate },
		// Root: Salsa dance category (no moves, separate tree)
		{ id: 6, parentId: null, moveId: null, categoryId: 3, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 1, createdAt: sampleDate, updatedAt: sampleDate },
		// Hybrid: Push-up variations category + Regular Push-up move
		{ id: 2, parentId: 1, moveId: 1, categoryId: 2, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 0, createdAt: sampleDate, updatedAt: sampleDate },
		// Move leaves (other variations)
		{ id: 3, parentId: 2, moveId: 2, categoryId: null, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 0, createdAt: sampleDate, updatedAt: sampleDate },
		{ id: 4, parentId: 2, moveId: 3, categoryId: null, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 1, createdAt: sampleDate, updatedAt: sampleDate },
		{ id: 5, parentId: 2, moveId: 4, categoryId: null, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 2, createdAt: sampleDate, updatedAt: sampleDate }
	]
};

export const tree = $state({
	default: defaultTreeData
});
