import { useState } from 'react';
import Badge from '../ui/Badge';
import { useTasks } from '../../hooks/useTasks';

const COLUMNS = [
  { id: 'pending', title: 'Pending', color: 'bg-status-pending' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-status-in-progress' },
  { id: 'completed', title: 'Completed', color: 'bg-status-completed' },
];

export default function KanbanBoard({ onEdit, onDelete }) {
  const { tasks, updateTask } = useTasks();
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (draggedOverColumn !== columnId) {
      setDraggedOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    // Find the task to verify if status changed
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== targetStatus) {
      try {
        await updateTask(taskId, { status: targetStatus });
      } catch (err) {
        console.error('Failed to update task status on drop:', err);
      }
    }
  };

  const getTasksForColumn = (columnId) => {
    return tasks.filter((task) => task.status === columnId);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[60vh] items-start animate-fade-in">
      {COLUMNS.map((col) => {
        const colTasks = getTasksForColumn(col.id);
        const isHovered = draggedOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col h-full min-h-[500px] rounded-xl border p-4 bg-bg-secondary transition-all duration-200 ${
              isHovered
                ? 'border-accent-solid ring-2 ring-accent-solid/10 bg-bg-card-hover/20'
                : 'border-border-subtle shadow-sm'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-text-primary text-sm tracking-tight">{col.title}</h3>
                <span className="text-xs text-text-muted font-bold px-1.5 py-0.25 bg-bg-primary rounded-full border border-border-subtle">
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[70vh] pr-1">
              {colTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle/50 rounded-lg p-8 text-center text-text-muted bg-bg-primary/20">
                  <span className="text-xs">Drag tasks here</span>
                </div>
              ) : (
                colTasks.map((task) => {
                  const isTaskOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
                  return (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className="bg-bg-card border border-border-subtle hover:border-border-strong rounded-lg p-4 shadow-sm hover:shadow transition-all duration-150 cursor-grab active:cursor-grabbing group animate-fade-in-up"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent-solid line-clamp-2 leading-snug">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(task)}
                            className="p-1 rounded text-text-muted hover:text-text-primary"
                            aria-label="Edit task"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-xs text-text-secondary line-clamp-2 mb-3 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.25 rounded text-[9px] font-semibold bg-bg-primary border border-border-subtle text-text-secondary uppercase"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-subtle">
                        <Badge type="priority" value={task.priority} />
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 text-[10px] font-medium shrink-0 ${isTaskOverdue ? 'text-danger animate-pulse' : 'text-text-muted'}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
