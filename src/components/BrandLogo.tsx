import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  light = false,
}) => {
  const sizeConfig = {
    sm: {
      text: 'text-xl sm:text-2xl',
      dot: 'w-1.5 h-1.5',
      tagline: 'text-[9px]',
      badge: 'text-[9px] px-1.5 py-0.5',
    },
    md: {
      text: 'text-2xl sm:text-[27px]',
      dot: 'w-2 h-2',
      tagline: 'text-[10px]',
      badge: 'text-[9px] px-1.5 py-0.5',
    },
    lg: {
      text: 'text-3xl sm:text-4xl',
      dot: 'w-2.5 h-2.5',
      tagline: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5',
    },
    xl: {
      text: 'text-4xl sm:text-5xl',
      dot: 'w-3 h-3',
      tagline: 'text-xs',
      badge: 'text-xs px-2.5 py-1',
    },
  }[size];

  const smartColor = light
    ? 'text-white'
    : 'text-[#0f1712]';

  const banaoColor = light
    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent'
    : 'text-[#1e4d36]';

  const dotColor = light
    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
    : 'bg-[#23583e] shadow-[0_0_6px_rgba(35,88,62,0.5)]';

  const taglineColor = light ? 'text-emerald-300/80' : 'text-[#617467]';

  return (
    <div className="flex flex-col select-none group leading-none">
      <div className="flex items-baseline tracking-[-0.04em] font-extrabold">
        {/* 'Smart' in precision obsidian / luxury typography */}
        <span
          className={`${sizeConfig.text} ${smartColor} transition-colors duration-200 group-hover:opacity-95 font-sans`}
          style={{ letterSpacing: '-0.045em' }}
        >
          Smart
        </span>

        {/* 'Banao' in rich forest emerald */}
        <span
          className={`${sizeConfig.text} ${banaoColor} transition-colors duration-200 ml-[1px] font-sans`}
          style={{ letterSpacing: '-0.045em' }}
        >
          Banao
        </span>

        {/* Ultra-chic distinctive iOS Luxury Period */}
        <span
          className={`${sizeConfig.dot} rounded-full ${dotColor} ml-0.5 mb-0.5 inline-block shrink-0 transition-transform duration-300 group-hover:scale-125`}
        />
      </div>

      {showTagline && (
        <span
          className={`${sizeConfig.tagline} tracking-widest uppercase font-mono font-bold mt-1.5 ${taglineColor}`}
        >
          Learn Smart · Create More
        </span>
      )}
    </div>
  );
};
