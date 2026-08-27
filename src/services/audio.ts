// Web Audio API procedural sound engine & foley effects
// 100% offline, zero external dependencies, realistic noir audio design!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rainGain: GainNode | null = null;
  private rainNoiseNode: AudioBufferSourceNode | null = null;
  private isRainPlaying: boolean = false;
  private isJazzPlaying: boolean = false;
  private deckA: HTMLAudioElement | null = null;
  private deckB: HTMLAudioElement | null = null;
  private activeDeck: 'A' | 'B' = 'A';
  private isCrossfading: boolean = false;
  private crossfadeTimer: number | null = null;
  private targetMusicVolume: number = 0.22;
  private crossfadeLeadTime: number = 2.2; // Starts cross-fading 2.2 seconds before track ends

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Pushpin Thud Sound
  playPin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Paper Rustle / Page Turn Sound
  playPaper() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  // Scissors Cut Snip
  playCutString() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playScissors() {
    this.playCutString();
  }

  playLightSwitch() {
    this.playSwitch();
  }

  playRadioStatic() {
    this.playDispatch();
  }

  stopPhoneRing() {
    // Phone ring stops naturally after timeout or when answered
  }

  playGavel() {
    this.playPin();
  }

  // Cassette Deck Mechanical Button Click
  playTapeClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Vintage Phone Ring (440Hz + 480Hz US Bell Standard)
  playPhoneRing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(480, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 1.2);
    osc2.stop(this.ctx.currentTime + 1.2);
  }

  // Police Radio / Dispatch Squelch
  playDispatch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Tension Heartbeat Sound
  playHeartbeat() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Eureka / Contradiction Discovered Chord
  playEureka() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [220, 277.18, 329.63, 440, 554.37];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + idx * 0.04 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.04);
      osc.stop(this.ctx.currentTime + 1.2);
    });
  }

  // Lamp Switch Click
  playSwitch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // Typewriter Key Stroke
  playTypewriter() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(850 + Math.random() * 200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Ambient Rain Generator (Loop)
  startRain(): boolean {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.isRainPlaying && this.rainNoiseNode) {
      return true;
    }

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      this.rainNoiseNode = this.ctx.createBufferSource();
      this.rainNoiseNode.buffer = buffer;
      this.rainNoiseNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.rainGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.0);

      this.rainNoiseNode.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      this.rainNoiseNode.start();
      this.isRainPlaying = true;
      return true;
    } catch (e) {
      console.warn('Failed to start rain:', e);
      return false;
    }
  }

  stopRain(): boolean {
    if (this.rainGain && this.ctx) {
      try {
        this.rainGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.rainNoiseNode) {
            try { this.rainNoiseNode.stop(); } catch {}
            this.rainNoiseNode = null;
          }
        }, 500);
      } catch {}
    }
    this.isRainPlaying = false;
    return false;
  }

  toggleRain(): boolean {
    if (this.isRainPlaying) {
      return this.stopRain();
    } else {
      return this.startRain();
    }
  }

  private initDecks() {
    if (!this.deckA) {
      this.deckA = new Audio('/assets/theme_music.mp3');
      this.deckA.volume = this.targetMusicVolume;
    }
    if (!this.deckB) {
      this.deckB = new Audio('/assets/theme_music.mp3');
      this.deckB.volume = 0;
    }
  }

  private startCrossfadeMonitor() {
    if (this.crossfadeTimer) window.clearInterval(this.crossfadeTimer);

    this.crossfadeTimer = window.setInterval(() => {
      if (!this.isJazzPlaying) return;

      const current = this.activeDeck === 'A' ? this.deckA : this.deckB;
      const next = this.activeDeck === 'A' ? this.deckB : this.deckA;

      if (!current || !next || !current.duration || isNaN(current.duration)) return;

      const timeLeft = current.duration - current.currentTime;

      // When nearing the end of current track, trigger smooth seamless crossfade
      if (timeLeft <= this.crossfadeLeadTime && !this.isCrossfading) {
        this.isCrossfading = true;
        this.activeDeck = this.activeDeck === 'A' ? 'B' : 'A';

        // Reset next deck and begin playing
        next.currentTime = 0;
        next.volume = 0;
        if (!this.isMuted) {
          next.play().catch(() => {});
        }

        // Smooth step-wise volume transition over crossfadeLeadTime
        const steps = 25;
        const intervalMs = (this.crossfadeLeadTime * 1000) / steps;
        let step = 0;

        const fadeInterval = window.setInterval(() => {
          step++;
          const progress = step / steps;

          if (next && current) {
            next.volume = Math.min(this.targetMusicVolume, progress * this.targetMusicVolume);
            current.volume = Math.max(0, (1 - progress) * this.targetMusicVolume);
          }

          if (step >= steps) {
            window.clearInterval(fadeInterval);
            if (current) {
              current.pause();
              current.currentTime = 0;
            }
            this.isCrossfading = false;
          }
        }, intervalMs);
      }
    }, 150);
  }

  startJazz(): boolean {
    this.initDecks();
    if (!this.deckA || !this.deckB) return false;

    this.isJazzPlaying = true;
    this.isCrossfading = false;
    this.activeDeck = 'A';
    this.deckA.volume = this.targetMusicVolume;
    this.deckB.volume = 0;

    if (!this.isMuted) {
      const playPromise = this.deckA.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
    this.startCrossfadeMonitor();
    return true;
  }

  stopJazz(): boolean {
    if (this.crossfadeTimer) window.clearInterval(this.crossfadeTimer);
    if (this.deckA) this.deckA.pause();
    if (this.deckB) this.deckB.pause();
    this.isJazzPlaying = false;
    this.isCrossfading = false;
    return false;
  }

  // Ambient Noir Detective Theme Music Player (Seamless Crossfading Loop)
  toggleJazz(): boolean {
    if (this.isJazzPlaying) {
      return this.stopJazz();
    } else {
      return this.startJazz();
    }
  }

  unlockAudio() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.isRainPlaying && !this.rainNoiseNode) {
      this.startRain();
    }
    if (this.isJazzPlaying && this.deckA && this.deckA.paused && !this.isMuted) {
      this.deckA.play().catch(() => {});
    }
  }

  getRainPlaying() {
    return this.isRainPlaying;
  }

  getJazzPlaying() {
    return this.isJazzPlaying;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.deckA && this.deckB) {
      if (this.isMuted) {
        this.deckA.pause();
        this.deckB.pause();
      } else if (this.isJazzPlaying) {
        const current = this.activeDeck === 'A' ? this.deckA : this.deckB;
        current.play().catch(() => {});
      }
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }
}

export const sounds = new SoundEngine();
