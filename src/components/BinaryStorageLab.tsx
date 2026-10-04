import React, { useState } from 'react';
import { TextModule } from './TextModule';
import { ImageModule } from './ImageModule';
import { AudioModule } from './AudioModule';
import { VideoModule } from './VideoModule';
import { IntegerModule } from './IntegerModule';
import { 
  FileText, 
  Image as ImageIcon, 
  Volume2, 
  Video, 
  Binary,
  BookOpen
} from 'lucide-react';

export const BinaryStorageLab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'text' | 'images' | 'audio' | 'video' | 'integers'>('text');

  return (
    <div className="space-y-6">
      {/* Category selector pills */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Data Type:
          </span>
          <button
            onClick={() => setActiveCategory('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'text'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Characters & Strings (ASCII/UTF-8)</span>
          </button>
          <button
            onClick={() => setActiveCategory('images')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'images'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Bitmap Images & Pixels</span>
          </button>
          <button
            onClick={() => setActiveCategory('audio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'audio'
                ? 'bg-sky-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio Sampling & ADC</span>
          </button>
          <button
            onClick={() => setActiveCategory('video')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'video'
                ? 'bg-purple-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video & Compression</span>
          </button>
          <button
            onClick={() => setActiveCategory('integers')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'integers'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Integer Storage & 2's Comp</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Topic A1.2.2 Complete</span>
        </div>
      </div>

      {/* Render Active Category */}
      {activeCategory === 'text' && <TextModule />}
      {activeCategory === 'images' && <ImageModule />}
      {activeCategory === 'audio' && <AudioModule />}
      {activeCategory === 'video' && <VideoModule />}
      {activeCategory === 'integers' && <IntegerModule />}
    </div>
  );
};
