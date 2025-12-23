'use client';

import { useState, useEffect, memo } from 'react';

// 图标组件
const ICON_PATHS: Record<string, React.ReactElement> = {
  mail: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>,
  check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
  open: <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>,
  sparkles: <path d="M7 11v2l-4 1 4 1v2l1-4-1-4zm5-7v4l-3 1 3 1v4l2-5-2-5zm5.66 2.94L15 6.26l.66-2.94L18.34 6l2.66.68-2.66.68-.68 2.58-.66-2.94zM15 18l-2-3 2-3 2 3-2 3z"/>,
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

interface TempMailSite {
  id: string;
  name: string;
  url: string;
  description: string;
  features: string[];
}

const SiteCard = memo(({ site }: { site: TempMailSite }) => {
  const handleClick = () => {
    haptic(30);
    window.open(site.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      className="bg-black/30 backdrop-blur-sm rounded-[20px] overflow-hidden border border-white/20 shadow-xl cursor-pointer transition-all duration-200 active:scale-[0.98] touch-manipulation hover:bg-black/40"
    >
      <div className="p-5 space-y-3">
        {/* 头部 */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-[#007AFF]/20 to-[#0055b3]/20 p-3 rounded-xl shrink-0">
              <Icon name="mail" className="w-6 h-6 text-[#409CFF]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[18px] font-bold text-white tracking-tight truncate drop-shadow-md">
                {site.name}
              </h3>
            </div>
          </div>
          <div className="shrink-0 p-2 bg-white/10 rounded-full">
            <Icon name="open" className="w-4 h-4 text-white/60" />
          </div>
        </div>

        {/* 描述 */}
        {site.description && (
          <p className="text-[14px] text-white/70 leading-relaxed line-clamp-2 drop-shadow-sm">
            {site.description}
          </p>
        )}

        {/* 特性标签 */}
        {site.features && site.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {site.features.slice(0, 4).map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg text-[12px] text-white/80 font-medium"
              >
                <Icon name="check" className="w-3 h-3 text-[#34C759]" />
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
SiteCard.displayName = 'SiteCard';

export default function TempMailPage() {
  const [sites, setSites] = useState<TempMailSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch('/api/temp-mail-sites');
        if (!response.ok) throw new Error('Failed to fetch sites');
        const data = await response.json();
        setSites(data);
      } catch (err) {
        setError('加载失败，请稍后重试');
        console.error('Failed to fetch temp mail sites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, []);

  return (
    <div className="min-h-screen relative font-sans text-white pb-10 selection:bg-blue-400/30">
      <main className="max-w-[800px] mx-auto px-5 pt-24 pb-10 space-y-6">

        {/* 页面标题 */}
        <section className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="bg-gradient-to-br from-[#007AFF]/30 to-[#0055b3]/30 p-3 rounded-2xl">
              <Icon name="mail" className="w-8 h-8 text-[#409CFF]" />
            </div>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            临时邮箱大全
          </h1>
          <p className="text-[15px] text-white/70 max-w-md mx-auto leading-relaxed drop-shadow-md">
            收录优质临时邮箱服务，无需注册，保护隐私
          </p>
        </section>

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-[3px] border-white/20 border-t-[#007AFF] rounded-full animate-spin drop-shadow-lg" />
            <p className="text-white/60 text-sm">加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-[20px] p-6 text-center">
            <p className="text-white/90">{error}</p>
          </div>
        )}

        {/* 站点列表 */}
        {!isLoading && !error && sites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && !error && sites.length === 0 && (
          <div className="bg-black/30 backdrop-blur-sm rounded-[20px] border border-white/20 p-12 text-center">
            <Icon name="mail" className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60">暂无数据</p>
          </div>
        )}

        {/* 页脚说明 */}
        <section className="pt-8 text-center space-y-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-[20px] border border-white/20 p-6">
            <div className="flex items-start gap-3 text-left">
              <div className="shrink-0 mt-0.5">
                <Icon name="sparkles" className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[16px] font-semibold text-white tracking-tight">
                  使用提示
                </h3>
                <ul className="text-[14px] text-white/70 space-y-1.5 leading-relaxed">
                  <li>• 临时邮箱适用于临时注册、测试等场景</li>
                  <li>• 不要用于接收重要或敏感信息</li>
                  <li>• 邮件通常会在一段时间后自动删除</li>
                  <li>• 部分网站可能会屏蔽临时邮箱域名</li>
                </ul>
              </div>
            </div>
          </div>

          <a
            href="https://t.me/fang180"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-3 px-6 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-[14px] text-[#409CFF] hover:text-[#60aeff] font-bold transition-all active:scale-95 shadow-lg touch-manipulation"
          >
            推荐更多站点 @fang180
          </a>

          <p className="text-[12px] text-white/80 font-medium tracking-tight drop-shadow-md">
            收录 {sites.length} 个临时邮箱服务
          </p>
        </section>
      </main>
    </div>
  );
}
