class AcousticGuitarSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.6;
  private isMuted: boolean = false;

  // Acoustic Guitar Chord Frequencies (G, C, D, Em fingerpicking notes in Hz)
  private chordProgressions = [
    // G Major chord arpeggio
    [196.00, 246.94, 293.66, 392.00, 493.88, 587.33],
    // C Major chord arpeggio
    [130.81, 261.63, 329.63, 392.00, 523.25, 659.25],
    // D Major chord arpeggio
    [146.83, 293.66, 369.99, 440.00, 587.33, 739.99],
    // E Minor chord arpeggio
    [164.81, 246.94, 329.63, 392.00, 493.88, 659.25]
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Pluck an acoustic guitar string using Karplus-Strong / filtered body resonance
  private pluckString(freq: number, delayOffset: number) {
    if (!this.ctx || !this.masterGain || !this.isPlaying || this.isMuted) return;

    const now = this.ctx.currentTime + delayOffset;

    // Oscillator imitating acoustic steel string pluck
    const osc = this.ctx.createOscillator();
    const bodyFilter = this.ctx.createBiquadFilter();
    const pluckGain = this.ctx.createGain();

    // Triangle waveform for warm acoustic wood body tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle pitch bend at pluck attack for realistic string tension dynamics
    osc.frequency.setValueAtTime(freq * 1.015, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.04);

    // Warm Lowpass Filter (simulates acoustic guitar wood resonance)
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(freq * 4, now);
    bodyFilter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 1.2);
    bodyFilter.Q.setValueAtTime(3, now);

    // Pluck Envelope: sharp attack, warm exponential decay
    pluckGain.gain.setValueAtTime(0.001, now);
    pluckGain.gain.linearRampToValueAtTime(0.25, now + 0.015);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(bodyFilter);
    bodyFilter.connect(pluckGain);
    pluckGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.3);
  }

  public play() {
    this.initCtx();
    if (this.isPlaying) return;
    this.isPlaying = true;

    let progressionIndex = 0;
    let patternStep = 0;

    const scheduleFingerpicking = () => {
      if (!this.isPlaying) return;

      const chord = this.chordProgressions[progressionIndex];
      // Travis picking / arpeggio pattern
      const noteIndex = [0, 2, 1, 3, 4, 2, 5, 3][patternStep % 8];
      const freq = chord[noteIndex % chord.length];

      this.pluckString(freq, 0);

      patternStep++;
      if (patternStep % 8 === 0) {
        progressionIndex = (progressionIndex + 1) % this.chordProgressions.length;
      }

      // Timing between plucks (gentle acoustic pace ~320ms)
      this.timerId = window.setTimeout(scheduleFingerpicking, 320);
    };

    scheduleFingerpicking();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = val;
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const guitarSynth = new AcousticGuitarSynthEngine();
