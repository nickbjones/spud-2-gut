import type { Recipe, Tag } from '@/types/recipe';

export const recipes: Recipe[] = [
  {
    id: '0',
    uid: 'mashed-potatoes',
    date: '2025-02-09',
    title: 'Mashed Potatoes',
    tags: ['side-dishes', 'potatoes'],
    description: `
    `,
    ingredients: `
    `,
    instructions: `
    `,
    reference: '',
  },
  {
    id: '1',
    uid: 'lemon-cream-chicken',
    date: '2025-02-09',
    title: 'Lemon Cream Chicken',
    tags: [],
    description: `
    `,
    ingredients: `
    `,
    instructions: `
    `,
    reference: '',
  },
  {
    id: '2',
    uid: 'ao-togarashi-pickles',
    date: '2025-02-08',
    title: '青唐辛子 Pickles',
    tags: ['side-dishes', 'spicy'],
    description: `
      青唐辛子（あおとうがらし） Pickles are a delicious way to eat those spicy chili peppers!
    `,
    ingredients: `
      - 青唐辛子
      - にんにく
    `,
    instructions: `
      1. Chop the 青唐辛子
      2. Mince the にんにく
    `,
    reference: 'https://nomadette.com/pickled-green-chillies/',
  },
  {
    id: '3',
    uid: 'roasted-potatoes',
    date: '2025-02-07',
    title: 'Roasted Potatoes',
    tags: [],
    description: `
    `,
    ingredients: `
    `,
    instructions: `
    `,
    reference: '',
  },
  {
    id: '4',
    uid: 'spicy-roasted-potatoes',
    date: '2025-02-07',
    title: 'Spicy Roasted Potatoes',
    tags: ['potatoes', 'spicy'],
    description: `
      Delicious spicy roaster potatos!
    `,
    ingredients: `
      - Potatoes
      - Chili powder
    `,
    instructions: `
      1. Cut the potatoes
      2. Add the chili powder
      3. Roast them
      4. Enjoy!
    `,
    reference: '',
  },
  {
    id: '5',
    uid: 'tasty-spinach',
    date: '2025-02-11',
    title: 'Tasty Spinach',
    tags: ['side-dishes', 'healthy'],
    description: `
      This is a recipe for some tasty spinach!
    `,
    ingredients: `
      - Spinach
      - Salt
    `,
    instructions: `
      1. Boil spinach
      2. Add salt
      3. Enjoy
    `,
    reference: 'http://www.spinach.com',
  },
];

export const tags: Tag[] = [
  {
    id: '0',
    uid: 'main-dishes',
    title: 'Main Dishes',
    description: ``,
  },
  {
    id: '1',
    uid: 'side-dishes',
    title: 'Side Dishes',
    description: ``,
  },
  {
    id: '2',
    uid: 'spicy',
    title: 'Spicy',
    description: ``,
  },
  {
    id: '3',
    uid: 'sweet',
    title: 'Sweet',
    description: ``,
  },
  {
    id: '4',
    uid: 'potatoes',
    title: 'Potatoes',
    description: ``,
  },
  {
    id: '5',
    uid: 'healthy',
    title: 'Healthy',
    description: ``,
  },
];
