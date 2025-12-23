'use client';

import { memo } from 'react';

const ICON_PATHS: Record<string, React.ReactElement> = {
  menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>,
};

const Icon = memo(({ name, className = "w-6 h-6" }: { name: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">{ICON_PATHS[name]}</svg>
));
Icon.displayName = 'Icon';

const haptic = (duration: number = 15) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

interface MenuButtonProps {
  onClick: () => void;
}

export const MenuButton = memo(({ onClick }: MenuButtonProps) => {
  const handleClick = () => {
    haptic(20);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 left-4 z-40 p-2.5 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full shadow-lg text-white/90 hover:bg-black/50 active:scale-95 transition-all touch-manipulation"
      aria-label="打开菜单"
    >
      <Icon name="menu" className="w-5 h-5" />
    </button>
  );
});
MenuButton.displayName = 'MenuButton';
