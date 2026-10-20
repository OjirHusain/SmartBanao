import React from 'react';

interface PromoBannerProps {
  text?: string;
  onExploreBundles?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  text = 'A little more progress, for a little less. One-time purchases · No subscriptions',
  onExploreBundles,
}) => {
  return (
    <aside aria-label="Announcement" className="bg-[#193225] text-[#b9cebe] text-xs py-2 px-4 text-center border-b border-[#213f30]">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 text-[11px] sm:text-xs tracking-tight font-medium">
        <span>A little more progress, for a little less.</span>
        <button
          onClick={onExploreBundles}
          className="font-bold text-white hover:underline focus-visible:outline-none"
        >
          One-time purchases · No subscriptions
        </button>
      </div>
    </aside>
  );
};
