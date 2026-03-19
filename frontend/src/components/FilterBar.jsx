import React from 'react';
import { Search, X } from 'lucide-react';

const categories = ['Tech', 'Health', 'Finance', 'Education', 'E-commerce', 'Other'];
const difficulties = [
  { value: '', label: 'Any' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: '🔥 Trending' },
];

const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search ideas..."
          className="input-field pl-11 pr-10 text-sm"
        />
        {filters.search && (
          <button
            onClick={() => handleChange('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-3 h-3 text-white/50" />
          </button>
        )}
      </div>

      {/* Pill Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider mr-1">Category</span>
          <button
            onClick={() => handleChange('category', '')}
            className={`pill ${!filters.category ? 'pill-active' : ''}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleChange('category', cat)}
              className={`pill ${filters.category === cat ? 'pill-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider mr-1">Difficulty</span>
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => handleChange('difficulty', d.value)}
              className={`pill ${filters.difficulty === d.value ? 'pill-active' : ''}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 ml-auto">
          {sortOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => handleChange('sortBy', s.value)}
              className={`pill ${filters.sortBy === s.value ? 'pill-active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
