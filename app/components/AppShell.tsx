'use client';

import { useState, useEffect, memo } from 'react';
import { Sidebar } from './Sidebar';
import { MenuButton } from './MenuButton';

export const AppShell = memo(({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  return (
    <>
      {/* 固定背景层 - 所有页面共享，不会重新加载 */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">
        <img
          src="https://loliapi.com/acg/"
          alt="background"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="eager"
          onLoad={() => setBgLoaded(true)}
        />
      </div>

      {/* 菜单按钮 */}
      <MenuButton onClick={() => setIsSidebarOpen(true)} />

      {/* 侧边栏 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 页面内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
});
AppShell.displayName = 'AppShell';
