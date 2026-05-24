import { useState } from 'react';

/**
 * Reusable Input component with label, error state, and glass styling.
 */
export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium transition-colors duration-200 ${
            focused ? 'text-accent-start' : 'text-text-secondary'
          }`}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`input-glass ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-danger text-xs mt-1 animate-slide-down">{error}</p>
      )}
    </div>
  );
}
