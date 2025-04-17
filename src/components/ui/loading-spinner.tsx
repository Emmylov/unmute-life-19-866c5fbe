
import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingSpinnerSize = 'small' | 'medium' | 'large';
type LoadingSpinnerColor = 'primary' | 'secondary' | 'purple' | 'white';

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  color?: LoadingSpinnerColor;
  text?: string;
  centered?: boolean;
}

const sizeMap: Record<LoadingSpinnerSize, string> = {
  small: 'h-4 w-4',
  medium: 'h-6 w-6',
  large: 'h-8 w-8'
};

const colorMap: Record<LoadingSpinnerColor, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  purple: 'text-purple-500',
  white: 'text-white'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  text,
  centered = false
}) => {
  const containerClasses = centered ? 'flex flex-col items-center justify-center' : 'flex flex-col items-center';
  
  return (
    <div className={containerClasses}>
      <Loader2 className={`${sizeMap[size]} ${colorMap[color]} animate-spin`} />
      {text && <p className={`mt-2 text-sm ${colorMap[color]}`}>{text}</p>}
    </div>
  );
};
