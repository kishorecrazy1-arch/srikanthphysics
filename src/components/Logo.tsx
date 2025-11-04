import { BookOpen } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  textColor?: 'default' | 'white' | 'dark';
}

export function Logo({ size = 'md', showText = true, className = '', textColor = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textColorClasses = {
    default: {
      title: 'text-gray-900',
      subtitle: 'text-gray-600'
    },
    white: {
      title: 'text-white',
      subtitle: 'text-gray-200'
    },
    dark: {
      title: 'text-gray-900',
      subtitle: 'text-gray-700'
    }
  };

  const colors = textColorClasses[textColor];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Srikanth's Academy Logo" 
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback to icon if logo not found
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div 
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-800 to-blue-600 rounded-xl flex items-center justify-center`}
        style={{ display: 'none' }}
      >
        <BookOpen className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
      </div>
      {showText && (
        <div>
          <h1 className={`${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl'} font-bold ${colors.title}`}>
            Srikanth's Academy
          </h1>
          <p className={`${size === 'sm' ? 'text-xs' : 'text-xs sm:text-sm'} ${colors.subtitle} hidden sm:block`}>
            Excellence in Physics
          </p>
        </div>
      )}
    </div>
  );
}

