'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Film,
  Star,
  Eye,
  CheckCircle,
  Plus,
  Play,
  X,
  ExternalLink,
  Flame,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Check,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { Movie, MovieCategory, MovieQuality } from '@movie-site/shared';

const STORAGE_MOVIES_KEY = 'cineblack_admin_movies';

const GENRE_OPTIONS = [
  'Action',
  'Thriller',
  'Drama',
  'Sci-Fi',
  'Comedy',
  'Romance',
  'Adventure',
  'Crime',
  'Horror',
  'Mystery',
  'Animation',
  'Biography',
  'Fantasy',
];

const CATEGORY_OPTIONS: MovieCategory[] = ['Hindi', 'English', 'Bangla', 'Hindi Dubbed'];
const QUALITY_OPTIONS: MovieQuality[] = ['4K UHD', '1080p FHD', '720p HD', 'HDR'];
type MovieStatus = 'Published' | 'Draft' | 'Featured' | 'Archived';

const STATUS_OPTIONS: MovieStatus[] = [
  'Published',
  'Featured',
  'Draft',
  'Archived',
];

interface MovieFormData {
  title: string;
  description: string;
  category: MovieCategory;
  subcategory: string;
  genre: string[];
  releaseYear: number;
  rating: number;
  duration: string;
  language: string;
  quality: MovieQuality;
  poster: string;
  backdrop: string;
  videoUrl: string;
  director: string;
  cast: string;
  status: MovieStatus;
}

