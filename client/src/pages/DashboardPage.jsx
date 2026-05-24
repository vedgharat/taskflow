import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import StatsCard from '../components/dashboard/StatsCard';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, fetchStats, tasks, fetchTasks, loading } = useTasks();

  useEffect(() => {
    fetchStats();
    // Fetch all user's tasks to calculate alerts/reminders accurately
    fetchTasks({ limit: 100, page: 1 });
  }, [fetchStats, fetchTasks]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Due Date Reminders Calculations
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  );
  
  const dueTodayTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'completed') return false;
    const today = new Date();
    const dDate = new Date(t.dueDate);
    return today.toDateString() === dDate.toDateString();
  });

  const statsCards = [
    {
      label: 'Total Tasks',
      count: stats.total,
      color: 'indigo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Pending',
      count: stats.pending,
      color: 'amber',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'In Progress',
      count: stats['in-progress'],
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: 'Completed',
      count: stats.completed,
      color: 'emerald',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          {greeting()},{' '}
          <span className="text-text-primary">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-text-secondary mt-0.5">Here&apos;s an overview of your workspace</p>
      </div>

      {/* Due Date Alerts / Reminders Panel */}
      {(overdueTasks.length > 0 || dueTodayTasks.length > 0) && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
          {overdueTasks.length > 0 && (
            <div className="bg-danger/5 border border-danger/20 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-danger">Overdue Tasks ({overdueTasks.length})</h4>
                <p className="text-xs text-text-secondary mt-1">
                  These tasks require immediate attention:
                </p>
                <ul className="text-xs text-text-primary font-medium mt-1.5 list-disc pl-4 space-y-1">
                  {overdueTasks.slice(0, 3).map((t) => (
                    <li key={t._id}>{t.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {dueTodayTasks.length > 0 && (
            <div className="bg-status-pending/5 border border-status-pending/20 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-status-pending shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-status-pending">Due Today ({dueTodayTasks.length})</h4>
                <p className="text-xs text-text-secondary mt-1">
                  Complete these tasks before the day ends:
                </p>
                <ul className="text-xs text-text-primary font-medium mt-1.5 list-disc pl-4 space-y-1">
                  {dueTodayTasks.slice(0, 3).map((t) => (
                    <li key={t._id}>{t.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Recent Tasks</h2>
          <Link to="/tasks">
            <Button variant="ghost" size="sm">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>

        {loading ? (
          <Spinner className="py-12" />
        ) : tasks.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <svg className="w-12 h-12 text-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-text-secondary text-sm mb-4">No tasks yet. Create your first task!</p>
            <Link to="/tasks">
              <Button size="sm">Go to Tasks</Button>
            </Link>
          </div>
        ) : (
          <div className="glass-card divide-y divide-border-subtle overflow-hidden">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between px-5 py-4 hover:bg-bg-card-hover transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      task.status === 'completed'
                        ? 'bg-status-completed'
                        : task.status === 'in-progress'
                          ? 'bg-status-in-progress'
                          : 'bg-status-pending'
                    }`}
                  />
                  <span className={`text-sm font-medium truncate ${
                    task.status === 'completed' ? 'line-through text-text-muted' : 'text-text-primary'
                  }`}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    task.priority === 'high'
                      ? 'bg-priority-high/15 text-priority-high'
                      : task.priority === 'medium'
                        ? 'bg-priority-medium/15 text-priority-medium'
                        : 'bg-priority-low/15 text-priority-low'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
