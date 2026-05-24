import { useState } from 'react';
import Badge from '../ui/Badge';
import { useTasks } from '../../hooks/useTasks';

/**
 * Task card with premium SaaS styling.
 * Supports status/priority badges, due date reminders, tag badges,
 * subtask progress tracking, and inline interactive subtask checklists.
 */
export default function TaskCard({ task, onEdit, onDelete }) {
  const { updateTask } = useTasks();
  const [subtasksExpanded, setSubtasksExpanded] = useState(false);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleToggleSubtask = async (subtaskIndex) => {
    const updatedSubtasks = task.subtasks.map((st, idx) =>
      idx === subtaskIndex ? { ...st, completed: !st.completed } : st
    );
    
    try {
      await updateTask(task._id, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  // Subtask progress calculations
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="glass-card p-5 group flex flex-col justify-between animate-fade-in-up hover:border-border-strong hover:shadow-md transition-all duration-200">
      <div>
        {/* Header: Title + Actions */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-base font-semibold text-text-primary line-clamp-2 leading-snug">
            {task.title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card-hover border border-transparent hover:border-border-subtle transition-all cursor-pointer"
              aria-label={`Edit task: ${task.title}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all cursor-pointer"
              aria-label={`Delete task: ${task.title}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-3.5 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3.5">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-bg-primary border border-border-subtle text-text-secondary uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* Subtask Progress Bar */}
        {totalSubtasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
              <button
                onClick={() => setSubtasksExpanded(!subtasksExpanded)}
                className="flex items-center gap-1 font-medium hover:text-text-primary focus:outline-none cursor-pointer"
              >
                <span>Checklist</span>
                <span className="text-[10px] text-text-muted px-1.5 py-0.25 bg-bg-primary rounded-full border border-border-subtle">
                  {completedSubtasks}/{totalSubtasks}
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${subtasksExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <span className="text-text-muted font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-bg-primary border border-border-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-solid transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Interactive Inline Subtasks Checklist */}
            {subtasksExpanded && (
              <div className="mt-2.5 space-y-1.5 pl-1.5 border-l border-border-subtle animate-slide-down">
                {task.subtasks.map((st, idx) => (
                  <label
                    key={st._id || idx}
                    className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer hover:text-text-primary"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(idx)}
                      className="w-3.5 h-3.5 rounded border-border-strong text-accent-solid focus:ring-accent-solid accent-text-primary cursor-pointer shrink-0"
                    />
                    <span className={st.completed ? 'line-through text-text-muted' : 'font-medium'}>
                      {st.title}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Badges & Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border-subtle mt-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <Badge type="status" value={task.status} />
            <Badge type="priority" value={task.priority} />
          </div>

          {/* Footer: Due Date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-[11px] font-medium shrink-0 ${isOverdue ? 'text-danger' : 'text-text-muted'}`}>
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{isOverdue ? 'Overdue' : formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
