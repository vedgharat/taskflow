import Select from '../ui/Select';
import Button from '../ui/Button';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

/**
 * Enhanced Filter bar for tasks.
 * Supports status, priority, search, tag filtering, and dynamic sorting.
 */
export default function TaskFilters({ filters, onFilterChange, onClear, tagsList = [] }) {
  const hasActiveFilters =
    filters.status || filters.priority || filters.search || filters.tag || filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc';

  const tagOptions = tagsList.map((tag) => ({ value: tag, label: `#${tag}` }));

  return (
    <div className="glass-card p-4 space-y-4 animate-slide-down">
      {/* Row 1: Search input + basic selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label htmlFor="search-task" className="block text-xs font-semibold text-text-secondary">Search</label>
          <input
            id="search-task"
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
            className="input-glass w-full"
          />
        </div>

        <Select
          id="filter-status"
          label="Status"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
        />

        <Select
          id="filter-priority"
          label="Priority"
          value={filters.priority || ''}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value, page: 1 })}
          options={PRIORITY_OPTIONS}
          placeholder="All Priorities"
        />

        {tagOptions.length > 0 ? (
          <Select
            id="filter-tag"
            label="Tag"
            value={filters.tag || ''}
            onChange={(e) => onFilterChange({ ...filters, tag: e.target.value, page: 1 })}
            options={tagOptions}
            placeholder="All Tags"
          />
        ) : (
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-text-secondary">Tag</span>
            <input
              type="text"
              disabled
              placeholder="No tags available"
              className="input-glass w-full opacity-60 cursor-not-allowed"
            />
          </div>
        )}
      </div>

      {/* Row 2: Sort + Clear controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <Select
            id="sort-by"
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            options={SORT_OPTIONS}
            className="w-[150px]"
            label=""
          />
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            className="p-2 rounded-lg border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
            type="button"
            aria-label="Toggle sort order"
          >
            {filters.sortOrder === 'asc' ? (
              <>
                <span>Ascending</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7M19 14l-7 7-7-7" />
                </svg>
              </>
            ) : (
              <>
                <span>Descending</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10l-7 7-7-7M5 14l7 7 7-7" />
                </svg>
              </>
            )}
          </button>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
