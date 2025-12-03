import React, { useState } from 'react';
import { TreeMode } from '../types';
import { FONT_LUXURY, FONT_TITLE, NEEDLE_COUNT, ORNAMENT_COUNT } from '../constants';
import { Wind, Box, Sparkles, Wand2, X } from 'lucide-react';
import { generateLuxuryWish } from '../services/geminiService';

interface UIProps {
  mode: TreeMode;
  setMode: (mode: TreeMode) => void;
}

export const UI: React.FC<UIProps> = ({ mode, setMode }) => {
  const [wish, setWish] = useState<string | null>(null);
  const [loadingWish, setLoadingWish] = useState(false);

  const toggleMode = () => {
    setMode(mode === TreeMode.ASSEMBLED ? TreeMode.DISPERSED : TreeMode.ASSEMBLED);
  };

  const handleWish = async () => {
    setLoadingWish(true);
    const newWish = await generateLuxuryWish();
    setWish(newWish);
    setLoadingWish(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-20 text-white select-none">
      
      {/* Top Bar / Brand */}
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto">
             <h1 className={`${FONT_TITLE} text-3xl md:text-5xl text-yellow-500 tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] border-b-2 border-yellow-600/30 pb-2`}>
              TRUMP
              <span className="text-white text-sm md:text-lg block tracking-[0.4em] mt-2 font-light opacity-90 font-serif">
                CHRISTMAS COLLECTION
              </span>
            </h1>
        </div>
        
        {/* Wish Button */}
        <button 
          onClick={handleWish}
          disabled={loadingWish}
          className={`pointer-events-auto group relative overflow-hidden bg-black/60 backdrop-blur-md border border-yellow-600/50 px-8 py-4 rounded-sm transition-all duration-500 hover:bg-yellow-900/30 hover:border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)]`}
        >
          <div className="flex items-center gap-3">
             <Wand2 className={`w-5 h-5 ${loadingWish ? 'animate-spin text-yellow-200' : 'text-yellow-500'}`} />
             <span className={`${FONT_TITLE} text-yellow-100 tracking-widest text-xs md:text-sm font-bold`}>
               {loadingWish ? 'CONJURING OPULENCE...' : 'MAKE A LUXURY WISH'}
             </span>
          </div>
          {/* Shine effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700" />
        </button>
      </div>

      {/* Wish Modal Overlay */}
      {wish && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 pointer-events-auto transition-opacity duration-700">
           <div className="max-w-3xl text-center p-16 border-y border-yellow-500/40 bg-gradient-to-b from-black via-emerald-950/20 to-black relative shadow-2xl">
              <button 
                onClick={() => setWish(null)}
                className="absolute top-6 right-6 text-yellow-700 hover:text-yellow-400 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-8 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              <p className={`${FONT_LUXURY} text-3xl md:text-5xl leading-tight text-yellow-100 drop-shadow-lg italic`}>
                "{wish}"
              </p>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-10 opacity-70"></div>
           </div>
        </div>
      )}

      {/* Bottom Interface */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        
        {/* Stats Panel (Bottom Left) */}
        <div className="space-y-6 text-left pointer-events-auto">
          <div className="group">
             <h3 className={`${FONT_TITLE} text-red-700 text-[10px] font-bold tracking-[0.3em] mb-1 group-hover:text-red-500 transition-colors`}>ORNAMENTS</h3>
             <p className={`${FONT_LUXURY} text-white/90 text-2xl border-l-2 border-red-900 pl-3`}>
               {ORNAMENT_COUNT.toLocaleString()}+ <span className="text-white/40 text-xs tracking-widest ml-1 font-sans">ITEMS</span>
             </p>
          </div>
          <div className="group">
             <h3 className={`${FONT_TITLE} text-emerald-700 text-[10px] font-bold tracking-[0.3em] mb-1 group-hover:text-emerald-500 transition-colors`}>FOLIAGE</h3>
             <p className={`${FONT_LUXURY} text-white/90 text-2xl border-l-2 border-emerald-900 pl-3`}>
               {Math.floor(NEEDLE_COUNT / 1000)}K <span className="text-emerald-600 text-xs tracking-widest ml-1 font-sans">EMERALD NEEDLES</span>
             </p>
          </div>
        </div>

        {/* Disperse Button (Bottom Right) */}
        <button 
          onClick={toggleMode}
          className="pointer-events-auto group flex items-center gap-6 pl-10 pr-8 py-5 bg-black/90 border border-white/10 border-l-4 border-l-yellow-600 hover:bg-emerald-950/80 transition-all duration-300 shadow-2xl"
        >
           <span className={`${FONT_TITLE} text-yellow-500 tracking-[0.25em] text-xl font-bold`}>
             {mode === TreeMode.ASSEMBLED ? 'DISPERSE' : 'ASSEMBLE'}
           </span>
           <div className="p-2 border border-white/20 rounded-full group-hover:border-yellow-500/50 transition-colors">
            {mode === TreeMode.ASSEMBLED ? (
                <Wind className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
            ) : (
                <Box className="w-5 h-5 text-white/70 group-hover:text-white group-hover:scale-110 transition-all" />
            )}
           </div>
        </button>

      </div>
    </div>
  );
};