import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  active = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-sans font-semibold rounded-[18px] transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none flex items-center justify-center gap-2 outline-none';
  
  // Size Varian
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-[14px] min-h-[38px]',
    md: 'px-6 py-3 text-base rounded-[18px] min-h-[46px]', // 44px+ touch target
    lg: 'px-8 py-4 text-lg rounded-[22px] min-h-[54px]'
  };

  // Color & Shadow Varian
  const variantClasses = {
    primary: active
      ? 'bg-primary-custom text-white shadow-neumorph-primary-in'
      : 'bg-primary-custom text-white shadow-neumorph-primary-out hover:brightness-105 active:shadow-neumorph-primary-in',
    
    secondary: active
      ? 'bg-bg-custom text-dark-custom shadow-neumorph-sm-in'
      : 'bg-bg-custom text-dark-custom shadow-neumorph-sm-out hover:shadow-neumorph-out hover:-translate-y-[1px] active:shadow-neumorph-sm-in',

    success: active
      ? 'bg-success-custom text-white shadow-[inset_3px_3px_6px_#347a37,inset_-3px_-3px_6px_#64c468]'
      : 'bg-success-custom text-white shadow-[4px_4px_8px_#347a37,-4px_-4px_8px_#64c468] hover:brightness-105 active:shadow-[inset_3px_3px_6px_#347a37,inset_-3px_-3px_6px_#64c468]',

    danger: active
      ? 'bg-danger-custom text-white shadow-[inset_3px_3px_6px_#db4343,inset_-3px_-3px_6px_#ff7575]'
      : 'bg-danger-custom text-white shadow-[4px_4px_8px_#db4343,-4px_-4px_8px_#ff7575] hover:brightness-105 active:shadow-[inset_3px_3px_6px_#db4343,inset_-3px_-3px_6px_#ff7575]'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
