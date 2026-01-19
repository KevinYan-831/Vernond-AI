/**
 * Sound effects for the magic analyzer experience.
 * Uses Web Audio API to generate procedural sounds without audio files.
 */
class SoundEffects {
  private audioContext: AudioContext | null = null;
  private isAudioEnabled = true;

  /**
   * Gets or creates the AudioContext instance.
   * Returns null if audio is not available in the current environment.
   */
  private getAudioContext(): AudioContext | null {
    if (!this.isAudioEnabled) return null;

    if (!this.audioContext) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) {
          console.warn('Web Audio API is not supported in this browser');
          this.isAudioEnabled = false;
          return null;
        }
        this.audioContext = new AudioContextClass();
      } catch (error) {
        console.warn('Failed to create AudioContext:', error);
        this.isAudioEnabled = false;
        return null;
      }
    }

    // Resume the context if it's suspended (required for user interaction in some browsers)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {
        // Silently fail - audio will work after user interaction
      });
    }

    return this.audioContext;
  }

  /** Plays a countdown tick sound (880 Hz sine wave) */
  playTick(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  /** Plays a camera shutter sound (frequency sweep from 1200 Hz to 100 Hz) */
  playShutter(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  /** Plays an applause sound for "fooled" verdict (bandpassed white noise) */
  playApplause(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Create white noise for applause effect
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1000;
    bandpass.Q.value = 0.5;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1.5);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

    whiteNoise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(ctx.currentTime);
    whiteNoise.stop(ctx.currentTime + 2);
  }

  /** Plays a magical sparkle sound for particles (rising frequency sweep) */
  playSparkle(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  /** Plays a whoosh sound for transitions (highpass filtered noise) */
  playWhoosh(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 500;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    whiteNoise.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(ctx.currentTime);
    whiteNoise.stop(ctx.currentTime + 0.5);
  }

  /** Plays an ominous low drone for "caught" verdict (sawtooth wave) */
  playOminousDrone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(110, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1);
  }

  /** Plays a flash sound effect (descending frequency sweep) */
  playFlash(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(3000, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }
}

export const soundEffects = new SoundEffects();
