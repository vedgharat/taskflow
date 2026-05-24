import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

/**
 * Custom hook to consume the TaskContext.
 * Throws if used outside of TaskProvider.
 */
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
