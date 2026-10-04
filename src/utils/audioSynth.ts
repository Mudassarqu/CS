// Web Audio API synthesizer for demonstration of audio sampling rate & bit depth

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSampledSound(effectiveSampleRate: number, bitDepth: number, durationSec: number = 1.2) {
  try {
    const ctx = getAudioContext();
    const nativeSampleRate = ctx.sampleRate;
    const length = Math.floor(nativeSampleRate * durationSec);
    const audioBuffer = ctx.createBuffer(1, length, nativeSampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // Number of quantization steps
    const numLevels = Math.pow(2, bitDepth);
    const stepSize = 2 / numLevels;

    // Decimation factor for downsampling
    const decimation = Math.max(1, Math.round(nativeSampleRate / effectiveSampleRate));

    let heldSample = 0;
    const toneFreq = 440; // A4 musical note

    for (let i = 0; i < length; i++) {
      if (i % decimation === 0) {
        const t = i / nativeSampleRate;
        // Pure smooth sine wave + slight harmonics
        const rawWave = 0.8 * Math.sin(2 * Math.PI * toneFreq * t) + 0.2 * Math.sin(2 * Math.PI * (toneFreq * 2) * t);

        // Quantize amplitude to bit depth steps
        const quantized = Math.round(rawWave / stepSize) * stepSize;
        heldSample = Math.max(-1, Math.min(1, quantized));
      }
      channelData[i] = heldSample;
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start();
  } catch (err) {
    console.warn('Audio playback not supported or user blocked audio context', err);
  }
}
