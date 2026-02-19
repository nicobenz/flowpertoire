import type { TreeData, GraphStructure } from '$lib/types';

const sampleDate = '2025-01-01T00:00:00.000Z';

const defaultTreeData = $state<{ trees: TreeData[] }>({
	trees: [
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
					nodeType: 'category',
					moveId: null,
					categoryId: 1,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				// Push-up variations category (parent of all push-up move leaves)
				{
					id: 2,
					nodeType: 'category',
					moveId: null,
					categoryId: 2,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				// Move leaves under Push-up variations
				{
					id: 6,
					nodeType: 'move',
					moveId: 1,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 3,
					nodeType: 'move',
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
					nodeType: 'move',
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
					nodeType: 'move',
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
				{ parentId: 2, childId: 6, type: 'parent' },
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
				}
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
				}
			],
			nodes: [
				{
					id: 1,
					nodeType: 'category',
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
					nodeType: 'category',
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
					nodeType: 'category',
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
					nodeType: 'category',
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
					nodeType: 'category',
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
					nodeType: 'category',
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
					nodeType: 'category',
					moveId: null,
					categoryId: 7,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 22,
					nodeType: 'move',
					moveId: 8,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 8,
					nodeType: 'move',
					moveId: 1,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 9,
					nodeType: 'move',
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
					id: 10,
					nodeType: 'move',
					moveId: 3,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 11,
					nodeType: 'move',
					moveId: 4,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 12,
					nodeType: 'move',
					moveId: 5,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 13,
					nodeType: 'move',
					moveId: 6,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 14,
					nodeType: 'move',
					moveId: 7,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 15,
					nodeType: 'move',
					moveId: 9,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 16,
					nodeType: 'move',
					moveId: 10,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 17,
					nodeType: 'move',
					moveId: 11,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 18,
					nodeType: 'category',
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
					nodeType: 'move',
					moveId: 13,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 20,
					nodeType: 'move',
					moveId: 14,
					categoryId: null,
					userId: 1,
					showInGraph: true,
					showInPortfolioList: true,
					sortOrder: 0,
					createdAt: sampleDate,
					updatedAt: sampleDate
				},
				{
					id: 21,
					nodeType: 'move',
					moveId: 15,
					categoryId: null,
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
			categories: [
				{ id: 1, conceptId: null, label: 'Dance', description: 'Dancy stuff', createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 2, conceptId: null, label: 'Salsa', description: 'Partner dance', createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 3, conceptId: null, label: 'Pole dance', description: 'Pole fitness & dance', createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 4, conceptId: null, label: 'Salsa Rueda', description: 'Circle salsa', createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 5, conceptId: null, label: 'Salsa Cubana', description: 'Cuban style', createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 7, conceptId: null, label: 'Flips', description: 'Pole flips', createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 8, conceptId: null, label: 'Climbs', description: 'Pole climbs', createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 9, conceptId: null, label: 'Inverts', description: 'Inverted poses', createdAt: sampleDate, updatedAt: sampleDate }
			],
			moves: [
				{ id: 1, title: 'Dame ona', skillRating: 5, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 2, title: 'Enchufa', skillRating: 5, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 3, title: 'Vacila', skillRating: 0, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 4, title: 'Kentucky', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 5, title: 'Sombrero', skillRating: 5, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 6, title: 'Guapea', skillRating: 0, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 7, title: 'Dile que no', skillRating: 5, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 8, title: 'Enchufla', skillRating: 5, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 9, title: 'Prima', skillRating: 2, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 10, title: 'Tresillo', skillRating: 0, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 16, title: 'Ayesha', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 17, title: 'Handspring', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 18, title: 'Shoulder mount', skillRating: 2, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 19, title: 'Flip to invert', skillRating: 2, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 20, title: 'Marley', skillRating: 0, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 21, title: 'Basic climb', skillRating: 4, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 22, title: 'Russian climb', skillRating: 3, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 23, title: 'Front climb', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 24, title: 'Side climb', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 26, title: 'Inverted crucifix', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 27, title: 'Gemini', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 28, title: 'Jamilla', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 29, title: 'Allegra', skillRating: 1, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 30, title: 'Handstand', skillRating: 0, firstLandedAt: null, createdAt: sampleDate, updatedAt: sampleDate }
			],
			nodes: [
				{ id: 1, nodeType: 'category', moveId: null, categoryId: 1, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 0, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 2, nodeType: 'category', moveId: null, categoryId: 2, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 0, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 3, nodeType: 'category', moveId: null, categoryId: 3, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 1, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 4, nodeType: 'category', moveId: null, categoryId: 4, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 0, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 5, nodeType: 'category', moveId: null, categoryId: 5, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 1, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 7, nodeType: 'category', moveId: null, categoryId: 7, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 0, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 8, nodeType: 'category', moveId: null, categoryId: 8, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 1, createdAt: sampleDate, updatedAt: sampleDate },
				{ id: 9, nodeType: 'category', moveId: null, categoryId: 9, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: 2, createdAt: sampleDate, updatedAt: sampleDate },
				...Array.from({ length: 5 }, (_, i) => ({ id: 11 + i, nodeType: 'move' as const, moveId: 1 + i, categoryId: null, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: i, createdAt: sampleDate, updatedAt: sampleDate })),
				...Array.from({ length: 5 }, (_, i) => ({ id: 16 + i, nodeType: 'move' as const, moveId: 6 + i, categoryId: null, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: i, createdAt: sampleDate, updatedAt: sampleDate })),
				...Array.from({ length: 5 }, (_, i) => ({ id: 26 + i, nodeType: 'move' as const, moveId: 16 + i, categoryId: null, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: i, createdAt: sampleDate, updatedAt: sampleDate })),
				...Array.from({ length: 5 }, (_, i) => ({ id: 31 + i, nodeType: 'move' as const, moveId: 21 + i, categoryId: null, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: i, createdAt: sampleDate, updatedAt: sampleDate })),
				...Array.from({ length: 5 }, (_, i) => ({ id: 36 + i, nodeType: 'move' as const, moveId: 26 + i, categoryId: null, userId: 1, showInGraph: true, showInPortfolioList: true, sortOrder: i, createdAt: sampleDate, updatedAt: sampleDate }))
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

/** Structure only (no move.skillRating) – graph effect depends on this so rating changes don’t redraw. */
const currentGraphStructure = $derived.by((): GraphStructure | null => {
	const data = tree.default.trees[appState.selectedIndex];
	if (!data) return null;
	return {
		nodes: data.nodes,
		edges: data.edges,
		categories: data.categories,
		moves: data.moves
			.filter((m): m is typeof m & { id: number } => m.id != null)
			.map((m) => ({ id: m.id, title: m.title }))
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
