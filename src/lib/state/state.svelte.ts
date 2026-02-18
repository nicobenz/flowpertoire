import type { TreeData } from '$lib/types';

const sampleDate = '2025-01-01T00:00:00.000Z';

const defaultTreeData: TreeData[] = [
	{
		categories: [
			{
				id: 1,
				conceptId: null,
				label: 'Calisthenics',
				description: 'Bodyweight strength skills',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 2,
				conceptId: null,
				label: 'Push-up variations',
				description: 'Horizontal pushing progressions',
				createdAt: sampleDate,
				updatedAt: sampleDate
			}
		],
		moves: [
			{
				id: 1,
				title: 'Regular Push-up',
				skillRating: 4,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 2,
				title: 'Diamond Push-up',
				skillRating: 3,
				firstLandedAt: null,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 3,
				title: 'Archer Push-up',
				skillRating: 1,
				firstLandedAt: null,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 4,
				title: 'Pseudo Planche Push-up',
				skillRating: 0,
				firstLandedAt: null,
				createdAt: sampleDate,
				updatedAt: sampleDate
			}
		],
		nodes: [
			// Root: Calisthenics category
			{
				id: 1,
				moveId: null,
				categoryId: 1,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			// Hybrid: Push-up variations category + Regular Push-up move
			{
				id: 2,
				moveId: 1,
				categoryId: 2,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			// Move leaves (other variations)
			{
				id: 3,
				moveId: 2,
				categoryId: null,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 4,
				moveId: 3,
				categoryId: null,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 1,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 5,
				moveId: 4,
				categoryId: null,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 2,
				createdAt: sampleDate,
				updatedAt: sampleDate
			}
		],
		edges: [
			{ parentId: 1, childId: 2, type: 'parent' },
			{ parentId: 2, childId: 3, type: 'parent' },
			{ parentId: 2, childId: 4, type: 'parent' },
			{ parentId: 2, childId: 5, type: 'parent' }
		]
	},
	{
		categories: [
			{
				id: 1,
				conceptId: null,
				label: 'Poi',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 2,
				conceptId: null,
				label: 'Hula Hoop',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 3,
				conceptId: null,
				label: 'Twin Hoop',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 4,
				conceptId: null,
				label: 'Rope Dart',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 5,
				conceptId: 1,
				label: 'Weaves',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 6,
				conceptId: null,
				label: 'Flowers',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 7,
				conceptId: null,
				label: 'Spiral Wrap',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 8,
				conceptId: null,
				label: 'Escalator',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 9,
				conceptId: null,
				label: 'Isolations',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 10,
				conceptId: 1,
				label: 'Weaves',
				description: 'Flowy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
		],
		moves: [
			{
				id: 1,
				title: '2-Beat Weave',
				skillRating: 5,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 2,
				title: '3-Beat Weave',
				skillRating: 4,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 3,
				title: 'Behind the Back Weave',
				skillRating: 1,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 4,
				title: 'Same Direction Inspin Flower',
				skillRating: 4,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 5,
				title: 'Opposite Direction Inspin Flower',
				skillRating: 5,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 6,
				title: 'Same Direction Antispin Flower',
				skillRating: 2,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 7,
				title: 'Opposite Direction Antispin Flower',
				skillRating: 3,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 8,
				title: 'Spiral Wrap',
				skillRating: 4,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 9,
				title: 'Infinite Spiral',
				skillRating: 4,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 10,
				title: 'Wrist Spiral',
				skillRating: 2,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 11,
				title: 'One Arm Spiral',
				skillRating: 0,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 13,
				title: '2-Beat Weave',
				skillRating: 4,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 14,
				title: '3-Beat Weave',
				skillRating: 3,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 15,
				title: 'Behind the Back Weave',
				skillRating: 0,
				firstLandedAt: sampleDate,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
		],
		nodes: [
			{
				id: 1,
				moveId: null,
				categoryId: 1,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 2,
				moveId: null,
				categoryId: 2,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 3,
				moveId: null,
				categoryId: 3,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 4,
				moveId: null,
				categoryId: 4,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 5,
				moveId: null,
				categoryId: 5,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 6,
				moveId: null,
				categoryId: 6,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 7,
				moveId: 8,
				categoryId: 7,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 8,
				moveId: 1,
				categoryId: 5,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 9,
				moveId: 2,
				categoryId: 5,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 10,
				moveId: 3,
				categoryId: 5,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 11,
				moveId: 4,
				categoryId: 6,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 12,
				moveId: 5,
				categoryId: 6,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 13,
				moveId: 6,
				categoryId: 6,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 14,
				moveId: 7,
				categoryId: 6,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 15,
				moveId: 9,
				categoryId: 7,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 16,
				moveId: 10,
				categoryId: 7,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 17,
				moveId: 11,
				categoryId: 7,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 18,
				moveId: null,
				categoryId: 10,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 19,
				moveId: 13,
				categoryId: 10,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 20,
				moveId: 14,
				categoryId: 10,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
			{
				id: 21,
				moveId: 15,
				categoryId: 10,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			},
		],
		edges: [
			{ parentId: 1, childId: 5, type: 'parent' },
			{ parentId: 1, childId: 6, type: 'parent' },
			{ parentId: 1, childId: 7, type: 'parent' },
			{ parentId: 2, childId: 3, type: 'parent' },
			{ parentId: 5, childId: 8, type: 'parent' },
			{ parentId: 5, childId: 9, type: 'parent' },
			{ parentId: 5, childId: 10, type: 'parent' },
			{ parentId: 6, childId: 11, type: 'parent' },
			{ parentId: 6, childId: 12, type: 'parent' },
			{ parentId: 6, childId: 13, type: 'parent' },
			{ parentId: 6, childId: 14, type: 'parent' },
			{ parentId: 7, childId: 15, type: 'parent' },
			{ parentId: 7, childId: 16, type: 'parent' },
			{ parentId: 7, childId: 17, type: 'parent' },
			{ parentId: 3, childId: 18, type: 'parent' },
			{ parentId: 18, childId: 19, type: 'parent' },
			{ parentId: 18, childId: 20, type: 'parent' },
			{ parentId: 18, childId: 21, type: 'parent' },
			{ parentId: 5, childId: 18, type: 'concept' },
			
		]
	},
	{
		categories: [
			{
				id: 1,
				conceptId: null,
				label: 'Dance',
				description: 'Dancy stuff',
				createdAt: sampleDate,
				updatedAt: sampleDate
			}
		],
		moves: [],
		nodes: [
			{
				id: 1,
				moveId: null,
				categoryId: 1,
				userId: 1,
				showInGraph: true,
				showInPortfolioList: true,
				sortOrder: 0,
				createdAt: sampleDate,
				updatedAt: sampleDate
			}
		],
		edges: []
	}
];

export const tree = $state({
	default: defaultTreeData
});

export const appState = $state({
	labels: ['Calisthenics', 'Flow Arts', 'Dance'],
	selectedIndex: 0
});
