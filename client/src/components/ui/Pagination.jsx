/**
 * Pagination component with page numbers, prev/next, and ellipsis.
 */
export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    let prev = 0;
    for (const i of range) {
      if (prev && i - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-6" aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((item, idx) =>
        item === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-text-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`min-w-[2.25rem] h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              item === page
                ? 'btn-gradient shadow-none'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
            }`}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
