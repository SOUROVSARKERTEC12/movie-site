'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Layers,
  Film,
  Star,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Search,
  Filter,
  FolderTree,
  List,
  ArrowRight,
  X,
  Check,
  AlertTriangle,
  RotateCcw,
  Tv,
  ChevronDown,
  ChevronRight,
  Eye,
  Sparkles,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { DataTable, Column } from '@/components/DataTable';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { INITIAL_CATEGORIES } from '@/data/mockCategories';
import { CategoryModel, Movie, MovieQuality } from '@movie-site/shared';

const STORAGE_CATEGORIES_KEY = 'cineblack_admin_categories';
const STORAGE_MOVIES_KEY = 'cineblack_admin_movies';

type ViewMode = 'flat' | 'category_wise' | 'category_subcategory';

export default function CategoriesPage() {
  // State for Categories
  const [categories, setCategories] = useState<CategoryModel[]>(INITIAL_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);

  // State for Movies (allows re-assigning category/subcategory)
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);

  // View Mode: 'flat' | 'category_wise' | 'category_subcategory'
  const [viewMode, setViewMode] = useState<ViewMode>('category_wise');

  // Filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCreateCatModalOpen, setIsCreateCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryModel | null>(null);

  // Quick subcategory adder modal
  const [addingSubcategoryCatId, setAddingSubcategoryCatId] = useState<string | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>('');

  // Movie category re-assignment modal
  const [editingMovieCat, setEditingMovieCat] = useState<Movie | null>(null);
  const [movieNewCat, setMovieNewCat] = useState<string>('');
  const [movieNewSubcat, setMovieNewSubcat] = useState<string>('');

  // Form State for Category Create/Edit
  const [catFormName, setCatFormName] = useState('');
  const [catFormSlug, setCatFormSlug] = useState('');
  const [catFormDesc, setCatFormDesc] = useState('');
  const [catFormColor, setCatFormColor] = useState('blue');
  const [catFormSubcategories, setCatFormSubcategories] = useState<string[]>([]);
  const [subcatInput, setSubcatInput] = useState('');
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCats = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (savedCats) {
        try {
          const parsed = JSON.parse(savedCats);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const savedMovies = localStorage.getItem(STORAGE_MOVIES_KEY);
      if (savedMovies) {
        try {
          const parsed = JSON.parse(savedMovies);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMovies(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      setIsLoaded(true);
    }
  }, []);

  // Save Categories to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  // Save Movies to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(movies));
    }
  }, [movies, isLoaded]);

  // Open Create Category Modal
  const openCreateModal = () => {
    setCatFormName('');
    setCatFormSlug('');
    setCatFormDesc('');
    setCatFormColor('blue');
    setCatFormSubcategories([]);
    setSubcatInput('');
    setFormError('');
    setIsCreateCatModalOpen(true);
  };

  // Open Edit Category Modal
  const openEditModal = (cat: CategoryModel) => {
    setEditingCategory(cat);
    setCatFormName(cat.name);
    setCatFormSlug(cat.slug);
    setCatFormDesc(cat.description);
    setCatFormColor(cat.color || 'blue');
    setCatFormSubcategories([...cat.subcategories]);
    setSubcatInput('');
    setFormError('');
  };

  // Handle Add Subcategory tag inside category form
  const handleAddSubcatTag = () => {
    const trimmed = subcatInput.trim();
    if (!trimmed) return;
    if (catFormSubcategories.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSubcatInput('');
      return;
    }
    setCatFormSubcategories([...catFormSubcategories, trimmed]);
    setSubcatInput('');
  };

  const handleRemoveSubcatTag = (sub: string) => {
    setCatFormSubcategories(catFormSubcategories.filter((s) => s !== sub));
  };

  // Save New Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) {
      setFormError('Category name is required');
      return;
    }

    if (categories.some((c) => c.name.toLowerCase() === catFormName.trim().toLowerCase())) {
      setFormError('A category with this name already exists');
      return;
    }

    const slug = catFormSlug.trim() || catFormName.toLowerCase().replace(/\s+/g, '-');

    const newCat: CategoryModel = {
      id: `cat_${Date.now().toString(36)}`,
      name: catFormName.trim(),
      slug: slug,
      description: catFormDesc.trim() || 'Curated film collection',
      color: catFormColor,
      borderAccent: `border-${catFormColor}-500/40`,
      subcategories: catFormSubcategories,
      isCustom: true,
    };

    setCategories([...categories, newCat]);
    setIsCreateCatModalOpen(false);
    setToastMessage(`Created category "${newCat.name}" with ${newCat.subcategories.length} subcategories`);
  };

  // Save Edited Category
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!catFormName.trim()) {
      setFormError('Category name is required');
      return;
    }

    const oldName = editingCategory.name;
    const newName = catFormName.trim();

    const updated: CategoryModel = {
      ...editingCategory,
      name: newName,
      slug: catFormSlug.trim() || newName.toLowerCase().replace(/\s+/g, '-'),
      description: catFormDesc.trim(),
      color: catFormColor,
      borderAccent: `border-${catFormColor}-500/40`,
      subcategories: catFormSubcategories,
    };

    setCategories(categories.map((c) => (c.id === editingCategory.id ? updated : c)));

    // If category name was modified, update corresponding movies
    if (oldName !== newName) {
      setMovies(movies.map((m) => (m.category === oldName ? { ...m, category: newName } : m)));
    }

    setEditingCategory(null);
    setToastMessage(`Updated category "${updated.name}"`);
  };

  // Delete Category
  const handleDeleteCategory = () => {
    if (!deletingCategory) return;
    setCategories(categories.filter((c) => c.id !== deletingCategory.id));
    setToastMessage(`Deleted category "${deletingCategory.name}"`);
    setDeletingCategory(null);
  };

  // Quick Add Subcategory to specific category
  const handleQuickAddSubcat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingSubcategoryCatId || !newSubcategoryName.trim()) return;

    const sub = newSubcategoryName.trim();
    setCategories(
      categories.map((c) => {
        if (c.id === addingSubcategoryCatId) {
          if (!c.subcategories.includes(sub)) {
            return { ...c, subcategories: [...c.subcategories, sub] };
          }
        }
        return c;
      })
    );

    setToastMessage(`Added "${sub}" to subcategories`);
    setAddingSubcategoryCatId(null);
    setNewSubcategoryName('');
  };

  // Quick Remove Subcategory from specific category
  const handleQuickRemoveSubcat = (catId: string, sub: string) => {
    setCategories(
      categories.map((c) => {
        if (c.id === catId) {
          return { ...c, subcategories: c.subcategories.filter((s) => s !== sub) };
        }
        return c;
      })
    );
    setToastMessage(`Removed subcategory "${sub}"`);
  };

  // Handle Save Movie Category / Subcategory assignment
  const handleSaveMovieCatAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovieCat) return;

    setMovies(
      movies.map((m) => {
        if (m.id === editingMovieCat.id) {
          const updatedGenre = movieNewSubcat && !m.genre.includes(movieNewSubcat)
            ? [movieNewSubcat, ...m.genre.filter((g) => g !== movieNewSubcat)]
            : m.genre;

          return {
            ...m,
            category: movieNewCat || m.category,
            subcategory: movieNewSubcat || m.subcategory,
            genre: updatedGenre,
          };
        }
        return m;
      })
    );

    setToastMessage(`Updated category for "${editingMovieCat.title}"`);
    setEditingMovieCat(null);
  };

  // Reset to default categories & movies
  const handleResetDefaults = () => {
    if (confirm('Reset categories and movies to initial defaults?')) {
      setCategories(INITIAL_CATEGORIES);
      setMovies(MOCK_MOVIES);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
        localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(MOCK_MOVIES));
      }
      setToastMessage('Categories and movies reset to defaults');
    }
  };

  // Aggregate Metrics
  const totalFilms = movies.length;
  const fourKTotal = movies.filter((m) => m.quality === '4K UHD').length;
  const totalSubcategories = categories.reduce((acc, c) => acc + c.subcategories.length, 0);
  const avgRating = totalFilms > 0
    ? (movies.reduce((acc, m) => acc + m.rating, 0) / totalFilms).toFixed(1)
    : '0.0';

  // Helper to get subcategory for a movie (explicit or primary genre)
  const getMovieSubcategory = (movie: Movie): string => {
    if (movie.subcategory) return movie.subcategory;
    return movie.genre && movie.genre.length > 0 ? movie.genre[0] : 'Unassigned';
  };

  // Color mapper helper
  const getColorClass = (color?: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/30',
          badge: 'bg-red-950/80 text-red-300 border-red-800',
          gradient: 'from-red-950/40 via-red-900/10 to-transparent',
        };
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          badge: 'bg-blue-950/80 text-blue-300 border-blue-800',
          gradient: 'from-blue-950/40 via-blue-900/10 to-transparent',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
          gradient: 'from-emerald-950/40 via-emerald-900/10 to-transparent',
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-400',
          border: 'border-purple-500/30',
          badge: 'bg-purple-950/80 text-purple-300 border-purple-800',
          gradient: 'from-purple-950/40 via-purple-900/10 to-transparent',
        };
      case 'amber':
      default:
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-800',
          gradient: 'from-amber-950/40 via-amber-900/10 to-transparent',
        };
    }
  };

  // Filtered Movies for Flat View & Groupings
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      // Category filter
      if (selectedCategoryFilter !== 'ALL' && m.category !== selectedCategoryFilter) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategoryFilter !== 'ALL') {
        const subcat = getMovieSubcategory(m);
        const matchesSub = subcat.toLowerCase() === selectedSubcategoryFilter.toLowerCase() ||
          m.genre.some((g) => g.toLowerCase() === selectedSubcategoryFilter.toLowerCase());
        if (!matchesSub) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesCat = m.category.toLowerCase().includes(q);
        const matchesSubcat = getMovieSubcategory(m).toLowerCase().includes(q);
        const matchesGenre = m.genre.some((g) => g.toLowerCase().includes(q));
        const matchesDirector = m.director.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesSubcat && !matchesGenre && !matchesDirector) {
          return false;
        }
      }

      return true;
    });
  }, [movies, selectedCategoryFilter, selectedSubcategoryFilter, searchQuery]);

  // All distinct subcategories for current selection
  const availableSubcategories = useMemo(() => {
    if (selectedCategoryFilter !== 'ALL') {
      const targetCat = categories.find((c) => c.name === selectedCategoryFilter);
      return targetCat ? targetCat.subcategories : [];
    }
    const set = new Set<string>();
    categories.forEach((c) => c.subcategories.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [categories, selectedCategoryFilter]);

  // Flat Table Columns
  const tableColumns: Column<Movie>[] = [
    {
      key: 'title',
      header: 'Film Asset',
      sortable: true,
      render: (movie) => (
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-13 rounded overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div>
            <h5 className="font-bold text-white text-xs hover:underline cursor-pointer">{movie.title}</h5>
            <p className="text-[11px] text-neutral-400">
              {movie.releaseYear} • {movie.duration} • Dir: {movie.director}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (movie) => {
        const catObj = categories.find((c) => c.name === movie.category);
        const style = getColorClass(catObj?.color);
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${style.badge}`}>
            {movie.category}
          </span>
        );
      },
    },
    {
      key: 'subcategory',
      header: 'Subcategory / Genre',
      sortable: true,
      render: (movie) => {
        const primarySub = getMovieSubcategory(movie);
        return (
          <div className="flex flex-wrap items-center gap-1 max-w-[200px]">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-white border border-neutral-700">
              {primarySub}
            </span>
            {movie.genre.filter((g) => g !== primarySub).slice(0, 2).map((g) => (
              <span key={g} className="px-1.5 py-0.2 rounded text-[9px] bg-neutral-900 text-neutral-400 border border-neutral-800">
                {g}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'quality',
      header: 'Master Quality',
      sortable: true,
      render: (movie) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            movie.quality === '4K UHD'
              ? 'bg-neutral-800 text-white border border-neutral-600'
              : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
          }`}
        >
          {movie.quality}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (movie) => (
        <div className="flex items-center gap-1 font-bold text-amber-400 text-xs font-mono">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (movie) => <StatusBadge status={movie.status || 'Published'} />,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (movie) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditingMovieCat(movie);
            setMovieNewCat(movie.category);
            setMovieNewSubcat(getMovieSubcategory(movie));
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-[11px] font-semibold transition-colors"
        >
          <Tag className="w-3 h-3 text-neutral-400" />
          <span>Assign</span>
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Category & Subcategory Intelligence"
        subtitle="Manage taxonomy rails, subcategory tags, and explore movies by Category or Category + Subcategory"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white font-medium text-xs transition-colors"
              title="Reset to default categories"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Categories"
            value={`${categories.length} Rails`}
            icon={Layers}
          />
          <StatCard
            title="Subcategories"
            value={`${totalSubcategories} Tags`}
            icon={Tag}
          />
          <StatCard
            title="Catalog Movies"
            value={`${totalFilms} Films`}
            icon={Film}
          />
          <StatCard
            title="4K UHD Masters"
            value={`${fourKTotal} Films`}
            icon={Tv}
          />
        </div>

        {/* View Mode & Filter Controls Bar */}
        <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-white" />
                <span>Catalog Taxonomy View Options</span>
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Switch between Flat Table, Category-Wise breakdown, or Category + Subcategory hierarchical groupings
              </p>
            </div>

            {/* View Mode Switcher Pills */}
            <div className="flex items-center bg-black border border-neutral-800 rounded-xl p-1 gap-1 w-fit">
              <button
                onClick={() => setViewMode('category_wise')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'category_wise'
                    ? 'bg-white text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Category Wise</span>
              </button>
              <button
                onClick={() => setViewMode('category_subcategory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'category_subcategory'
                    ? 'bg-white text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Category + Subcategory</span>
              </button>
              <button
                onClick={() => setViewMode('flat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'flat'
                    ? 'bg-white text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Flat Table</span>
              </button>
            </div>
          </div>

          {/* Interactive Filters Bar */}
          <div className="pt-3 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, categories, or subcategories..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <div>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => {
                  setSelectedCategoryFilter(e.target.value);
                  setSelectedSubcategoryFilter('ALL');
                }}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neutral-600 text-xs"
              >
                <option value="ALL">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({movies.filter((m) => m.category === c.name).length} films)
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter Dropdown */}
            <div>
              <select
                value={selectedSubcategoryFilter}
                onChange={(e) => setSelectedSubcategoryFilter(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neutral-600 text-xs"
              >
                <option value="ALL">All Subcategories ({availableSubcategories.length})</option>
                {availableSubcategories.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ---------------- VIEW 1: CATEGORY WISE GROUPED ---------------- */}
        {viewMode === 'category_wise' && (
          <div className="space-y-6">
            {categories
              .filter((cat) => selectedCategoryFilter === 'ALL' || cat.name === selectedCategoryFilter)
              .map((cat) => {
                const catMovies = filteredMovies.filter((m) => m.category === cat.name);
                const totalInCat = catMovies.length;
                const fourKInCat = catMovies.filter((m) => m.quality === '4K UHD').length;
                const style = getColorClass(cat.color);

                return (
                  <div
                    key={cat.id}
                    className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl"
                  >
                    {/* Category Header Banner */}
                    <div className={`p-5 sm:p-6 bg-gradient-to-r ${style.gradient} border-b border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-xl font-black text-white">{cat.name}</h3>
                          {cat.isCustom && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                              Custom
                            </span>
                          )}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${style.bg} ${style.text} border ${style.border}`}>
                            {totalInCat} titles
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300">{cat.description}</p>

                        {/* Subcategory Tags Pill Row */}
                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] text-neutral-400 font-semibold mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>Subcategories:</span>
                          </span>
                          {cat.subcategories.map((sub) => (
                            <span
                              key={sub}
                              className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 border border-neutral-800 text-neutral-300 hover:border-neutral-600"
                            >
                              <span>{sub}</span>
                              <button
                                onClick={() => handleQuickRemoveSubcat(cat.id, sub)}
                                title={`Remove ${sub}`}
                                className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={() => {
                              setAddingSubcategoryCatId(cat.id);
                              setNewSubcategoryName('');
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                            <span>Add Tag</span>
                          </button>
                        </div>
                      </div>

                      {/* Category Actions */}
                      <div className="flex items-center gap-2 self-start md:self-center">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-semibold text-xs transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-neutral-400" />
                          <span>Edit</span>
                        </button>
                        {cat.isCustom && (
                          <button
                            onClick={() => setDeletingCategory(cat)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-neutral-800 hover:border-rose-500/50 text-neutral-400 hover:text-rose-400 font-semibold text-xs transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Films Grid / Mini Table */}
                    {catMovies.length === 0 ? (
                      <div className="p-8 text-center text-neutral-500 text-xs">
                        No movie assets assigned to this category matching current filters.
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-900 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#080808] text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-900">
                            <tr>
                              <th className="py-2.5 px-4">Movie</th>
                              <th className="py-2.5 px-4">Subcategory</th>
                              <th className="py-2.5 px-4">Quality</th>
                              <th className="py-2.5 px-4">Rating</th>
                              <th className="py-2.5 px-4 text-right">Re-assign</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-900">
                            {catMovies.map((movie) => (
                              <tr key={movie.id} className="hover:bg-neutral-900/40 transition-colors">
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="relative w-8 h-11 rounded overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-800">
                                      <Image
                                        src={movie.poster}
                                        alt={movie.title}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h6 className="font-bold text-white text-xs">{movie.title}</h6>
                                      <p className="text-[10px] text-neutral-400">{movie.releaseYear} • {movie.duration}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-900 text-neutral-200 border border-neutral-800">
                                    {getMovieSubcategory(movie)}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 font-mono font-bold text-neutral-300">
                                  {movie.quality}
                                </td>
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-1 font-bold text-amber-400 font-mono">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    <span>{movie.rating.toFixed(1)}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 text-right">
                                  <button
                                    onClick={() => {
                                      setEditingMovieCat(movie);
                                      setMovieNewCat(movie.category);
                                      setMovieNewSubcat(getMovieSubcategory(movie));
                                    }}
                                    className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-[10px] font-bold"
                                  >
                                    Edit Tag
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* ---------------- VIEW 2: CATEGORY + SUBCATEGORY HIERARCHICAL ---------------- */}
        {viewMode === 'category_subcategory' && (
          <div className="space-y-6">
            {categories
              .filter((cat) => selectedCategoryFilter === 'ALL' || cat.name === selectedCategoryFilter)
              .map((cat) => {
                const catMovies = filteredMovies.filter((m) => m.category === cat.name);
                const style = getColorClass(cat.color);

                // Group movies by subcategory
                const subcategoryGroups: Record<string, Movie[]> = {};
                cat.subcategories.forEach((sub) => {
                  subcategoryGroups[sub] = [];
                });
                subcategoryGroups['General / Other'] = [];

                catMovies.forEach((m) => {
                  const sub = getMovieSubcategory(m);
                  if (subcategoryGroups[sub]) {
                    subcategoryGroups[sub].push(m);
                  } else {
                    subcategoryGroups['General / Other'].push(m);
                  }
                });

                return (
                  <div key={cat.id} className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${style.bg.replace('/10', '')}`} />
                        <h3 className="text-lg font-black text-white">{cat.name}</h3>
                        <span className="text-xs text-neutral-500 font-mono">({catMovies.length} total films)</span>
                      </div>
                      <button
                        onClick={() => openEditModal(cat)}
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Manage Subcategories</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(subcategoryGroups).map(([subName, subMovies]) => {
                        if (subMovies.length === 0 && selectedSubcategoryFilter !== 'ALL') return null;

                        return (
                          <div
                            key={subName}
                            className="bg-[#070707] border border-neutral-900 rounded-xl p-4 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                  <Tag className="w-3 h-3 text-neutral-400" />
                                  <span>{subName}</span>
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 text-neutral-300 border border-neutral-800">
                                  {subMovies.length} titles
                                </span>
                              </div>

                              {subMovies.length === 0 ? (
                                <p className="text-[11px] text-neutral-600 py-3 italic text-center">No movies currently tagged</p>
                              ) : (
                                <div className="space-y-2 mt-3">
                                  {subMovies.slice(0, 4).map((movie) => (
                                    <div
                                      key={movie.id}
                                      className="flex items-center justify-between text-xs py-1 border-b border-neutral-900/60 last:border-0"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <div className="relative w-5 h-7 rounded overflow-hidden bg-neutral-800 flex-shrink-0">
                                          <Image src={movie.poster} alt={movie.title} fill sizes="20px" className="object-cover" />
                                        </div>
                                        <span className="text-neutral-200 truncate font-medium text-[11px]">{movie.title}</span>
                                      </div>
                                      <span className="font-mono text-[10px] text-amber-400 font-bold ml-2">★ {movie.rating.toFixed(1)}</span>
                                    </div>
                                  ))}
                                  {subMovies.length > 4 && (
                                    <p className="text-[10px] text-neutral-500 font-mono text-center pt-1">
                                      + {subMovies.length - 4} more titles
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="pt-3 mt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-500">
                              <span>Subcategory Tag</span>
                              <span className="text-emerald-400 font-bold">Active Rail</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ---------------- VIEW 3: FLAT DATA TABLE ---------------- */}
        {viewMode === 'flat' && (
          <DataTable
            columns={tableColumns}
            data={filteredMovies}
            searchKeys={['title', 'category', 'subcategory', 'director']}
            searchPlaceholder="Search movie title, category, subcategory..."
            defaultSortKey="title"
            defaultSortDir="asc"
          />
        )}
      </div>

      {/* CREATE CATEGORY MODAL */}
      {isCreateCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCreateCatModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>Create Category &amp; Subcategories</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Add a new film taxonomy rail with optional subcategories</p>
              </div>
              <button onClick={() => setIsCreateCatModalOpen(false)} className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={catFormName}
                    onChange={(e) => {
                      setCatFormName(e.target.value);
                      if (!catFormSlug) setCatFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    placeholder="e.g. Korean Cinema"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={catFormSlug}
                    onChange={(e) => setCatFormSlug(e.target.value)}
                    placeholder="e.g. korean-cinema"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catFormDesc}
                  onChange={(e) => setCatFormDesc(e.target.value)}
                  placeholder="Short description of this film rail..."
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">Theme Accent Color</label>
                <div className="flex items-center gap-2">
                  {['amber', 'blue', 'emerald', 'red', 'purple'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setCatFormColor(col)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold capitalize transition-all ${
                        catFormColor === col ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (Tags) */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Subcategories (Optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subcatInput}
                    onChange={(e) => setSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcatTag();
                      }
                    }}
                    placeholder="Type subcategory (e.g. Action, Thriller) and press Add..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcatTag}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
                  >
                    Add
                  </button>
                </div>

                {catFormSubcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {catFormSubcategories.map((sub) => (
                      <span key={sub} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 text-white font-semibold text-xs border border-neutral-700">
                        <span>{sub}</span>
                        <button type="button" onClick={() => handleRemoveSubcatTag(sub)} className="text-neutral-400 hover:text-rose-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingCategory(null)} />
          <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-400" />
                  <span>Edit Category &amp; Subcategories</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Modify {editingCategory.name} taxonomy rail and subcategories</p>
              </div>
              <button onClick={() => setEditingCategory(null)} className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCategory} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={catFormName}
                    onChange={(e) => setCatFormName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Slug</label>
                  <input
                    type="text"
                    value={catFormSlug}
                    onChange={(e) => setCatFormSlug(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catFormDesc}
                  onChange={(e) => setCatFormDesc(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">Theme Color</label>
                <div className="flex items-center gap-2">
                  {['amber', 'blue', 'emerald', 'red', 'purple'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setCatFormColor(col)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold capitalize transition-all ${
                        catFormColor === col ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (Tags) */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Subcategories</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subcatInput}
                    onChange={(e) => setSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcatTag();
                      }
                    }}
                    placeholder="Add subcategory..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcatTag}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {catFormSubcategories.map((sub) => (
                    <span key={sub} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 text-white font-semibold text-xs border border-neutral-700">
                      <span>{sub}</span>
                      <button type="button" onClick={() => handleRemoveSubcatTag(sub)} className="text-neutral-400 hover:text-rose-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD SUBCATEGORY MODAL */}
      {addingSubcategoryCatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setAddingSubcategoryCatId(null)} />
          <div className="relative w-full max-w-sm bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Add Subcategory Tag</span>
            </h4>
            <form onSubmit={handleQuickAddSubcat} className="space-y-3 text-xs">
              <input
                type="text"
                required
                autoFocus
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="e.g. Cyberpunk, Psychological Thriller..."
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddingSubcategoryCatId(null)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-white text-black font-extrabold hover:bg-neutral-200"
                >
                  Add Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setDeletingCategory(null)} />
          <div className="relative w-full max-w-md bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Category</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Are you sure you want to delete category <span className="text-white font-bold">{deletingCategory.name}</span>?
                Its subcategory taxonomy tags will also be detached.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-500 transition-colors"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RE-ASSIGN MOVIE CATEGORY / SUBCATEGORY MODAL */}
      {editingMovieCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingMovieCat(null)} />
          <div className="relative w-full max-w-md bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-14 rounded overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-800">
                  <Image src={editingMovieCat.poster} alt={editingMovieCat.title} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{editingMovieCat.title}</h3>
                  <p className="text-[11px] text-neutral-400">Re-assign taxonomy classification</p>
                </div>
              </div>
              <button onClick={() => setEditingMovieCat(null)} className="p-1 rounded-lg text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovieCatAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Target Category</label>
                <select
                  value={movieNewCat}
                  onChange={(e) => {
                    setMovieNewCat(e.target.value);
                    const target = categories.find((c) => c.name === e.target.value);
                    if (target && target.subcategories.length > 0) {
                      setMovieNewSubcat(target.subcategories[0]);
                    }
                  }}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Target Subcategory</label>
                <input
                  type="text"
                  value={movieNewSubcat}
                  onChange={(e) => setMovieNewSubcat(e.target.value)}
                  placeholder="e.g. Action, Sci-Fi..."
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                {(() => {
                  const targetCatObj = categories.find((c) => c.name === movieNewCat);
                  if (targetCatObj && targetCatObj.subcategories.length > 0) {
                    return (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {targetCatObj.subcategories.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setMovieNewSubcat(s)}
                            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                              movieNewSubcat === s
                                ? 'bg-white text-black border-white font-bold'
                                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setEditingMovieCat(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-white text-black font-extrabold hover:bg-neutral-200"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
