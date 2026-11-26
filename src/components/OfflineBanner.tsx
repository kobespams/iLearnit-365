import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Gauge } from 'lucide-react';
import { getLowDataMode, setLowDataMode, getOfflinePacks } from '../services/offlineCacheService';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lowData, setLowData] = useState<boolean>(() => getLowDataMode());
  const [packCount, setPackCount] = useState<number>(() => getOfflinePacks().length);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    const onPacksUpdate = () => setPackCount(getOfflinePacks().length);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('ilearnit:offline_packs_updated', onPacksUpdate);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('ilearnit:offline_packs_updated', onPacksUpdate);
    };
  }, []);

  const toggleLowData = () => {
    const next = !lowData;
    setLowData(next);
    setLowDataMode(next);
  };

  return (
    <div className="bg-[#0B1D3A] text-slate-100 border-b border-blue-900/60 px-4 py-1.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>
                Connected {packCount > 0 ? `· ${packCount} offline pack${packCount === 1 ? '' : 's'} cached` : '· 3G-Optimized Lazy Loading Active'}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span className="font-semibold text-amber-200">
                Offline Mode — Saved JAMB schemes &amp; cached drills remain available ({packCount} pack{packCount === 1 ? '' : 's'}).
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggleLowData}
          aria-pressed={lowData}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
            lowData
              ? 'bg-amber-400 text-[#0B1D3A] border-amber-300'
              : 'bg-white/10 text-slate-100 border-white/25 hover:bg-white/20'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{lowData ? '3G Data Saver: ON' : '3G Data Saver'}</span>
        </button>
      </div>
    </div>
  );
};