const DEFAULT_MOVIE_FORM: MovieFormData = {
  title: '',
  description: '',
  category: 'English',
  subcategory: 'Action Thriller',
  genre: ['Action', 'Thriller'],
  releaseYear: new Date().getFullYear(),
  rating: 7.5,
  duration: '2h 10m',
  language: 'English',
  quality: '4K UHD',
  poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
  backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  director: '',
  cast: '',
  status: 'Published',
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  // Form state
  const [formData, setFormData] = useState<MovieFormData>(DEFAULT_MOVIE_FORM);
  const [formError, setFormError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load movies from localStorage or fallback to MOCK_MOVIES
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_MOVIES_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMovies(parsed);
              setIsLoaded(true);
              return;
            }
          } catch (e) {
            console.error('Failed to parse saved movies from localStorage', e);
          }
        }
        setMovies(MOCK_MOVIES);
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save movies to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(movies));
    }
  }, [movies, isLoaded]);

  // Metrics
  const totalMovies = movies.length;
  const fourKCount = movies.filter((m) => m.quality === '4K UHD').length;
  const featuredCount = movies.filter((m) => m.status === 'Featured').length;
  const totalCatalogViews = movies.reduce((acc, m) => acc + (m.totalViews || 0), 0);

  // Open Create Modal
  const openCreateModal = () => {
    setFormData(DEFAULT_MOVIE_FORM);
    setFormError('');
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      category: movie.category,
      subcategory: movie.subcategory || '',
      genre: movie.genre || [],
      releaseYear: movie.releaseYear,
      rating: movie.rating,
      duration: movie.duration,
      language: movie.language,
      quality: movie.quality,
      poster: movie.poster,
      backdrop: movie.backdrop || movie.poster,
      videoUrl: movie.videoUrl,
      director: movie.director,
      cast: (movie.cast || []).join(', '),
      status: movie.status || 'Published',
    });
    setFormError('');
  };

  // Toggle genre in form
  const toggleGenre = (genreName: string) => {
    setFormData((prev) => {
      const exists = prev.genre.includes(genreName);
      if (exists) {
        if (prev.genre.length <= 1) return prev; // Keep at least one genre
        return { ...prev, genre: prev.genre.filter((g) => g !== genreName) };
      }
      return { ...prev, genre: [...prev.genre, genreName] };
    });
  };

  // Handle Create Movie
  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Movie title is required');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Movie description is required');
      return;
    }
    if (formData.genre.length === 0) {
      setFormError('Select at least one genre');
      return;
    }

    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const newId = `${formData.category.toLowerCase().replace(/\s+/g, '-')}-${slug || Date.now().toString(36)}`;

    const castList = formData.cast
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const newMovie: Movie = {
      id: newId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      subcategory: formData.subcategory.trim() || undefined,
      genre: formData.genre,
      releaseYear: Number(formData.releaseYear) || new Date().getFullYear(),
      rating: Number(formData.rating) || 7.0,
      duration: formData.duration.trim() || '2h 00m',
      language: formData.language.trim() || 'English',
      quality: formData.quality,
      poster: formData.poster.trim() || DEFAULT_MOVIE_FORM.poster,
      backdrop: formData.backdrop.trim() || formData.poster.trim() || DEFAULT_MOVIE_FORM.backdrop,
      videoUrl: formData.videoUrl.trim() || DEFAULT_MOVIE_FORM.videoUrl,
      director: formData.director.trim() || 'Unknown Director',
      cast: castList.length > 0 ? castList : ['Cast TBA'],
      status: formData.status,
      featured: formData.status === 'Featured',
      totalViews: 0,
      completionRate: 85,
    };

    setMovies([newMovie, ...movies]);
    setIsCreateModalOpen(false);
    setToastMessage(`Created movie "${newMovie.title}"`);
  };

  // Handle Update Movie
  const handleUpdateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie) return;
    if (!formData.title.trim()) {
      setFormError('Movie title is required');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Movie description is required');
      return;
    }
    if (formData.genre.length === 0) {
      setFormError('Select at least one genre');
      return;
    }

    const castList = formData.cast
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const updatedMovie: Movie = {
      ...editingMovie,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      subcategory: formData.subcategory.trim() || undefined,
      genre: formData.genre,
      releaseYear: Number(formData.releaseYear) || editingMovie.releaseYear,
      rating: Number(formData.rating) || editingMovie.rating,
      duration: formData.duration.trim() || editingMovie.duration,
      language: formData.language.trim() || editingMovie.language,
      quality: formData.quality,
      poster: formData.poster.trim() || editingMovie.poster,
      backdrop: formData.backdrop.trim() || editingMovie.backdrop,
      videoUrl: formData.videoUrl.trim() || editingMovie.videoUrl,
      director: formData.director.trim() || editingMovie.director,
      cast: castList.length > 0 ? castList : editingMovie.cast,
      status: formData.status,
      featured: formData.status === 'Featured',
    };

    setMovies(movies.map((m) => (m.id === editingMovie.id ? updatedMovie : m)));
    if (selectedMovie?.id === editingMovie.id) {
      setSelectedMovie(updatedMovie);
    }
    setEditingMovie(null);
    setToastMessage(`Updated movie "${updatedMovie.title}"`);
  };

  // Handle Delete Movie
  const handleDeleteMovie = () => {
    if (!deletingMovie) return;
    setMovies(movies.filter((m) => m.id !== deletingMovie.id));
    if (selectedMovie?.id === deletingMovie.id) {
      setSelectedMovie(null);
    }
    setToastMessage(`Deleted movie "${deletingMovie.title}"`);
    setDeletingMovie(null);
  };

  // Reset to default seed
  const handleResetToDefault = () => {
    if (confirm('Reset movie catalog to initial system defaults? All custom changes will be restored.')) {
      setMovies(MOCK_MOVIES);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(MOCK_MOVIES));
      }
      setToastMessage('Movie catalog restored to defaults');
    }
  };

  const columns: Column<Movie>[] = [
    {
      key: 'title',
      header: 'Movie Title & Poster',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="relative w-10 h-14 rounded overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
            <Image
              src={m.poster}
              alt={m.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                onClick={() => setSelectedMovie(m)}
                className="font-bold text-white text-xs hover:underline cursor-pointer"
              >
                {m.title}
              </span>
              {m.status === 'Featured' && <Flame className="w-3 h-3 text-amber-400" />}
            </div>
            <p className="text-[11px] text-neutral-400">
              {m.releaseYear} • {m.duration} • Dir. {m.director}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (m) => (
        <span className="font-semibold text-neutral-200 text-xs">{m.category}</span>
      ),
    },
    {
      key: 'genre',
      header: 'Genre',
      render: (m) => (
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {(m.genre || []).map((g) => (
            <span key={g} className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400">
              {g}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'quality',
      header: 'Quality',
      sortable: true,
      render: (m) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold font-mono bg-neutral-900 border border-neutral-700 text-white">
          {m.quality}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'IMDb',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-1 font-bold text-white text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(m.rating || 0).toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'totalViews',
      header: 'Total Views',
      sortable: true,
      render: (m) => (
        <span className="font-mono font-bold text-white text-xs">
          {(m.totalViews || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'completionRate',
      header: 'Completion',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-2">
          <div className="w-14 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${m.completionRate || 80}%` }}
            />
          </div>
          <span className="font-mono text-emerald-400 text-[11px] font-bold">
            {m.completionRate || 80}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (m) => <StatusBadge status={m.status || 'Published'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (m) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedMovie(m)}
            title="Inspect movie details"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openEditModal(m)}
            title="Edit movie"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 text-neutral-400 hover:text-blue-400 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingMovie(m)}
            title="Delete movie"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 text-neutral-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Content Catalog & Movie Assets"
        subtitle={`Manage ${totalMovies} multi-language films, 4K UHD masters, completion metrics, and featured carousel pins`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Reset movie catalog to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Movie</span>
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Catalog"
            value={totalMovies}
            subtitle="Curated full features"
            icon={Film}
          />
          <StatCard
            title="4K UHD Masters"
            value={fourKCount}
            subtitle={`${totalMovies > 0 ? Math.round((fourKCount / totalMovies) * 100) : 0}% of catalog`}
            trend="up"
            change="High Res"
            icon={CheckCircle}
          />
          <StatCard
            title="Featured Pins"
            value={featuredCount}
            subtitle="Hero carousel tier"
            icon={Flame}
          />
          <StatCard
            title="Catalog Views"
            value={`${(totalCatalogViews / 1000000).toFixed(1)}M`}
            subtitle="Cumulative streams"
            trend="up"
            change="+16.2%"
            icon={Eye}
          />
        </div>

        <DataTable
          columns={columns}
          data={movies}
          searchKeys={['title', 'director', 'language', 'category']}
          searchPlaceholder="Search movie by title, director, category or genre..."
          defaultSortKey="totalViews"
          defaultSortDir="desc"
          onRowClick={(movie) => setSelectedMovie(movie)}
          filters={[
            {
              label: 'Category',
              key: 'category',
              options: [
                { label: 'Hindi', value: 'Hindi' },
                { label: 'English', value: 'English' },
                { label: 'Bangla', value: 'Bangla' },
                { label: 'Hindi Dubbed', value: 'Hindi Dubbed' },
              ],
            },
            {
              label: 'Quality',
              key: 'quality',
              options: [
                { label: '4K UHD', value: '4K UHD' },
                { label: '1080p FHD', value: '1080p FHD' },
              ],
            },
            {
              label: 'Status',
              key: 'status',
              options: [
                { label: 'Featured', value: 'Featured' },
                { label: 'Published', value: 'Published' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Archived', value: 'Archived' },
              ],
            },
          ]}
        />
      </div>

      {/* CREATE MOVIE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div className="relative bg-[#0c0c0c] border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-white" />
                <h3 className="font-extrabold text-white text-base">Add New Movie Asset</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMovie} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Movie Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Oppenheimer"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Overview / Synopsis <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Compelling story synopsis..."
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MovieCategory })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Subcategory / Collection</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Action Thriller"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Master Quality</label>
                  <select
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value as MovieQuality })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {QUALITY_OPTIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Catalog Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MovieStatus })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 2h 49m"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">IMDb Rating (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Audio Language</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    placeholder="e.g. Hindi, English"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Director</label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    placeholder="e.g. Christopher Nolan"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Cast (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.cast}
                    onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                    placeholder="e.g. Cillian Murphy, Emily Blunt"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">
                  Genres (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-neutral-900/60 border border-neutral-800 rounded-xl">
                  {GENRE_OPTIONS.map((g) => {
                    const active = formData.genre.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGenre(g)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          active
                            ? 'bg-white text-black'
                            : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Poster Image URL</label>
                  <input
                    type="text"
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Backdrop Image URL</label>
                  <input
                    type="text"
                    value={formData.backdrop}
                    onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Stream Video Source URL</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://...mp4 or m3u8"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors"
                >
                  Create Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MOVIE MODAL */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setEditingMovie(null)}
          />

          <div className="relative bg-[#0c0c0c] border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <h3 className="font-extrabold text-white text-base">Edit Movie Asset</h3>
              </div>
              <button
                onClick={() => setEditingMovie(null)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateMovie} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Movie Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Overview / Synopsis <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MovieCategory })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Subcategory / Collection</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Master Quality</label>
                  <select
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value as MovieQuality })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {QUALITY_OPTIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Catalog Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MovieStatus })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">IMDb Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Audio Language</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Director</label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Cast (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.cast}
                    onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">
                  Genres (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-neutral-900/60 border border-neutral-800 rounded-xl">
                  {GENRE_OPTIONS.map((g) => {
                    const active = formData.genre.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGenre(g)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Poster Image URL</label>
                  <input
                    type="text"
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Backdrop Image URL</label>
                  <input
                    type="text"
                    value={formData.backdrop}
                    onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Stream Video Source URL</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMovie(null)}
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

      {/* DELETE CONFIRMATION MODAL */}
      {deletingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setDeletingMovie(null)}
          />

          <div className="relative bg-[#0c0c0c] border border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-extrabold text-white text-base">Delete Movie Asset?</h3>
              <p className="text-xs text-neutral-400">
                Are you sure you want to permanently delete{' '}
                <strong className="text-white font-semibold">{deletingMovie.title}</strong> from the catalog? This will remove all streaming availability.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingMovie(null)}
                className="w-1/2 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMovie}
                className="w-1/2 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-500 transition-colors"
              >
                Delete Movie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOVIE DETAILS MODAL (READ / PREVIEW) */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedMovie(null)}
          />
          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl z-10 space-y-4">
            {/* Backdrop Header */}
            <div className="relative h-48 w-full bg-neutral-900">
              <Image
                src={selectedMovie.backdrop || selectedMovie.poster}
                alt={selectedMovie.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/70 border border-neutral-700 text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white drop-shadow-md">
                    {selectedMovie.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-medium mt-0.5">
                    {selectedMovie.category} • {selectedMovie.releaseYear} • {selectedMovie.duration} • {selectedMovie.quality}
                  </p>
                </div>
                <StatusBadge status={selectedMovie.status || 'Published'} />
              </div>
            </div>

            <div className="p-6 pt-0 space-y-4 text-xs">
              <p className="text-neutral-300 leading-relaxed font-medium">
                {selectedMovie.description}
              </p>

              <div className="grid grid-cols-3 gap-3 py-3 border-y border-neutral-900">
                <div className="p-3 bg-neutral-900/60 rounded-xl">
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Total Streams</span>
                  <span className="text-base font-black text-white font-mono mt-0.5 block">
                    {(selectedMovie.totalViews || 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-neutral-900/60 rounded-xl">
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Completion Rate</span>
                  <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                    {selectedMovie.completionRate || 80}%
                  </span>
                </div>
                <div className="p-3 bg-neutral-900/60 rounded-xl">
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">IMDb Score</span>
                  <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                    {Number(selectedMovie.rating || 0).toFixed(1)} / 10
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-neutral-400">
                  <strong className="text-white font-semibold">Director:</strong> {selectedMovie.director}
                </p>
                <p className="text-neutral-400">
                  <strong className="text-white font-semibold">Starring:</strong> {(selectedMovie.cast || []).join(', ')}
                </p>
                <p className="text-neutral-400">
                  <strong className="text-white font-semibold">Video Stream:</strong>{' '}
                  <span className="font-mono text-[11px] text-neutral-300">{selectedMovie.videoUrl}</span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`http://localhost:3000/watch/${selectedMovie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-white text-white font-bold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Preview in Player</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400 ml-1" />
                  </a>

                  <button
                    onClick={() => {
                      const m = selectedMovie;
                      setSelectedMovie(null);
                      openEditModal(m);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 text-neutral-300 hover:text-blue-400 font-semibold transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      const m = selectedMovie;
                      setSelectedMovie(null);
                      setDeletingMovie(m);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 text-neutral-300 hover:text-rose-400 font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedMovie(null)}
                  className="px-4 py-2 rounded-xl bg-white text-black font-extrabold hover:bg-neutral-200 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
