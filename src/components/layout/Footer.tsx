'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

const Footer: React.FC = () => {
  const [ping, setPing] = useState<number>(0);
  const [serverPing, setServerPing] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const [time, setTime] = useState<string>('');
  const [discord, setDiscord] = useState({ total: 0, online: 0 });
  const pingSamples = useRef<number[]>([]);
  const serverSamples = useRef<number[]>([]);
  const pingInFlight = useRef(false);

  const defaultVolume = 0.005;
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const parseServerTiming = (value: string | null) => {
      if (!value) return null;
      const match = value.match(/dur=([\d.]+)/);
      if (!match) return null;
      const parsed = Number(match[1]);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const pushAverage = (store: React.MutableRefObject<number[]>, value: number) => {
      const list = store.current;
      list.push(value);
      if (list.length > 5) list.shift();
      return Math.round(list.reduce((sum, v) => sum + v, 0) / list.length);
    };

    const checkPing = async () => {
      if (document.visibilityState !== 'visible') return;
      if (pingInFlight.current) return;
      pingInFlight.current = true;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 1500);
      const start = performance.now();
      try {
        const response = await fetch(`/api/ping?t=${Date.now()}`, { method: 'HEAD', cache: 'no-store', signal: controller.signal });
        const total = Math.round(performance.now() - start);
        const serverTiming = parseServerTiming(response.headers.get('server-timing'));
        const serverValue = serverTiming !== null ? Math.round(serverTiming) : 0;
        const averageTotal = pushAverage(pingSamples, total);
        const averageServer = serverTiming !== null ? pushAverage(serverSamples, serverValue) : 0;
        setPing(averageTotal);
        setServerPing(averageServer);
      } catch (e) {
        pingSamples.current = [];
        serverSamples.current = [];
        setPing(0);
        setServerPing(0);
      } finally {
        window.clearTimeout(timeout);
        pingInFlight.current = false;
      }
    };

    const fetchDiscord = async () => {
      try {
        const res = await fetch('/api/discord/stats');
        const data = await res.json();
        setDiscord(data);
      } catch (e) { console.error(e); }
    };

    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    const interval = setInterval(() => { checkPing(); updateClock(); }, 3000);
    const discordInterval = setInterval(fetchDiscord, 30000);

    checkPing(); updateClock(); fetchDiscord();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkPing();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      clearInterval(interval);
      clearInterval(discordInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const broadcastVolume = (vol: number, mute: boolean) => {
    const event = new CustomEvent('update-bg-music', {
      detail: { volume: vol, isMuted: mute }
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    if (mounted) {
      broadcastVolume(volume, isMuted);
    }
  }, [mounted, volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val <= 0);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (!nextMute && volume === 0) setVolume(defaultVolume);
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full z-[90] border-t border-white/5 bg-black/80 backdrop-blur-lg font-mono select-none">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 text-[9px] tracking-[0.3em] uppercase text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="border border-green-500/40 bg-green-500/10 px-2 py-1 text-green-300">Online</span>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40">Ping</span>
            <span className={`font-bold ${ping > 150 ? 'text-red-400' : 'text-purple-300'}`}>
              {ping.toString().padStart(3, '0')}ms
            </span>
            <span className="text-white/40">Srv</span>
            <span className={`font-bold ${serverPing > 80 ? 'text-red-400' : 'text-purple-300'}`}>
              {serverPing.toString().padStart(3, '0')}ms
            </span>
          </div>
          <span className="text-white/40">Crew</span>
          <span className="text-white/80">{discord.total}</span>
          <span className="text-white/40">Active</span>
          <span className="text-green-300">{discord.online}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-2 py-1">
            <button onClick={toggleMute} className="text-purple-300 hover:text-white transition-colors">
              {(isMuted || volume <= 0) ? <VolumeX size={14} /> : volume < 0.2 ? <Volume1 size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range" min="0" max="0.5" step="0.005"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-[2px] bg-white/10 appearance-none cursor-pointer accent-purple-500"
              style={{ background: `linear-gradient(to right, #a855f7 ${((isMuted ? 0 : volume) / 0.5) * 100}%, #1f2937 0%)` }}
            />
            <span className="text-[8px] font-bold text-purple-300/70 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 200)}%
            </span>
          </div>
          <span className="font-black text-white">{time}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
