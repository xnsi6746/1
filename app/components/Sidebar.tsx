'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ICON_PATHS: Record<string, React.ReactElement> = {
  home: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>,
  mail: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>,
  close: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>,
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

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { path: '/', label: '身份生成器', icon: 'home' },
  { path: '/mail', label: '临时邮箱大全', icon: 'mail' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = memo(({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLinkClick = () => {
    haptic(20);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 侧边栏 */}
      <div
        className="relative w-[280px] bg-black/40 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-2xl"
        style={{
          animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform'
        }}
      >
        {/* 头部 */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-white tracking-tight drop-shadow-md">
              菜单
            </h2>
            <button
              onClick={() => { haptic(20); onClose(); }}
              className="bg-white/10 p-2 rounded-full text-white/60 hover:bg-white/20 active:scale-95 transition-all touch-manipulation"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 菜单列表 */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/80 active:bg-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                  <Icon name={item.icon} className="w-5 h-5" />
                </div>
                <span className="text-[16px] font-medium tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* 底部信息 */}
        <div className="p-6 border-t border-white/10">
          <a
            href="https://t.me/fang180"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 rounded-xl text-white/80 hover:bg-white/20 transition-all active:scale-95 touch-manipulation"
          >
            <span className="text-[14px] font-medium">@fang180</span>
          </a>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';
