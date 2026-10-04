import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Sparkles, 
  Info, 
  Layers, 
  Sliders, 
  Music,
  HelpCircle
} from 'lucide-react';
import { playSampledSound } from '../utils/audioSynth';

export const AudioModule: React.FC = () => {
  const [samplingRateHz, setSamplingRateHz] = useState<number>(16); // Visual sample points per cycle
  const [bitDepth, setBitDepth] = useState<number>(4); // 2^4 = 16 amplitude levels
  const [channels, setChannels] = useState<number>(2); // 2 = stereo, 1 = mono
  const [durationSec, setDurationSec] = useState<number>(60); // 1 minute
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const [showQuantizationLevels, setShowQuantizationLevels] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play audio synthesized with selected parameters
  const handlePlaySound = () => {
    setIsPlayingSound(true);
    // Map our display sampling rate (16) to audio domain frequency (e.g. 4000 to 44100 Hz)
    const audioSampleRate = Math.round((samplingRateHz / 32) * 22050 + 2000);
    playSampledSound(audioSampleRate, bitDepth, 1.2);
    setTimeout(() => {
      setIsPlayingSound(false);
    }, 1200);
  };

  // Draw analogue curve + digital samples on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const amplitude = height * 0.38;

    ctx.clearRect(0, 0, width, height);

    // Grid lines & time axis
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Quantization amplitude levels (grid horizontal lines)
    const numLevels = Math.pow(2, bitDepth);
    if (showQuantizationLevels && numLevels <= 64) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let i = 0; i <= numLevels; i++) {
        const y = centerY - amplitude + (i / numLevels) * (amplitude * 2);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 1. Draw continuous analogue signal (Smooth Blue Wave, Textbook p. 44)
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8'; // Sky blue
    ctx.lineWidth = 2.5;

    const cycles = 2; // Two full periods
    for (let x = 0; x <= width; x++) {
      const t = (x / width) * (Math.PI * 2 * cycles);
      const wave = Math.sin(t);
      const y = centerY - wave * amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Draw discrete samples (Red dots & stems, Textbook p. 44)
    const totalSamples = Math.round(samplingRateHz * cycles);
    const stepSizeAmp = (2 * amplitude) / numLevels;

    for (let s = 0; s <= totalSamples; s++) {
      const x = (s / totalSamples) * width;
      const t = (x / width) * (Math.PI * 2 * cycles);
      const continuousY = Math.sin(t) * amplitude;
      
      // Quantize to discrete bit levels
      const quantizedLevel = Math.round(continuousY / stepSizeAmp);
      const quantizedY = centerY - quantizedLevel * stepSizeAmp;

      // Vertical stem line
      ctx.beginPath();
      ctx.strokeStyle = '#f43f5e'; // Rose / red
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, quantizedY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sample point
      ctx.beginPath();
      ctx.arc(x, quantizedY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Staircase hold step to next sample
      if (s < totalSamples) {
        const nextX = ((s + 1) / totalSamples) * width;
        ctx.beginPath();
        ctx.strokeStyle = '#fb7185';
        ctx.lineWidth = 2;
        ctx.moveTo(x, quantizedY);
        ctx.lineTo(nextX, quantizedY);
        ctx.stroke();
      }
    }

  }, [samplingRateHz, bitDepth, showQuantizationLevels]);

  // Calculations for textbook scenario (44.1 kHz, 16-bit, stereo, 1 minute)
  const calcTextbookSec = 44100 * 16 * 2 * 1;
  const calcTextbookSecBytes = calcTextbookSec / 8;
  const calcTextbookMinBytes = calcTextbookSecBytes * 60;
  const calcTextbookMinMB = calcTextbookMinBytes / (1024 * 1024);

  // Dynamic calculation based on current sliders
  const currentTotalBits = (samplingRateHz * 1000) * bitDepth * channels * durationSec;
  const currentTotalBytes = currentTotalBits / 8;
  const currentTotalMB = currentTotalBytes / (1024 * 1024);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800">
                Textbook p. 44–46
              </span>
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">A1.2.2 Representation of Audio</span>
            </div>
            <h3 className="text-lg font-bold text-white">Analogue-to-Digital Conversion (ADC) & Sampling</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Sound in nature is a continuous analogue pressure wave. An ADC records discrete snapshots of wave amplitude at regular intervals (<strong>Sampling Rate in Hz</strong>) 
              and quantizes each measurement to a binary precision (<strong>Bit Depth</strong>).
            </p>
          </div>

          <button
            onClick={handlePlaySound}
            disabled={isPlayingSound}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
              isPlayingSound 
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 shadow-sky-500/20 active:scale-95'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingSound ? 'Synthesizing Tone...' : 'Hear Sampled Audio'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Waveform Display */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-sky-400" />
              Interactive Analogue Wave vs Digital Samples (Textbook Figure p. 44)
            </h4>
            <p className="text-xs text-slate-400">
              The <span className="text-sky-400 font-semibold">blue line</span> is the continuous analogue wave; the <span className="text-rose-400 font-semibold">red points and steps</span> are the digitized binary samples.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showQuantizationLevels} 
              onChange={(e) => setShowQuantizationLevels(e.target.checked)}
              className="accent-sky-500 rounded" 
            />
            <span>Show Quantization Levels (2^{bitDepth} = {Math.pow(2, bitDepth)})</span>
          </label>
        </div>

        {/* Canvas */}
        <div className="w-full bg-slate-950 rounded-xl p-2 border border-slate-800 shadow-inner flex justify-center">
          <canvas
            ref={canvasRef}
            width={850}
            height={260}
            className="w-full max-w-full h-auto rounded-lg"
          />
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Sampling rate */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Sampling Frequency (Rate):</span>
              <span className="font-mono text-sky-400 font-bold">{samplingRateHz} samples/cycle</span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              step="2"
              value={samplingRateHz}
              onChange={(e) => setSamplingRateHz(parseInt(e.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Low (Aliasing)</span>
              <span>CD Standard (44.1 kHz)</span>
            </div>
          </div>

          {/* Bit depth */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Resolution Bit Depth:</span>
              <span className="font-mono text-emerald-400 font-bold">{bitDepth} bits ({Math.pow(2, bitDepth)} levels)</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              value={bitDepth}
              onChange={(e) => setBitDepth(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>2-bit (4 levels)</span>
              <span>16-bit (65,536 levels)</span>
            </div>
          </div>

          {/* Channels & Preset */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Audio Channels:</span>
              <span className="font-mono text-cyan-400 font-bold">{channels === 2 ? 'Stereo (2 Channels)' : 'Mono (1 Channel)'}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setChannels(1)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                  channels === 1 ? 'bg-sky-500/20 border-sky-500 text-sky-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                Mono (×1)
              </button>
              <button
                onClick={() => setChannels(2)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                  channels === 2 ? 'bg-sky-500/20 border-sky-500 text-sky-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                Stereo (×2)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Textbook Calculation Walkthrough (Hodder p. 44 & Review Question 3 p. 45) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Textbook CD Audio Walkthrough */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Official Textbook Calculation (p. 44)</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "A single second of a 44.1 kHz, 16-bit stereo (two channels) audio has:"
          </p>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
            <div>• Sampling rate: <span className="text-sky-400 font-bold">44,100 samples / second</span></div>
            <div>• Sample bit depth: <span className="text-emerald-400 font-bold">16 bits / sample</span></div>
            <div>• Channels: <span className="text-purple-400 font-bold">2 (Stereo)</span></div>
            <div className="border-t border-slate-800 pt-2 text-slate-200">
              Per Second Storage:
              <br />
              44,100 × 16 × 2 = <span className="text-amber-400 font-bold">1,411,200 bits / second</span>
            </div>
            <div className="text-slate-200">
              = 1,411,200 ÷ 8 = <span className="text-cyan-400 font-bold">176,400 bytes / second</span>
            </div>
            <div className="border-t border-slate-800 pt-2 text-slate-200">
              <strong className="text-white">Review Question 3 (p. 45):</strong> Storage per minute (60 seconds):
              <br />
              176,400 × 60 = <span className="text-emerald-400 font-bold">10,584,000 bytes</span> (~10.09 MiB or 10.58 MB)
            </div>
          </div>
        </div>

        {/* Audio File Formats from Textbook p. 44–45 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Audio Formats: Uncompressed vs Compressed</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300 font-mono">WAV / AIFF</span>
                <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono">Uncompressed</span>
                <p className="text-slate-400 text-[11px] mt-1">Stores raw binary byte samples without compression. Studio recording standard.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-rose-300 font-mono">MP3 (MPEG Audio Layer III)</span>
                <span className="ml-2 px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-mono">Lossy</span>
                <p className="text-slate-400 text-[11px] mt-1">Permanently eliminates sound frequencies less perceptible to the human ear (psychoacoustics). ~90% size reduction.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-300 font-mono">FLAC (Free Lossless Audio Codec)</span>
                <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono">Lossless</span>
                <p className="text-slate-400 text-[11px] mt-1">Compresses audio mathematically without discarding any data. Can be restored bit-for-bit to original.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
