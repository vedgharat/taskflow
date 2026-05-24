import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ onEdit, onCreateWithDate }) {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get start day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Get total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Get days in previous month (for rendering trailing dates if desired, or simple blanks)
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getMonthName = () => {
    return currentDate.toLocaleString('default', { month: 'long' });
  };

  // Generate date cells
  const cells = [];
  // Fill offset with blank/disabled cells representing the end of previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({
      dayNum: prevMonthTotalDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthTotalDays - i),
    });
  }
  // Fill current month days
  for (let i = 1; i <= totalDays; i++) {
    cells.push({
      dayNum: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }
  // Fill next month trailing cells to keep a standard 6-row grid (42 cells)
  const totalCellsNeeded = 42;
  const trailingCellsNeeded = totalCellsNeeded - cells.length;
  for (let i = 1; i <= trailingCellsNeeded; i++) {
    cells.push({
      dayNum: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  // Helper to find tasks due on a specific date
  const getTasksForDate = (date) => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dDate = new Date(t.dueDate);
      return (
        dDate.getDate() === date.getDate() &&
        dDate.getMonth() === date.getMonth() &&
        dDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
        <h3 className="text-lg font-bold text-text-primary">
          {getMonthName()} <span className="text-text-muted">{year}</span>
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday Labels Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-text-secondary text-xs uppercase tracking-wider mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1 bg-border-subtle border border-border-subtle rounded-lg overflow-hidden">
        {cells.map((cell, idx) => {
          const dateTasks = getTasksForDate(cell.date);
          const isToday = new Date().toDateString() === cell.date.toDateString();

          return (
            <div
              key={idx}
              className={`min-h-[90px] bg-bg-card p-2 flex flex-col justify-between group transition-colors relative ${
                cell.isCurrentMonth ? '' : 'bg-bg-primary/40 opacity-50'
              }`}
            >
              {/* Day Cell Header */}
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-accent-solid text-bg-secondary'
                      : 'text-text-secondary'
                  }`}
                >
                  {cell.dayNum}
                </span>
                
                {/* Floating "Quick Add" trigger visible on cell hover */}
                {cell.isCurrentMonth && (
                  <button
                    onClick={() => onCreateWithDate(cell.date)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-muted hover:text-text-primary transition-opacity cursor-pointer focus:opacity-100"
                    title="Add task on this day"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Day Cell Task List */}
              <div className="flex-1 flex flex-col gap-1 overflow-hidden mt-1 select-none">
                {dateTasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    onClick={() => onEdit(task)}
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate border cursor-pointer hover:brightness-95 transition-all ${
                      task.status === 'completed'
                        ? 'bg-status-completed/10 text-status-completed border-status-completed/25'
                        : task.status === 'in-progress'
                          ? 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/25'
                          : 'bg-status-pending/10 text-status-pending border-status-pending/25'
                    }`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                {dateTasks.length > 3 && (
                  <span className="text-[8px] text-text-muted font-bold text-center pl-1 block">
                    +{dateTasks.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
