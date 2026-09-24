import { CategoryModel } from '@movie-site/shared';

export const INITIAL_CATEGORIES: CategoryModel[] = [
  {
    id: 'cat_hindi',
    name: 'Hindi',
    slug: 'hindi',
    description: 'Bollywood cinema, inspirational biographies, and timeless classics',
    color: 'amber',
    borderAccent: 'border-amber-500/40',
    subcategories: ['Action', 'Comedy', 'Drama', 'Thriller', 'Biography', 'Crime'],
    isCustom: false,
  },
  {
    id: 'cat_english',
    name: 'English',
    slug: 'english',
    description: 'Hollywood Masterpieces, Sci-Fi Classics, and Academy Award Winners',
    color: 'blue',
    borderAccent: 'border-blue-500/40',
    subcategories: ['Sci-Fi', 'Action', 'Drama', 'Crime', 'Adventure', 'Thriller'],
    isCustom: false,
  },
  {
    id: 'cat_bangla',
    name: 'Bangla',
    slug: 'bangla',
    description: 'Satyajit Ray heritage masterpieces, contemporary thrillers, and Dhaka cinema',
    color: 'emerald',
    borderAccent: 'border-emerald-500/40',
    subcategories: ['Drama', 'Thriller', 'Heritage', 'Mystery', 'Classic'],
    isCustom: false,
  },
  {
    id: 'cat_hindi_dubbed',
    name: 'Hindi Dubbed',
    slug: 'hindi-dubbed',
    description: 'South Indian & World Blockbusters professionally dubbed in Hindi',
    color: 'red',
    borderAccent: 'border-red-500/40',
    subcategories: ['Action', 'Period Action', 'Sci-Fi', 'Thriller'],
    isCustom: false,
  },
];
