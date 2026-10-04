import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Layers, 
  Sparkles, 
  Cpu, 
  Calculator, 
  FileVideo,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const VideoModule: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(24);
  const [viewMode, setViewMode] = useState<'raw' | 'temporal' | 'yuv'>('raw');

  // Calculator state (Textbook Review Question 4 p. 47)
  const [videoDurationMin, setVideoDurationMin] = useState<number>(10);
  const [videoFps, setVideoFps] = useState<number>(30);
  const [videoWidth, setVideoWidth] = useState<number>(1920);
  const [videoHeight, setVideoHeight] = useState<number>(1080);
  const [compressionRatio, setCompressionRatio] = useState<number>(98); // 98% reduction typical for MP4

  const totalFramesCount = 8;

  // Frame animation loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = Math.round(1000 / fps);
      timer = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFramesCount);
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, fps]);

  // Calculations for textbook scenario (10 min, 30fps, 1080p, 24-bit uncompressed)
  const durationSec = videoDurationMin * 60;
  const totalFrames = durationSec * videoFps;
  const bitsPerFrame = videoWidth * videoHeight * 24;
  const bytesPerFrame = bitsPerFrame / 8;
  const totalUncompressedBytes = totalFrames * bytesPerFrame;
  const totalUncompressedGB = totalUncompressedBytes / (1000 * 1000 * 1000); // 111.97 GB
  const totalCompressedBytes = totalUncompressedBytes * (1 - compressionRatio / 100);
  const totalCompressedMB = totalCompressedBytes / (1000 * 1000);

  // Position of moving object in each frame (0 to 7)
  const objectPositions = [
    { x: 30, y: 55, changed: false },
    { x: 75, y: 50, changed: true },
    { x: 125, y: 45, changed: true },
    { x: 180, y: 42, changed: true },
    { x: 235, y: 45, changed: true },
    { x: 285, y: 50, changed: true },
    { x: 330, y: 55, changed: true },
    { x: 370, y: 60, changed: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                Textbook p. 46–47
              </span>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">A1.2.2 Representation of Video</span>
            </div>
            <h3 className="text-lg font-bold text-white">Digital Video: Frames, YUV & Compression</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Video is stored as a sequence of still bitmap images ("frames") displayed at 24 to 60 fps to create the illusion of motion (flipbook analogy). 
              Because uncompressed video consumes tens of gigabytes in minutes, <strong>Spatial (intraframe)</strong> and <strong>Temporal (interframe)</strong> compression are vital.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'raw' ? 'bg-purple-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Frame
            </button>
            <button
              onClick={() => setViewMode('temporal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'temporal' ? 'bg-purple-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Temporal Delta
            </button>
            <button
              onClick={() => setViewMode('yuv')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'yuv' ? 'bg-purple-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              YUV Color Model
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Frame Sequencer / Flipbook Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-purple-400" />
                Interactive Frame Sequencer (Flipbook Analogy)
              </h4>
              <p className="text-xs text-slate-400">Step through frames or play at 24/30/60 fps to observe persistence of motion.</p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-purple-300">
              Frame {currentFrame + 1} / {totalFramesCount}
            </span>
          </div>

          {/* Video Player Display Screen */}
          <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            {/* Background elements (static scenery: mountains, trees, clouds) */}
            <div className={`absolute inset-0 transition-opacity ${viewMode === 'temporal' ? 'opacity-20' : 'opacity-100'}`}>
              {/* Sky and sun */}
              <div className="absolute top-4 right-8 w-10 h-10 rounded-full bg-amber-400/80 blur-xs shadow-lg shadow-amber-400/20" />
              {/* Static mountains */}
              <svg className="absolute bottom-10 left-0 w-full h-28 text-slate-800/80" preserveAspectRatio="none" viewBox="0 0 400 100">
                <polygon points="0,100 80,30 160,100" fill="currentColor" />
                <polygon points="120,100 220,15 310,100" fill="#1e1b4b" />
                <polygon points="260,100 340,40 400,100" fill="currentColor" />
              </svg>
              {/* Static ground */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-900 border-t border-slate-800" />
            </div>

            {/* View Mode Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                viewMode === 'raw' 
                  ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' 
                  : viewMode === 'temporal'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                {viewMode === 'raw' ? 'Full Uncompressed Frame' : viewMode === 'temporal' ? 'Interframe Temporal Delta (Motion Only)' : 'YUV Luminance (Y) Plane'}
              </span>

              <span className="text-[10px] text-slate-400 font-mono">
                PTS: {(currentFrame * (1 / fps)).toFixed(3)}s
              </span>
            </div>

            {/* Dynamic moving object (e.g. Drone / Bird in flight) */}
            <div 
              className="absolute z-10 transition-all duration-75 flex flex-col items-center"
              style={{
                left: `${(objectPositions[currentFrame].x / 400) * 80 + 5}%`,
                top: `${objectPositions[currentFrame].y}%`
              }}
            >
              {viewMode === 'temporal' && (
                <div className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-mono font-bold mb-1 shadow animate-pulse">
                  Δ Motion Vector (+{(objectPositions[currentFrame].x - (currentFrame > 0 ? objectPositions[currentFrame - 1].x : 0))}px)
                </div>
              )}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                viewMode === 'yuv' 
                  ? 'bg-slate-300 text-slate-950 font-bold text-[10px]' 
                  : 'bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs'
              }`}>
                ●
              </div>
            </div>

            {/* Bottom info banner */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded backdrop-blur-sm">
              <span>Resolution: 1920×1080 (HD)</span>
              <span>{viewMode === 'temporal' ? 'Static background bits discarded (0 bytes)' : 'Raw RGB: 6.22 MB per frame'}</span>
            </div>
          </div>

          {/* Playback Controls & Frame Scrubber */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentFrame((prev) => (prev - 1 + totalFramesCount) % totalFramesCount)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Previous Frame"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow transition-all ${
                  isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
              </button>
              <button
                onClick={() => setCurrentFrame((prev) => (prev + 1) % totalFramesCount)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Next Frame"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FPS Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Frame Rate:</span>
              {[24, 30, 60].map(val => (
                <button
                  key={val}
                  onClick={() => setFps(val)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                    fps === val ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {val} fps
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spatial vs Temporal Explanation (Hodder p. 46-47) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Video Compression Core Principles (Textbook p. 47)
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300">Spatial Compression (Intraframe):</span>
                <p className="text-slate-400 text-[11px] mt-1">
                  Reduces redundant information <em>within a single frame</em> (e.g. compressing broad blue skies or repetitive textures using Discrete Cosine Transform, similar to JPEG).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-300">Temporal Compression (Interframe):</span>
                <p className="text-slate-400 text-[11px] mt-1">
                  Predicts frame content based on preceding frames, <strong>only storing the differences and motion vectors</strong>. Static backgrounds don't need to be resent every 1/30th of a second!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-300">YUV Color Subsampling:</span>
                <p className="text-slate-400 text-[11px] mt-1">
                  Converts RGB into <strong>Y</strong> (Luminance / Brightness) and <strong>UV</strong> (Chrominance / Colour). Human vision is far more sensitive to brightness than color details, allowing safe compression of UV data without noticeable loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Textbook Calculation Walkthrough (Review Question 4 p. 47) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-purple-400" />
            IB Exam Calculation: 10-Minute 1080p Video Storage (Textbook Review Question 4)
          </h4>
          <p className="text-xs text-slate-400">
            "Calculate the total storage needed for a 10-minute video with a frame rate of 30 fps, using 24-bit colour depth and a resolution of 1920×1080. Assume no compression."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
            <div>1. Total Seconds = {videoDurationMin} min × 60 = <span className="text-cyan-300 font-bold">{durationSec} s</span></div>
            <div>2. Total Frames = {durationSec} s × {videoFps} fps = <span className="text-purple-300 font-bold">{totalFrames.toLocaleString()} frames</span></div>
            <div>3. Bits per Frame = 1920 × 1080 × 24 = <span className="text-white font-bold">{bitsPerFrame.toLocaleString()} bits</span></div>
            <div>4. Bytes per Frame = {bitsPerFrame.toLocaleString()} ÷ 8 = <span className="text-amber-300 font-bold">{bytesPerFrame.toLocaleString()} bytes</span> (~6.22 MB/frame)</div>
            <div className="border-t border-slate-800 pt-2 text-slate-200">
              Total Uncompressed Size:
              <br />
              {totalFrames.toLocaleString()} × {bytesPerFrame.toLocaleString()} = <span className="text-rose-400 font-bold text-sm">{totalUncompressedGB.toFixed(2)} GB</span>!
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-800/40 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Typical MP4 Video Compression:</span>
              <span className="font-mono text-emerald-400 font-bold">{compressionRatio}% reduction</span>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              value={compressionRatio}
              onChange={(e) => setCompressionRatio(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-400">Resulting Compressed File Size:</div>
              <div className="text-emerald-300 font-bold text-base">
                ~{totalCompressedMB.toFixed(1)} MB (streaming friendly)
              </div>
              <p className="text-[11px] font-sans text-slate-400 pt-1">
                Without temporal and spatial compression, streaming Netflix or YouTube would instantly overwhelm global internet infrastructure!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
