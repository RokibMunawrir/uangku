import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  className = '',
  variant = 'primary'
}) => {
  const percentage = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0));

  const variantGradients = {
    primary: 'from-primary-custom to-indigo-500 shadow-[0_0_8px_rgba(108,99,255,0.4)]',
    success: 'from-success-custom to-emerald-400 shadow-[0_0_8px_rgba(76,175,80,0.4)]',
    danger: 'from-danger-custom to-rose-400 shadow-[0_0_8px_rgba(255,92,92,0.4)]',
    warning: 'from-warning-custom to-amber-400 shadow-[0_0_8px_rgba(255,193,7,0.4)]'
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Outer wrapper: Neumorphic track */}
      <div className="w-full h-4 bg-bg-custom rounded-full p-[3px] shadow-neumorph-in overflow-hidden">
        {/* Animated fill */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${variantGradients[variant]} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
