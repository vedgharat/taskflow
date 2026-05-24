/**
 * Animated stats card for the dashboard with icon, count, and label.
 */
export default function StatsCard({ icon, label, count, color, delay = 0 }) {
  const colorMap = {
    indigo: {
      bg: 'bg-bg-card border border-border-subtle',
      icon: 'text-text-primary',
    },
    amber: {
      bg: 'bg-bg-card border border-status-pending',
      icon: 'text-status-pending',
    },
    blue: {
      bg: 'bg-bg-card border border-status-in-progress',
      icon: 'text-status-in-progress',
    },
    emerald: {
      bg: 'bg-bg-card border border-status-completed',
      icon: 'text-status-completed',
    },
  };

  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="glass-card p-5 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
          <p className="text-3xl font-bold text-text-primary tracking-tight">{count}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg}`}
        >
          <span className={theme.icon}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
