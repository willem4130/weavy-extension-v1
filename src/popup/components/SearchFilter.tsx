/**
 * SearchFilter Component
 * Search and filter templates with debouncing
 */

import { useState, useEffect } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterTags: (tags: string[]) => void;
  onSort: (sortBy: string) => void;
  availableTags: string[];
}

export default function SearchFilter({
  onSearch,
  onFilterTags,
  onSort,
  availableTags
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);
    onFilterTags(newSelectedTags);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSort(value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('date');
    onSearch('');
    onFilterTags([]);
    onSort('date');
  };

  const activeFilterCount = (searchQuery ? 1 : 0) + selectedTags.length;

  return (
    <div className="search-filter">
      {/* Search Input */}
      <div className="search-bar">
        <div className="input-group">
          <span className="input-icon" role="img" aria-label="Search">
            🔍
          </span>
          <input
            type="text"
            className="input"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search templates"
          />
          {searchQuery && (
            <button
              className="btn-icon btn-ghost clear-search"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Tag Filter Button */}
        {availableTags.length > 0 && (
          <button
            className={`btn btn-sm ${selectedTags.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowTagFilter(!showTagFilter)}
          >
            🏷️ Tags
            {selectedTags.length > 0 && (
              <span className="badge badge-sm">{selectedTags.length}</span>
            )}
          </button>
        )}

        {/* Sort Dropdown */}
        <select
          className="select select-sm"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          aria-label="Sort templates"
        >
          <option value="date">Newest First</option>
          <option value="date-old">Oldest First</option>
          <option value="name">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="nodes">Most Nodes</option>
        </select>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={handleClearFilters}
            aria-label="Clear all filters"
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Tag Filter Dropdown */}
      {showTagFilter && availableTags.length > 0 && (
        <div className="tag-filter-dropdown">
          <div className="tag-filter-header">
            <span className="text-sm text-secondary">Filter by tags</span>
            <button
              className="btn-icon-sm btn-ghost"
              onClick={() => setShowTagFilter(false)}
              aria-label="Close tag filter"
            >
              ✕
            </button>
          </div>
          <div className="tag-filter-list">
            {availableTags.map((tag) => (
              <label key={tag} className="tag-filter-item">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                <span className="tag">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {selectedTags.length > 0 && (
        <div className="active-filters">
          <span className="text-xs text-muted">Active filters:</span>
          <div className="tags">
            {selectedTags.map((tag) => (
              <span key={tag} className="tag tag-removable tag-accent">
                {tag}
                <button
                  className="tag-remove"
                  onClick={() => handleTagToggle(tag)}
                  aria-label={`Remove ${tag} filter`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
