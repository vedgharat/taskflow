/**
 * Colored badge for displaying status or priority labels.
 */

const STATUS_STYLES = {
  pending: 'bg-status-pending/15 text-status-pending border-status-pending/30',
  'in-progress': 'bg-status-in-progress/15 text-status-in-progress border-status-in-progress/30',
  completed: 'bg-status-completed/15 text-status-completed border-status-completed/30',
};

const PRIORITY_STYLES = {
  low: 'bg-priority-low/15 text-priority-low border-priority-low/30',
  medium: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30',
  high: 'bg-priority-high/15 text-priority-high border-priority-high/30',
};

const STATUS_LABELS = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export default function Badge({ type = 'status', value, className = '' }) {
  const styles = type === 'status' ? STATUS_STYLES : PRIORITY_STYLES;
  const labels = type === 'status' ? STATUS_LABELS : PRIORITY_LABELS;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
        styles[value] || ''
      } ${className}`}
    >
      {type === 'priority' && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            value === 'high'
              ? 'bg-priority-high'
              : value === 'medium'
                ? 'bg-priority-medium'
                : 'bg-priority-low'
          }`}
        />
      )}
      {labels[value] || value}
    </span>
  );
}
