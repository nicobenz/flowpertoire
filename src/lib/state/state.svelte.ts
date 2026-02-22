import type { TreeData, GraphStructure } from '$lib/types';

const sampleDate = '2025-01-01T00:00:00.000Z';

export const user = $state({
	firstName: 'Emmy',
	lastName: 'Example',
	email: 'emmy@example.com',
	avatar: '/avatars/ava.png',
	socials: {
		insta: '@emmy.examplissimo',
		tiktok: 'whatever'
	}
});

export const celebrateSettings = $state({
	timeSelection: { label: 'All time', value: 'all-time' },
	timeOptions: [
		{ label: 'All time', value: 'all-time' },
		{ label: '6 Months', value: '6-months' },
		{ label: '3 Months', value: '3-months' }
	],
	styleSelection: { label: 'Style 1', value: 'style-1' },
	styleOptions: [
		{ label: 'Style 1', value: 'style-1' },
		{ label: 'Style 2', value: 'style-2' },
		{ label: 'Style 3', value: 'style-3' }
	]
});

/** Shared state so the add-tree dialog can be opened from the sidebar or from the empty tree page. */
export const addTreeDialog = $state({ open: false });

const defaultTreeData = $state<{ trees: TreeData[] }>({
	trees: [
		{
			groups: [
				{
					id: 1,
					label: 'Calisthenics',
					description: 'Bodyweight strength skills',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 2,
					label: 'Push-up variations',
					description: 'Horizontal pushing progressions',
					createdAt: sampleDate,
					updatedAt: sampleDate
				}
			],
			skills: [
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
				// Root: Calisthenics group
				{
					id: 1,
					nodeType: 'group',
					skillId: null,
					groupId: 1,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				// Push-up variations group (parent of all push-up skill leaves)
				{
					id: 2,
					nodeType: 'group',
					skillId: null,
					groupId: 2,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				// Skill leaves under Push-up variations
				{
					id: 6,
					nodeType: 'skill',
					skillId: 1,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 3,
					nodeType: 'skill',
					skillId: 2,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 4,
					nodeType: 'skill',
					skillId: 3,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 1,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 5,
					nodeType: 'skill',
					skillId: 4,
					groupId: null,
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
				{ parentId: 2, childId: 6, type: 'parent' },
				{ parentId: 2, childId: 3, type: 'parent' },
				{ parentId: 2, childId: 4, type: 'parent' },
				{ parentId: 2, childId: 5, type: 'parent' }
			]
		},
		{
			groups: [
				{
					id: 1,
					label: 'Poi',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 2,
					label: 'Hula Hoop',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 3,
					label: 'Twin Hoop',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 4,
					label: 'Rope Dart',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 5,
					label: 'Weaves',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 6,
					label: 'Flowers',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 7,
					label: 'Spiral Wrap',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 8,
					label: 'Escalator',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 9,
					label: 'Isolations',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 10,
					label: 'Weaves',
					description: 'Flowy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				}
			],
			skills: [
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
				}
			],
			nodes: [
				{
					id: 1,
					nodeType: 'group',
					skillId: null,
					groupId: 1,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 2,
					nodeType: 'group',
					skillId: null,
					groupId: 2,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 3,
					nodeType: 'group',
					skillId: null,
					groupId: 3,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 4,
					nodeType: 'group',
					skillId: null,
					groupId: 4,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 5,
					nodeType: 'group',
					skillId: null,
					groupId: 5,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 6,
					nodeType: 'group',
					skillId: null,
					groupId: 6,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 7,
					nodeType: 'group',
					skillId: null,
					groupId: 7,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 22,
					nodeType: 'skill',
					skillId: 8,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 8,
					nodeType: 'skill',
					skillId: 1,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 9,
					nodeType: 'skill',
					skillId: 2,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 10,
					nodeType: 'skill',
					skillId: 3,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 11,
					nodeType: 'skill',
					skillId: 4,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 12,
					nodeType: 'skill',
					skillId: 5,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 13,
					nodeType: 'skill',
					skillId: 6,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 14,
					nodeType: 'skill',
					skillId: 7,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 15,
					nodeType: 'skill',
					skillId: 9,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 16,
					nodeType: 'skill',
					skillId: 10,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 17,
					nodeType: 'skill',
					skillId: 11,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 18,
					nodeType: 'group',
					skillId: null,
					groupId: 10,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 19,
					nodeType: 'skill',
					skillId: 13,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 20,
					nodeType: 'skill',
					skillId: 14,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 21,
					nodeType: 'skill',
					skillId: 15,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				}
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
				{ parentId: 7, childId: 22, type: 'parent' },
				{ parentId: 7, childId: 15, type: 'parent' },
				{ parentId: 7, childId: 16, type: 'parent' },
				{ parentId: 7, childId: 17, type: 'parent' },
				{ parentId: 3, childId: 18, type: 'parent' },
				{ parentId: 18, childId: 19, type: 'parent' },
				{ parentId: 18, childId: 20, type: 'parent' },
				{ parentId: 18, childId: 21, type: 'parent' },
				{ parentId: 5, childId: 18, type: 'concept' }
			]
		},
		{
			groups: [
				{
					id: 1,
					label: 'Dance',
					description: 'Dancy stuff',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 2,
					label: 'Salsa',
					description: 'Partner dance',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 3,
					label: 'Pole dance',
					description: 'Pole fitness & dance',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 4,
					label: 'Salsa Rueda',
					description: 'Circle salsa',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 5,
					label: 'Salsa Cubana',
					description: 'Cuban style',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 7,
					label: 'Flips',
					description: 'Pole flips',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 8,
					label: 'Climbs',
					description: 'Pole climbs',
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 9,
					label: 'Inverts',
					description: 'Inverted poses',
					createdAt: sampleDate,
					updatedAt: sampleDate
				}
			],
			skills: [
				{
					id: 1,
					title: 'Dame ona',
					skillRating: 5,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 2,
					title: 'Enchufa',
					skillRating: 5,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 3,
					title: 'Vacila',
					skillRating: 0,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 4,
					title: 'Kentucky',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 5,
					title: 'Sombrero',
					skillRating: 5,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 6,
					title: 'Guapea',
					skillRating: 0,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 7,
					title: 'Dile que no',
					skillRating: 5,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 8,
					title: 'Enchufla',
					skillRating: 5,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 9,
					title: 'Prima',
					skillRating: 2,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 10,
					title: 'Tresillo',
					skillRating: 0,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 16,
					title: 'Ayesha',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 17,
					title: 'Handspring',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 18,
					title: 'Shoulder mount',
					skillRating: 2,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 19,
					title: 'Flip to invert',
					skillRating: 2,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 20,
					title: 'Marley',
					skillRating: 0,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 21,
					title: 'Basic climb',
					skillRating: 4,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 22,
					title: 'Russian climb',
					skillRating: 3,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 23,
					title: 'Front climb',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 24,
					title: 'Side climb',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 26,
					title: 'Inverted crucifix',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 27,
					title: 'Gemini',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 28,
					title: 'Jamilla',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 29,
					title: 'Allegra',
					skillRating: 1,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 30,
					title: 'Handstand',
					skillRating: 0,
					firstLandedAt: null,
					createdAt: sampleDate,
					updatedAt: sampleDate
				}
			],
			nodes: [
				{
					id: 1,
					nodeType: 'group',
					skillId: null,
					groupId: 1,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 2,
					nodeType: 'group',
					skillId: null,
					groupId: 2,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 3,
					nodeType: 'group',
					skillId: null,
					groupId: 3,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 1,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 4,
					nodeType: 'group',
					skillId: null,
					groupId: 4,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 5,
					nodeType: 'group',
					skillId: null,
					groupId: 5,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 1,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 7,
					nodeType: 'group',
					skillId: null,
					groupId: 7,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 8,
					nodeType: 'group',
					skillId: null,
					groupId: 8,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 1,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 9,
					nodeType: 'group',
					skillId: null,
					groupId: 9,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 2,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				...Array.from({ length: 5 }, (_, i) => ({
					id: 11 + i,
					nodeType: 'skill' as const,
					skillId: 1 + i,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: i,
					createdAt: sampleDate,
					updatedAt: sampleDate
				})),
				...Array.from({ length: 5 }, (_, i) => ({
					id: 16 + i,
					nodeType: 'skill' as const,
					skillId: 6 + i,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: i,
					createdAt: sampleDate,
					updatedAt: sampleDate
				})),
				...Array.from({ length: 5 }, (_, i) => ({
					id: 26 + i,
					nodeType: 'skill' as const,
					skillId: 16 + i,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: i,
					createdAt: sampleDate,
					updatedAt: sampleDate
				})),
				...Array.from({ length: 5 }, (_, i) => ({
					id: 31 + i,
					nodeType: 'skill' as const,
					skillId: 21 + i,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: i,
					createdAt: sampleDate,
					updatedAt: sampleDate
				})),
				...Array.from({ length: 5 }, (_, i) => ({
					id: 36 + i,
					nodeType: 'skill' as const,
					skillId: 26 + i,
					groupId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: i,
					createdAt: sampleDate,
					updatedAt: sampleDate
				}))
			],
			edges: [
				{ parentId: 1, childId: 2, type: 'parent' },
				{ parentId: 1, childId: 3, type: 'parent' },
				{ parentId: 2, childId: 4, type: 'parent' },
				{ parentId: 2, childId: 5, type: 'parent' },
				{ parentId: 3, childId: 7, type: 'parent' },
				{ parentId: 3, childId: 8, type: 'parent' },
				{ parentId: 3, childId: 9, type: 'parent' },
				{ parentId: 4, childId: 11, type: 'parent' },
				{ parentId: 4, childId: 12, type: 'parent' },
				{ parentId: 4, childId: 13, type: 'parent' },
				{ parentId: 4, childId: 14, type: 'parent' },
				{ parentId: 4, childId: 15, type: 'parent' },
				{ parentId: 5, childId: 16, type: 'parent' },
				{ parentId: 5, childId: 17, type: 'parent' },
				{ parentId: 5, childId: 18, type: 'parent' },
				{ parentId: 5, childId: 19, type: 'parent' },
				{ parentId: 5, childId: 20, type: 'parent' },
				{ parentId: 7, childId: 26, type: 'parent' },
				{ parentId: 7, childId: 27, type: 'parent' },
				{ parentId: 7, childId: 28, type: 'parent' },
				{ parentId: 7, childId: 29, type: 'parent' },
				{ parentId: 7, childId: 30, type: 'parent' },
				{ parentId: 8, childId: 31, type: 'parent' },
				{ parentId: 8, childId: 32, type: 'parent' },
				{ parentId: 8, childId: 33, type: 'parent' },
				{ parentId: 8, childId: 34, type: 'parent' },
				{ parentId: 9, childId: 36, type: 'parent' },
				{ parentId: 9, childId: 37, type: 'parent' },
				{ parentId: 9, childId: 38, type: 'parent' },
				{ parentId: 9, childId: 39, type: 'parent' },
				{ parentId: 9, childId: 40, type: 'parent' }
			]
		}
	]
});

export const tree = $state({
	default: defaultTreeData
});

export const appState = $state({
	labels: ['Calisthenics', 'Flow Arts', 'Dance'],
	selectedIndex: 0
});

/** Structure only (no skill.skillRating) – graph effect depends on this so rating changes don’t redraw. */
const currentGraphStructure = $derived.by((): GraphStructure | null => {
	const data = tree.default.trees[appState.selectedIndex];
	if (!data) return null;
	return {
		nodes: data.nodes,
		edges: data.edges,
		groups: data.groups,
		skills: data.skills
			.filter((s): s is typeof s & { id: number } => s.id != null)
			.map((s) => ({ id: s.id, title: s.title }))
	};
});

/** Full tree for current index (used for fill updates and overlay). */
const currentTreeData = $derived.by(() => tree.default.trees[appState.selectedIndex]);

/** Expose current values (Svelte doesn’t allow exporting $derived from a module). */
export function getCurrentGraphStructure(): GraphStructure | null {
	return currentGraphStructure;
}

export function getCurrentTreeData(): TreeData | undefined {
	return currentTreeData;
}
