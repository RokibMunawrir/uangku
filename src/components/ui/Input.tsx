import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, wrapperClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2 w-full ${wrapperClassName}`}>
        {label && (
          <label className="text-sm font-semibold text-secondary-custom px-1 select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-secondary-custom flex items-center justify-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-bg-custom text-dark-custom rounded-[16px] py-3.5 px-4
              ${icon ? 'pl-11' : 'pl-4'}
              shadow-neumorph-in outline-none border border-transparent
              transition-all duration-300 placeholder:text-neutral-400/80
              focus:border-primary-custom/20 focus:ring-4 focus:ring-primary-custom/10
              disabled:opacity-60 disabled:cursor-not-allowed text-base font-sans
              ${error ? 'border-danger-custom/50 focus:ring-danger-custom/10' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs font-semibold text-danger-custom px-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
