import { createContext, useState, useCallback } from 'react';
import { taskAPI } from '../services/taskService';

export const TaskContext = createContext(null);

const DEFAULT_FILTERS = {
  status: '',
  priority: '',
  page: 1,
  limit: 6,
  search: '',
  tag: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (queryFilters) => {
    setLoading(true);
    setError(null);
    try {
      // Strip empty string values from params
      const params = {};
      const merged = { ...DEFAULT_FILTERS, ...queryFilters };
      Object.entries(merged).forEach(([key, val]) => {
        if (val !== '' && val !== undefined && val !== null) {
          params[key] = val;
        }
      });

      const { data } = await taskAPI.getTasks(params);
      setTasks(data.tasks);
      setPagination({
        total: data.total,
        page: data.page,
        pages: data.pages,
      });
      setFilters(merged);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    const { data } = await taskAPI.createTask(taskData);
    return data.task;
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    const { data } = await taskAPI.updateTask(id, taskData);
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? data.task : t))
    );
    return data.task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await taskAPI.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await taskAPI.getStats();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const value = {
    tasks,
    stats,
    pagination,
    filters,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchStats,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
