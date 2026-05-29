import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  inset?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  inset = false,
  ...props
}) => {
  const baseClasses = 'bg-bg-custom rounded-[24px] p-6 transition-all duration-300 ease-out';
  const shadowClass = inset ? 'shadow-neumorph-in' : 'shadow-neumorph-out';
  const hoverClass = hoverable && !inset 
    ? 'hover:-translate-y-1 hover:shadow-neumorph-btn-hover cursor-pointer' 
    : '';

  return (
    <div
      className={`${baseClasses} ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
