import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const INITIAL_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  tags: [],
  subtasks: [],
};

/**
 * Task create/edit form used inside a Modal.
 */
export default function TaskForm({ task, onSubmit, onCancel, loading = false }) {
  const isEdit = !!task && !!task._id;
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
        tags: task.tags || [],
        subtasks: task.subtasks || [],
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
    setTagInput('');
    setSubtaskInput('');
  }, [task]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    // Clear error on change
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase();
    if (cleanTag && !form.tags.includes(cleanTag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, cleanTag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    const cleanTitle = subtaskInput.trim();
    if (cleanTitle) {
      setForm((prev) => ({
        ...prev,
        subtasks: [...prev.subtasks, { title: cleanTitle, completed: false }],
      }));
    }
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.title.length > 100) newErrors.title = 'Title cannot exceed 100 characters';
    if (form.description.length > 500) newErrors.description = 'Description cannot exceed 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      tags: form.tags,
      subtasks: form.subtasks,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      <Input
        id="title"
        label="Title"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        required
      />

      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Add some details…"
          value={form.description}
          onChange={handleChange}
          rows={2}
          className="input-glass resize-none"
          maxLength={500}
        />
        {errors.description && (
          <p className="text-danger text-xs">{errors.description}</p>
        )}
        <p className="text-xs text-text-muted text-right">{form.description.length}/500</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="status"
          label="Status"
          value={form.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
        />
        <Select
          id="priority"
          label="Priority"
          value={form.priority}
          onChange={handleChange}
          options={PRIORITY_OPTIONS}
        />
      </div>

      <Input
        id="dueDate"
        label="Due Date"
        type="datetime-local"
        value={form.dueDate}
        onChange={handleChange}
      />

      {/* Tags Input Block */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Tags / Categories</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. design, marketing"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
            className="input-glass flex-1"
          />
          <Button onClick={handleAddTag} type="button" variant="secondary" size="sm">
            Add
          </Button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg-card border border-border-subtle text-text-secondary"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-danger focus:outline-none cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Subtasks Block */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Subtasks Checklist</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Research typography, Design prototype"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(e)}
            className="input-glass flex-1"
          />
          <Button onClick={handleAddSubtask} type="button" variant="secondary" size="sm">
            Add
          </Button>
        </div>
        {form.subtasks.length > 0 && (
          <div className="space-y-2 mt-2 border border-border-subtle rounded-lg p-3 bg-bg-primary/50">
            {form.subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center justify-between gap-2 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) => {
                      const updated = [...form.subtasks];
                      updated[index].completed = e.target.checked;
                      setForm((prev) => ({ ...prev, subtasks: updated }));
                    }}
                    className="w-4 h-4 rounded border-border-strong text-accent-solid focus:ring-accent-solid accent-text-primary"
                  />
                  <span className={subtask.completed ? 'line-through text-text-muted' : ''}>
                    {subtask.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(index)}
                  className="text-text-muted hover:text-danger cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
