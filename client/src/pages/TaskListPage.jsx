import { useEffect, useState, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import KanbanBoard from '../components/tasks/KanbanBoard';
import CalendarView from '../components/tasks/CalendarView';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';

export default function TaskListPage() {
  const {
    tasks,
    pagination,
    filters,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchStats,
  } = useTasks();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban' | 'calendar'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks(filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Extract all unique tags currently loaded to pass as filter choices
  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags || [])));

  const handleFilterChange = useCallback(
    (newFilters) => {
      fetchTasks(newFilters);
    },
    [fetchTasks]
  );

  const handleClearFilters = useCallback(() => {
    const pageLimit = viewMode === 'list' ? 6 : 100;
    fetchTasks({
      status: '',
      priority: '',
      page: 1,
      limit: pageLimit,
      search: '',
      tag: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [fetchTasks, viewMode]);

  const handlePageChange = useCallback(
    (page) => {
      fetchTasks({ ...filters, page });
    },
    [fetchTasks, filters]
  );

  const handleViewChange = (mode) => {
    setViewMode(mode);
    if (mode === 'kanban' || mode === 'calendar') {
      // Kanban and Calendar need to render all tasks together, increase query limit
      fetchTasks({ ...filters, page: 1, limit: 100 });
    } else {
      // List view is cleaner when paginated to 6
      fetchTasks({ ...filters, page: 1, limit: 6 });
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormError('');
    setIsModalOpen(true);
  };

  // Pre-fill creation date from calendar day click
  const handleCreateWithDate = (date) => {
    // Format date local to YYYY-MM-DDTHH:mm
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

    setEditingTask({ dueDate: localISOTime });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormError('');
  };

  const handleSubmit = async (payload) => {
    setFormLoading(true);
    setFormError('');
    try {
      if (editingTask && editingTask._id) {
        await updateTask(editingTask._id, payload);
      } else {
        await createTask(payload);
        // Refetch to populate the active query layout
        await fetchTasks(filters);
      }
      await fetchStats();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
      await fetchStats();
      // If list view and last item deleted on page, fall back
      if (viewMode === 'list' && tasks.length === 1 && pagination.page > 1) {
        fetchTasks({ ...filters, page: pagination.page - 1 });
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={openCreateModal} id="create-task-button">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Button>
      </div>

      {/* Enhanced Filters Block */}
      <div className="mb-6">
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          tagsList={allTags}
        />
      </div>

      {/* Layout Tab Selector */}
      <div className="flex border-b border-border-subtle mb-6 gap-4">
        <button
          onClick={() => handleViewChange('list')}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            viewMode === 'list'
              ? 'border-accent-solid text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => handleViewChange('kanban')}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            viewMode === 'kanban'
              ? 'border-accent-solid text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Kanban Board
        </button>
        <button
          onClick={() => handleViewChange('calendar')}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            viewMode === 'calendar'
              ? 'border-accent-solid text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Calendar View
        </button>
      </div>

      {/* Central Error Callout */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6 animate-slide-down">
          {error}
        </div>
      )}

      {/* Main Views Container */}
      {loading ? (
        <Spinner className="py-20" size="lg" />
      ) : tasks.length === 0 ? (
        <div className="glass-card p-16 text-center animate-fade-in-up">
          <svg
            className="w-16 h-16 text-text-muted mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-text-secondary text-base mb-1">No tasks found</p>
          <p className="text-text-muted text-sm mb-5">
            {filters.status || filters.priority || filters.search || filters.tag
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          {!(filters.status || filters.priority || filters.search || filters.tag) && (
            <Button onClick={openCreateModal} size="sm">
              Create Task
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* List Layout */}
          {viewMode === 'list' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task, idx) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    index={idx}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {/* Kanban Layout */}
          {viewMode === 'kanban' && (
            <KanbanBoard onEdit={openEditModal} onDelete={handleDelete} />
          )}

          {/* Calendar Layout */}
          {viewMode === 'calendar' && (
            <CalendarView onEdit={openEditModal} onCreateWithDate={handleCreateWithDate} />
          )}
        </>
      )}

      {/* Universal Create / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask && editingTask._id ? 'Edit Task' : 'Create New Task'}
      >
        {formError && (
          <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-4 animate-slide-down">
            {formError}
          </div>
        )}
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
}
