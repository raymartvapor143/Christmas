/**
 * Romantic Christmas & Galaxy Love Universe Website Logic
 * Handles animations, Web Audio synthesis, interactive scenes, 3D Galaxy Love Line engine, and memory gallery.
 */

(() => {
  'use strict';

  // --- STATE MANAGEMENT ---
  const AppState = {
    currentScene: 'intro', // 'intro' | 'opening' | 'transitioning' | 'main' | 'final' | 'galaxy'
    isAudioPlaying: false,
    particles: [],
    snowflakes: [],
    audioCtx: null,
    synthInterval: null
  };

  // --- DOM ELEMENTS ---
  const sceneIntro = document.getElementById('sceneIntro');
  const sceneMain = document.getElementById('sceneMain');
  const giftContainer = document.getElementById('giftContainer');
  const giftClickBtn = document.getElementById('giftClickBtn');
  const giftLid = document.getElementById('giftLid');
  const innerGiftGlow = document.getElementById('innerGiftGlow');
  const flashOverlay = document.getElementById('flashOverlay');
  const fxCanvas = document.getElementById('fxCanvas');
  const memoryGallery = document.getElementById('memoryGallery');
  const messageCardSection = document.getElementById('messageCardSection');
  const finalSurpriseBtn = document.getElementById('finalSurpriseBtn');
  const finalSurpriseModal = document.getElementById('finalSurpriseModal');
  const closeFinalBtn = document.getElementById('closeFinalBtn');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const musicLabel = document.getElementById('musicLabel');
  const restartBtn = document.getElementById('restartBtn');

  // Interactive Stage Elements
  const charMan = document.getElementById('charMan');
  const manBubble = document.getElementById('manBubble');
  const manHeartFloat = document.getElementById('manHeartFloat');
  const xmasTree = document.getElementById('xmasTree');
  const treeBubble = document.getElementById('treeBubble');
  const santaCharacter = document.getElementById('santaCharacter');
  const santaBubble = document.getElementById('santaBubble');

  // Galaxy Scene Elements
  const sceneGalaxy = document.getElementById('sceneGalaxy');
  const galaxyCanvas = document.getElementById('galaxyCanvas');
  const enterGalaxyBtn = document.getElementById('enterGalaxyBtn');
  const galaxyBackBtn = document.getElementById('galaxyBackBtn');
  const goToGalaxyNavBtn = document.getElementById('goToGalaxyNavBtn');
  const galaxySpeedBtn = document.getElementById('galaxySpeedBtn');
  const galaxySpeedLabel = document.getElementById('galaxySpeedLabel');
  const galaxyBurstBtn = document.getElementById('galaxyBurstBtn');
  const addLoveMessageBtn = document.getElementById('addLoveMessageBtn');

  let fxCtx = null;
  let hasLetterBeenRevealed = false;

  // --- AUDIO SYNTHESIZER (Gentle Holiday Music Box) ---
  const ChristmasSynth = {
    melody: [
      { note: 261.63, dur: 0.3 }, // C4
      { note: 349.23, dur: 0.3 }, // F4
      { note: 349.23, dur: 0.2 }, // F4
      { note: 392.00, dur: 0.2 }, // G4
      { note: 349.23, dur: 0.2 }, // F4
      { note: 329.63, dur: 0.2 }, // E4
      { note: 293.66, dur: 0.3 }, // D4
      { note: 293.66, dur: 0.3 }, // D4
      { note: 293.66, dur: 0.3 }, // D4
      { note: 392.00, dur: 0.3 }, // G4
      { note: 392.00, dur: 0.2 }, // G4
      { note: 440.00, dur: 0.2 }, // A4
      { note: 392.00, dur: 0.2 }, // G4
      { note: 349.23, dur: 0.2 }, // F4
      { note: 329.63, dur: 0.3 }, // E4
      { note: 261.63, dur: 0.3 }, // C4
      { note: 261.63, dur: 0.3 }, // C4
      { note: 440.00, dur: 0.3 }, // A4
      { note: 440.00, dur: 0.2 }, // A4
      { note: 493.88, dur: 0.2 }, // B4
      { note: 440.00, dur: 0.2 }, // A4
      { note: 392.00, dur: 0.2 }, // G4
      { note: 349.23, dur: 0.3 }, // F4
      { note: 293.66, dur: 0.3 }, // D4
      { note: 261.63, dur: 0.2 }, // C4
      { note: 261.63, dur: 0.2 }, // C4
      { note: 293.66, dur: 0.3 }, // D4
      { note: 392.00, dur: 0.3 }, // G4
      { note: 329.63, dur: 0.3 }, // E4
      { note: 349.23, dur: 0.6 }, // F4
    ],
    noteIdx: 0,

    init() {
      if (!AppState.audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          AppState.audioCtx = new AudioCtxClass();
        }
      }
      if (AppState.audioCtx && AppState.audioCtx.state === 'suspended') {
        AppState.audioCtx.resume();
      }
    },

    playTone(freq, duration) {
      if (!AppState.audioCtx) return;
      try {
        const osc = AppState.audioCtx.createOscillator();
        const gain = AppState.audioCtx.createGain();
        const now = AppState.audioCtx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.2);

        osc.connect(gain);
        gain.connect(AppState.audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration * 1.3);
      } catch (err) {}
    },

    start() {
      this.init();
      AppState.isAudioPlaying = true;
      if (musicIcon) musicIcon.textContent = '🔊';
      if (musicLabel) musicLabel.textContent = 'Music Playing 🎶';
      if (musicToggle) musicToggle.classList.add('bg-warmGold/20', 'border-warmGold');

      if (AppState.synthInterval) clearInterval(AppState.synthInterval);

      const step = () => {
        if (!AppState.isAudioPlaying) return;
        const noteObj = this.melody[this.noteIdx];
        this.playTone(noteObj.note, noteObj.dur);
        this.noteIdx = (this.noteIdx + 1) % this.melody.length;
        const delay = noteObj.dur * 600 + 100;
        AppState.synthInterval = setTimeout(step, delay);
      };
      step();
    },

    stop() {
      AppState.isAudioPlaying = false;
      if (AppState.synthInterval) clearTimeout(AppState.synthInterval);
      if (musicIcon) musicIcon.textContent = '🎵';
      if (musicLabel) musicLabel.textContent = 'Play Holiday Music';
      if (musicToggle) musicToggle.classList.remove('bg-warmGold/20', 'border-warmGold');
    },

    toggle() {
      if (AppState.isAudioPlaying) {
        this.stop();
      } else {
        this.start();
      }
    }
  };

  const playMagicalChime = () => {
    if (!AppState.audioCtx) ChristmasSynth.init();
    if (!AppState.audioCtx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        try {
          const osc = AppState.audioCtx.createOscillator();
          const gain = AppState.audioCtx.createGain();
          const now = AppState.audioCtx.currentTime;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(gain);
          gain.connect(AppState.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.6);
        } catch (e) {}
      }, idx * 80);
    });
  };

  // --- CELESTIAL SOUND SYNTHESIZER FOR GALAXY ---
  const CosmicSynth = {
    playChord() {
      if (!AppState.audioCtx) ChristmasSynth.init();
      if (!AppState.audioCtx) return;
      const freqs = [329.63, 493.88, 659.25, 987.77, 1318.51];
      freqs.forEach((f, i) => {
        setTimeout(() => {
          try {
            const osc = AppState.audioCtx.createOscillator();
            const gain = AppState.audioCtx.createGain();
            const now = AppState.audioCtx.currentTime;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.06, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
            osc.connect(gain);
            gain.connect(AppState.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 1.8);
          } catch (e) {}
        }, i * 60);
      });
    },

    playStardustTwinkle() {
      if (!AppState.audioCtx) ChristmasSynth.init();
      if (!AppState.audioCtx) return;
      const freqs = [880, 1174.66, 1396.91, 1760];
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      try {
        const osc = AppState.audioCtx.createOscillator();
        const gain = AppState.audioCtx.createGain();
        const now = AppState.audioCtx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(AppState.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } catch (e) {}
    }
  };

  // --- ULTRA LIGHTWEIGHT CANVAS ENGINE (SNOW & HEARTS) ---
  const initCanvas = () => {
    if (!fxCanvas) return;
    const resize = () => {
      fxCanvas.width = window.innerWidth;
      fxCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    fxCtx = fxCanvas.getContext('2d', { alpha: true });

    AppState.snowflakes = [];
    for (let i = 0; i < 30; i++) {
      AppState.snowflakes.push({
        x: Math.random() * fxCanvas.width,
        y: Math.random() * fxCanvas.height,
        radius: Math.random() * 1.8 + 0.8,
        speedY: Math.random() * 0.8 + 0.5,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.02,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    const loop = () => {
      renderScene();
      requestAnimationFrame(loop);
    };
    loop();
  };

  const renderScene = () => {
    if (!fxCtx || !fxCanvas) return;
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

    // 1. Render Snow
    fxCtx.fillStyle = '#ffffff';
    for (let i = 0; i < AppState.snowflakes.length; i++) {
      const flake = AppState.snowflakes[i];
      flake.y += flake.speedY;
      flake.swing += flake.swingSpeed;
      flake.x += Math.sin(flake.swing) * 0.4;

      if (flake.y > fxCanvas.height) {
        flake.y = -5;
        flake.x = Math.random() * fxCanvas.width;
      }
      if (flake.x > fxCanvas.width) flake.x = 0;
      if (flake.x < 0) flake.x = fxCanvas.width;

      fxCtx.globalAlpha = flake.opacity;
      fxCtx.beginPath();
      fxCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      fxCtx.fill();
    }

    // 2. Render Particles
    for (let i = AppState.particles.length - 1; i >= 0; i--) {
      const p = AppState.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;

      if (p.life <= 0) {
        AppState.particles.splice(i, 1);
        continue;
      }

      fxCtx.globalAlpha = p.life;
      if (p.type === 'heart') {
        fxCtx.font = `${p.size}px serif`;
        fxCtx.fillText('❤️', p.x, p.y);
      } else if (p.type === 'star') {
        fxCtx.font = `${p.size}px serif`;
        fxCtx.fillText('✨', p.x, p.y);
      } else {
        fxCtx.fillStyle = p.color;
        fxCtx.beginPath();
        fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fxCtx.fill();
      }
    }
    fxCtx.globalAlpha = 1.0;
  };

  const spawnBurst = (x, y, count = 20, spread = 4, types = ['circle', 'star', 'heart']) => {
    const colors = ['#FFD166', '#FF6B81', '#FFF4D6', '#D62828', '#FFFFFF'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * spread + 1;
      const type = types[Math.floor(Math.random() * types.length)];
      AppState.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        gravity: 0.04,
        size: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: 0.025,
        type: type
      });
    }
  };

  // --- FAST & RESPONSIVE GIFT OPENING SEQUENCE ---
  const openGift = () => {
    if (AppState.currentScene !== 'intro') return;
    AppState.currentScene = 'opening';

    if (!AppState.isAudioPlaying) {
      ChristmasSynth.start();
    }
    playMagicalChime();

    if (giftClickBtn) {
      giftClickBtn.disabled = true;
      giftClickBtn.classList.add('opacity-50', 'pointer-events-none');
    }

    if (giftContainer) giftContainer.classList.add('gift-shaking');
    if (innerGiftGlow) {
      innerGiftGlow.classList.remove('opacity-0');
      innerGiftGlow.classList.add('opacity-100');
    }

    setTimeout(() => {
      if (giftLid) giftLid.classList.add('gift-lid-opening');
      if (giftContainer) {
        const rect = giftContainer.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 3, 20, 6, ['star', 'circle', 'heart']);
      }
    }, 200);

    setTimeout(() => {
      AppState.currentScene = 'transitioning';
      if (giftContainer) {
        const rect = giftContainer.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30, 7, ['star', 'heart']);
      }

      if (flashOverlay) {
        flashOverlay.classList.remove('opacity-0');
        flashOverlay.classList.add('opacity-100');
      }

      setTimeout(() => {
        if (sceneIntro) sceneIntro.classList.add('hidden');
        if (sceneMain) {
          sceneMain.classList.remove('hidden');
          sceneMain.classList.remove('opacity-0');
          sceneMain.classList.add('opacity-100');
        }
        if (flashOverlay) {
          flashOverlay.classList.remove('opacity-100');
          flashOverlay.classList.add('opacity-0');
        }
        if (restartBtn) restartBtn.classList.remove('hidden');
        if (goToGalaxyNavBtn) goToGalaxyNavBtn.classList.remove('hidden');

        // Smoothly animate Memory Photos into view
        if (memoryGallery) {
          setTimeout(() => {
            memoryGallery.classList.remove('opacity-0', 'translate-y-6');
            memoryGallery.classList.add('opacity-100', 'translate-y-0');
            const rect = memoryGallery.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + 30, 20, 4, ['star', 'heart']);
          }, 250);
        }

        // Display Man
        if (charMan) {
          charMan.style.opacity = '1';
          charMan.style.transform = 'translateY(0px)';
        }

        setTimeout(() => {
          showBubble(manBubble, 3500);
        }, 400);

        AppState.currentScene = 'main';
      }, 250);

    }, 450);
  };

  // Reveal Glassmorphic Love Letter ONLY When the Man is Tapped
  const triggerLoveLetterReveal = () => {
    if (!messageCardSection) return;
    if (messageCardSection.classList.contains('hidden')) {
      messageCardSection.classList.remove('hidden');
    }

    if (hasLetterBeenRevealed) {
      messageCardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    hasLetterBeenRevealed = true;

    requestAnimationFrame(() => {
      messageCardSection.classList.remove('opacity-0', 'translate-y-6');
      messageCardSection.classList.add('opacity-100', 'translate-y-0');

      setTimeout(() => {
        messageCardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      const lines = document.querySelectorAll('.letter-line');
      lines.forEach((line, index) => {
        setTimeout(() => {
          line.classList.remove('opacity-0');
          line.classList.add('opacity-100');
        }, index * 60 + 80);
      });
    });
  };

  const showBubble = (bubbleEl, duration = 3000) => {
    if (!bubbleEl) return;
    bubbleEl.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
    bubbleEl.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      bubbleEl.classList.remove('opacity-100', 'translate-y-0');
      bubbleEl.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
    }, duration);
  };

  // =========================================================================
  // GALAXY ENGINE: 3D ROTATING PARTICLE DISK, HEART BEAM, & ORBITING TEXTS 🌌
  // =========================================================================
  const GalaxyEngine = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    isRunning: false,
    animFrameId: null,

    pitch: 0.48,
    yaw: 0,
    zoom: 1.0,
    speedMultiplier: 1.0,

    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    autoRotateSpeed: 0.0035,

    galaxyParticles: [],
    heartBeamParticles: [],
    orbitingTexts: [],
    orbitingMemories: [],
    shootingStars: [],
    supernovas: [],
    loadedImages: [],

    init() {
      this.canvas = galaxyCanvas || document.getElementById('galaxyCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.resize();
      window.addEventListener('resize', () => {
        if (this.isRunning) this.resize();
      });

      this.loadMemoryImages();
      this.buildGalaxyParticles();
      this.buildHeartBeamParticles();
      this.buildOrbitingTexts();
      this.initOrbitControls();
    },

    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    },

    loadMemoryImages() {
      const srcList = ['image/1.jpg', 'image/2.jpg', 'image/3.jpg'];
      this.loadedImages = [];
      srcList.forEach((src, idx) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          this.loadedImages.push({
            img: img,
            radius: 280 + idx * 75,
            angle: (idx * (Math.PI * 2 / 3)),
            speed: 0.003 + idx * 0.0005,
            title: idx === 0 ? 'Forever BABE 💖' : idx === 1 ? '7 Years Strong 🎄' : 'Almost 8 Years ❤️'
          });
        };
      });
    },

    buildGalaxyParticles() {
      this.galaxyParticles = [];
      const particleCount = window.innerWidth < 768 ? 950 : 1800;
      const arms = 4;
      const armSpread = 0.45;
      const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.85;

      const colors = [
        '#ff4081', '#ff79b0', '#f50057', '#ff80ab',
        '#ff1744', '#f48fb1', '#ffffff', '#ffd166', '#d81b60'
      ];

      for (let i = 0; i < particleCount; i++) {
        const armIndex = i % arms;
        const armOffset = (armIndex * 2 * Math.PI) / arms;
        const distRatio = Math.pow(Math.random(), 1.6);
        const distance = distRatio * maxRadius + 25;
        const angle = armOffset + distance * 0.006 + (Math.random() - 0.5) * armSpread;

        const x = Math.cos(angle) * distance + (Math.random() - 0.5) * (distance * 0.15);
        const z = Math.sin(angle) * distance + (Math.random() - 0.5) * (distance * 0.15);
        const y = (Math.random() - 0.5) * (35 * (1 - distRatio * 0.7));

        this.galaxyParticles.push({
          x: x,
          y: y,
          z: z,
          dist: distance,
          baseAngle: angle,
          size: Math.random() * 2.2 + 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.75 + 0.25,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }

      // Galactic Core Center
      for (let i = 0; i < 200; i++) {
        const r = Math.random() * 45 + 5;
        const th = Math.random() * Math.PI * 2;
        this.galaxyParticles.push({
          x: Math.cos(th) * r,
          y: (Math.random() - 0.5) * 15,
          z: Math.sin(th) * r,
          dist: r,
          baseAngle: th,
          size: Math.random() * 3 + 1,
          color: '#ffffff',
          alpha: Math.random() * 0.9 + 0.3,
          twinkleSpeed: 0.06,
          twinklePhase: Math.random() * Math.PI
        });
      }
    },

    buildHeartBeamParticles() {
      this.heartBeamParticles = [];
      const heartCount = window.innerWidth < 768 ? 400 : 700;
      const heartScale = window.innerWidth < 768 ? 7.5 : 12;

      for (let i = 0; i < heartCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3) * heartScale;
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * heartScale;
        const baseElevation = -(window.innerHeight < 700 ? 150 : 220);
        const fillFactor = Math.random() > 0.4 ? Math.sqrt(Math.random()) : 1.0;
        const jitter = (Math.random() - 0.5) * 8;

        this.heartBeamParticles.push({
          x: hx * fillFactor + jitter,
          y: baseElevation + hy * fillFactor + (Math.random() - 0.5) * 8,
          z: (Math.random() - 0.5) * 20,
          originalY: baseElevation + hy * fillFactor,
          size: Math.random() * 2.8 + 1.2,
          color: Math.random() > 0.3 ? '#ff4081' : Math.random() > 0.5 ? '#ffffff' : '#ffd166',
          alpha: Math.random() * 0.8 + 0.3,
          shimmerSpeed: Math.random() * 0.05 + 0.02,
          shimmerPhase: Math.random() * Math.PI * 2
        });
      }

      // Light Beam Stream
      for (let i = 0; i < 180; i++) {
        const heightProgress = Math.random();
        const beamY = - (heightProgress * (window.innerHeight < 700 ? 150 : 220));
        const beamRadius = (1 - heightProgress * 0.5) * 14 + Math.random() * 4;
        const beamAngle = Math.random() * Math.PI * 2;

        this.heartBeamParticles.push({
          x: Math.cos(beamAngle) * beamRadius,
          y: beamY,
          z: Math.sin(beamAngle) * beamRadius,
          originalY: beamY,
          size: Math.random() * 2.2 + 0.8,
          color: heightProgress > 0.7 ? '#ffffff' : '#ff79b0',
          alpha: Math.random() * 0.8 + 0.2,
          shimmerSpeed: 0.08,
          shimmerPhase: Math.random() * Math.PI * 2
        });
      }
    },

    buildOrbitingTexts() {
      const phrases = [
        { text: 'HAPPY BIRTHDAY', radius: 180, color: '#ff80ab', size: 14 },
        { text: 'AMOR DE MI VIDA ❤️', radius: 240, color: '#ffd166', size: 16 },
        { text: 'NUESTRO UNIVERSO • SIEMPRE', radius: 310, color: '#ff4081', size: 15 },
        { text: 'AMOR INFINITO ✨', radius: 210, color: '#ffffff', size: 14 },
        { text: '7 YEARS & TO INFINITY 🚀', radius: 370, color: '#f48fb1', size: 15 },
        { text: 'CUMPLE FELIZ 🎂', radius: 280, color: '#ff6b81', size: 14 },
        { text: 'FOREVER WITH YOU BABE 💖', radius: 340, color: '#ffe082', size: 16 },
        { text: 'CELEBRAMOS 🌟', radius: 410, color: '#ff80ab', size: 13 },
        { text: 'AL AMOR DE MI VIDA', radius: 260, color: '#f8bbd0', size: 13 },
        { text: 'MY FOREVER LOVE ❤️', radius: 460, color: '#ff4081', size: 15 },
      ];

      this.orbitingTexts = phrases.map((item, index) => {
        const baseAngle = (index * (Math.PI * 2 / phrases.length)) + Math.random() * 0.2;
        return {
          text: item.text,
          radius: item.radius,
          angle: baseAngle,
          orbitSpeed: 0.0032 + (index % 3) * 0.0006,
          yOffset: (Math.sin(index) * 18),
          color: item.color,
          fontSize: item.size
        };
      });
    },

    initOrbitControls() {
      if (!this.canvas) return;

      const onStart = (clientX, clientY) => {
        this.isDragging = true;
        this.lastMouseX = clientX;
        this.lastMouseY = clientY;
      };

      const onMove = (clientX, clientY) => {
        if (!this.isDragging) return;
        const deltaX = clientX - this.lastMouseX;
        const deltaY = clientY - this.lastMouseY;
        this.yaw += deltaX * 0.006;
        this.pitch += deltaY * 0.004;
        this.pitch = Math.max(0.1, Math.min(1.4, this.pitch));
        this.lastMouseX = clientX;
        this.lastMouseY = clientY;
      };

      const onEnd = () => {
        this.isDragging = false;
      };

      this.canvas.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
      window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', onEnd);

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          onStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchend', onEnd);

      this.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY * -0.0012;
        this.zoom = Math.max(0.6, Math.min(1.8, this.zoom + zoomDelta));
      }, { passive: false });

      this.canvas.addEventListener('click', (e) => {
        if (!this.isDragging) {
          this.spawnSupernova(e.clientX, e.clientY);
        }
      });
    },

    spawnSupernova(screenX, screenY) {
      CosmicSynth.playChord();
      const count = 40;
      const colors = ['#ff4081', '#ffffff', '#ffd166', '#ff80ab', '#ff1744'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.supernovas.push({
          x: screenX,
          y: screenY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1.0,
          decay: Math.random() * 0.02 + 0.015,
          isHeart: Math.random() > 0.4
        });
      }
    },

    project3D(x, y, z, cx, cy) {
      const cosYaw = Math.cos(this.yaw);
      const sinYaw = Math.sin(this.yaw);
      const x1 = x * cosYaw - z * sinYaw;
      const z1 = x * sinYaw + z * cosYaw;

      const cosPitch = Math.cos(this.pitch);
      const sinPitch = Math.sin(this.pitch);
      const y2 = y * cosPitch - z1 * sinPitch;
      const z2 = y * sinPitch + z1 * cosPitch;

      const fov = 750 * this.zoom;
      const distance = 850 + z2;
      if (distance <= 10) return null;

      const scale = fov / distance;
      const projX = cx + x1 * scale;
      const projY = cy + y2 * scale;

      return { x: projX, y: projY, scale: scale, depth: z2 };
    },

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.resize();

      const loop = () => {
        if (!this.isRunning) return;
        this.render();
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    },

    stop() {
      this.isRunning = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    },

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const cx = w / 2;
      const cy = h * 0.58;

      ctx.fillStyle = '#030008';
      ctx.fillRect(0, 0, w, h);

      this.yaw += this.autoRotateSpeed * this.speedMultiplier;

      // Shooting Stars
      if (Math.random() < 0.018) {
        this.shootingStars.push({
          x: Math.random() * w,
          y: Math.random() * (h * 0.4),
          vx: -(Math.random() * 8 + 6),
          vy: Math.random() * 4 + 3,
          len: Math.random() * 60 + 40,
          alpha: 1.0,
          decay: 0.025
        });
        if (Math.random() < 0.3) CosmicSynth.playStardustTwinkle();
      }

      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const star = this.shootingStars[i];
        star.x += star.vx;
        star.y += star.vy;
        star.alpha -= star.decay;
        if (star.alpha <= 0) {
          this.shootingStars.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(255, 209, 230, ${star.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * 3, star.y - star.vy * 3);
        ctx.stroke();
      }

      const depthQueue = [];
      const now = performance.now() * 0.001;

      // Galaxy Particles
      for (let i = 0; i < this.galaxyParticles.length; i++) {
        const p = this.galaxyParticles[i];
        const proj = this.project3D(p.x, p.y, p.z, cx, cy);
        if (proj && proj.scale > 0) {
          const twinkle = 0.5 + 0.5 * Math.sin(now * p.twinkleSpeed * 30 + p.twinklePhase);
          depthQueue.push({
            type: 'particle',
            x: proj.x,
            y: proj.y,
            scale: proj.scale,
            depth: proj.depth,
            size: p.size * proj.scale,
            color: p.color,
            alpha: p.alpha * twinkle
          });
        }
      }

      // Heart Beam Particles
      for (let i = 0; i < this.heartBeamParticles.length; i++) {
        const hp = this.heartBeamParticles[i];
        const proj = this.project3D(hp.x, hp.y, hp.z, cx, cy);
        if (proj && proj.scale > 0) {
          const shimmer = 0.6 + 0.4 * Math.sin(now * hp.shimmerSpeed * 25 + hp.shimmerPhase);
          depthQueue.push({
            type: 'heartParticle',
            x: proj.x,
            y: proj.y,
            scale: proj.scale,
            depth: proj.depth,
            size: hp.size * proj.scale * 1.2,
            color: hp.color,
            alpha: hp.alpha * shimmer
          });
        }
      }

      // Orbiting Texts
      for (let i = 0; i < this.orbitingTexts.length; i++) {
        const item = this.orbitingTexts[i];
        item.angle += item.orbitSpeed * this.speedMultiplier;
        const tx = Math.cos(item.angle) * item.radius;
        const tz = Math.sin(item.angle) * item.radius;
        const ty = item.yOffset;

        const proj = this.project3D(tx, ty, tz, cx, cy);
        if (proj && proj.scale > 0) {
          depthQueue.push({
            type: 'orbitText',
            text: item.text,
            x: proj.x,
            y: proj.y,
            scale: proj.scale,
            depth: proj.depth,
            color: item.color,
            fontSize: item.fontSize * proj.scale
          });
        }
      }

      // Orbiting Memories
      for (let i = 0; i < this.loadedImages.length; i++) {
        const mem = this.loadedImages[i];
        mem.angle += mem.speed * this.speedMultiplier;
        const mx = Math.cos(mem.angle) * mem.radius;
        const mz = Math.sin(mem.angle) * mem.radius;
        const my = -30 + Math.sin(now + i) * 15;

        const proj = this.project3D(mx, my, mz, cx, cy);
        if (proj && proj.scale > 0) {
          depthQueue.push({
            type: 'memoryCard',
            img: mem.img,
            title: mem.title,
            x: proj.x,
            y: proj.y,
            scale: proj.scale,
            depth: proj.depth
          });
        }
      }

      depthQueue.sort((a, b) => b.depth - a.depth);

      // Core Glow
      const coreProj = this.project3D(0, 0, 0, cx, cy);
      if (coreProj) {
        const coreGradient = ctx.createRadialGradient(
          coreProj.x, coreProj.y, 4 * coreProj.scale,
          coreProj.x, coreProj.y, 90 * coreProj.scale
        );
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreGradient.addColorStop(0.2, 'rgba(255, 64, 129, 0.8)');
        coreGradient.addColorStop(0.5, 'rgba(245, 0, 87, 0.4)');
        coreGradient.addColorStop(1, 'rgba(3, 0, 8, 0)');

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(coreProj.x, coreProj.y, 90 * coreProj.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#05000a';
        ctx.beginPath();
        ctx.arc(coreProj.x, coreProj.y, 14 * coreProj.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5 * coreProj.scale;
        ctx.stroke();
      }

      // Render items
      for (let i = 0; i < depthQueue.length; i++) {
        const item = depthQueue[i];

        if (item.type === 'particle' || item.type === 'heartParticle') {
          ctx.globalAlpha = Math.min(1.0, Math.max(0, item.alpha));
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(item.x, item.y, Math.max(0.6, item.size), 0, Math.PI * 2);
          ctx.fill();

          if (item.type === 'heartParticle' && item.scale > 0.8) {
            ctx.fillStyle = 'rgba(255, 107, 180, 0.25)';
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (item.type === 'orbitText') {
          ctx.globalAlpha = Math.min(1.0, Math.max(0.2, item.scale * 1.1));
          ctx.font = `bold ${Math.max(8, item.fontSize)}px 'Outfit', 'Playfair Display', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.shadowColor = item.color;
          ctx.shadowBlur = 10 * item.scale;
          ctx.fillStyle = item.color;
          ctx.fillText(item.text, item.x, item.y);
          ctx.shadowBlur = 0;
        } else if (item.type === 'memoryCard') {
          ctx.globalAlpha = Math.min(1.0, Math.max(0.3, item.scale * 1.2));
          const cardW = 56 * item.scale;
          const cardH = 68 * item.scale;
          const cardX = item.x - cardW / 2;
          const cardY = item.y - cardH / 2;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
          ctx.strokeStyle = 'rgba(255, 107, 180, 0.8)';
          ctx.lineWidth = 1.5 * item.scale;
          ctx.shadowColor = 'rgba(255, 107, 180, 0.7)';
          ctx.shadowBlur = 12 * item.scale;

          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(cardX, cardY, cardW, cardH, 6 * item.scale);
          } else {
            ctx.rect(cardX, cardY, cardW, cardH);
          }
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          const pad = 4 * item.scale;
          const imgH = 46 * item.scale;
          try {
            ctx.drawImage(item.img, cardX + pad, cardY + pad, cardW - pad * 2, imgH);
          } catch (e) {}

          ctx.fillStyle = '#102a43';
          ctx.font = `bold ${Math.max(6, 7 * item.scale)}px 'Outfit', sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(item.title, item.x, cardY + cardH - 5 * item.scale);
        }
      }

      ctx.globalAlpha = 1.0;

      // Render Supernovas
      for (let i = this.supernovas.length - 1; i >= 0; i--) {
        const p = this.supernovas[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          this.supernovas.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        if (p.isHeart) {
          ctx.font = `${p.size * 4}px serif`;
          ctx.fillText('💖', p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;
    }
  };

  // --- TRANSITION INTO GALAXY LOVE UNIVERSE SCENE ---
  const enterGalaxyScene = () => {
    AppState.currentScene = 'galaxy';

    const modal = document.getElementById('finalSurpriseModal');
    const intro = document.getElementById('sceneIntro');
    const main = document.getElementById('sceneMain');
    const galaxy = document.getElementById('sceneGalaxy');
    const flash = document.getElementById('flashOverlay');

    if (modal) {
      modal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
      modal.classList.remove('opacity-100');
    }
    if (intro) intro.classList.add('hidden');
    if (main) {
      main.classList.add('hidden', 'opacity-0');
      main.classList.remove('opacity-100');
    }

    if (galaxy) {
      galaxy.classList.remove('hidden', 'opacity-0');
      galaxy.classList.add('opacity-100');
      galaxy.style.display = 'block';
      galaxy.style.opacity = '1';
    }

    if (flash) {
      flash.classList.remove('opacity-0');
      flash.classList.add('opacity-100');
      setTimeout(() => {
        flash.classList.remove('opacity-100');
        flash.classList.add('opacity-0');
      }, 300);
    }

    CosmicSynth.playChord();
    GalaxyEngine.init();
    GalaxyEngine.start();

    setTimeout(() => {
      GalaxyEngine.resize();
      GalaxyEngine.spawnSupernova(window.innerWidth / 2, window.innerHeight * 0.45);
    }, 100);
  };

  window.enterGalaxyScene = enterGalaxyScene;
  window.returnToChristmasScene = returnToChristmasScene;

  // Return to Christmas Scene
  const returnToChristmasScene = () => {
    AppState.currentScene = 'main';
    GalaxyEngine.stop();

    const main = document.getElementById('sceneMain');
    const galaxy = document.getElementById('sceneGalaxy');
    const flash = document.getElementById('flashOverlay');

    if (galaxy) {
      galaxy.classList.add('hidden', 'opacity-0');
      galaxy.classList.remove('opacity-100');
      galaxy.style.display = 'none';
    }

    if (main) {
      main.classList.remove('hidden', 'opacity-0');
      main.classList.add('opacity-100');
      main.style.display = 'block';
      main.style.opacity = '1';
    }

    if (flash) {
      flash.classList.remove('opacity-0');
      flash.classList.add('opacity-100');
      setTimeout(() => {
        flash.classList.remove('opacity-100');
        flash.classList.add('opacity-0');
      }, 300);
    }
  };

  // --- INTERACTION HANDLERS ---
  const initInteractions = () => {
    if (giftContainer) {
      giftContainer.addEventListener('click', openGift);
      giftContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openGift();
        }
      });
    }

    if (giftClickBtn) giftClickBtn.addEventListener('click', openGift);

    if (charMan) {
      charMan.addEventListener('click', () => {
        showBubble(manBubble, 3000);
        if (manHeartFloat) {
          manHeartFloat.classList.remove('opacity-0');
          setTimeout(() => manHeartFloat.classList.add('opacity-0'), 1500);
        }

        const rect = charMan.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + 20, 15, 4, ['heart', 'star']);
        playMagicalChime();

        triggerLoveLetterReveal();
      });
    }

    if (xmasTree) {
      xmasTree.addEventListener('click', () => {
        showBubble(treeBubble, 3000);
        const rect = xmasTree.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 3, 15, 4, ['star', 'circle']);
        playMagicalChime();
      });
    }

    if (santaCharacter) {
      santaCharacter.addEventListener('click', () => {
        showBubble(santaBubble, 3000);
        const rect = santaCharacter.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + 20, 15, 4, ['star', 'heart']);
        playMagicalChime();
      });
    }

    document.querySelectorAll('.polaroid-card').forEach((card) => {
      card.addEventListener('click', () => {
        const rect = card.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15, 4, ['heart', 'star']);
        playMagicalChime();
      });
    });

    if (finalSurpriseBtn) {
      finalSurpriseBtn.addEventListener('click', () => {
        AppState.currentScene = 'final';
        spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 35, 7, ['heart', 'star']);
        playMagicalChime();

        if (finalSurpriseModal) {
          finalSurpriseModal.classList.remove('opacity-0', 'pointer-events-none');
          finalSurpriseModal.classList.add('opacity-100');
          const modalInner = finalSurpriseModal.querySelector('div');
          if (modalInner) {
            modalInner.classList.remove('scale-90');
            modalInner.classList.add('scale-100');
          }
        }
      });
    }

    if (closeFinalBtn) {
      closeFinalBtn.addEventListener('click', () => {
        if (finalSurpriseModal) {
          finalSurpriseModal.classList.add('opacity-0', 'pointer-events-none');
          finalSurpriseModal.classList.remove('opacity-100');
          const modalInner = finalSurpriseModal.querySelector('div');
          if (modalInner) {
            modalInner.classList.add('scale-90');
            modalInner.classList.remove('scale-100');
          }
        }
      });
    }

    // Galaxy Navigation Triggers
    if (enterGalaxyBtn) enterGalaxyBtn.addEventListener('click', enterGalaxyScene);
    if (galaxyBackBtn) galaxyBackBtn.addEventListener('click', returnToChristmasScene);
    if (goToGalaxyNavBtn) goToGalaxyNavBtn.addEventListener('click', enterGalaxyScene);

    // Galaxy Speed Toggle
    let speedLevel = 1;
    if (galaxySpeedBtn) {
      galaxySpeedBtn.addEventListener('click', () => {
        speedLevel = (speedLevel + 1) % 3;
        if (speedLevel === 0) {
          GalaxyEngine.speedMultiplier = 0.4;
          if (galaxySpeedLabel) galaxySpeedLabel.textContent = 'Slow Orbit 🐢';
        } else if (speedLevel === 1) {
          GalaxyEngine.speedMultiplier = 1.0;
          if (galaxySpeedLabel) galaxySpeedLabel.textContent = 'Normal Speed ⚡';
        } else {
          GalaxyEngine.speedMultiplier = 2.2;
          if (galaxySpeedLabel) galaxySpeedLabel.textContent = 'Warp Speed 🚀';
        }
      });
    }

    // Supernova Button
    if (galaxyBurstBtn) {
      galaxyBurstBtn.addEventListener('click', () => {
        GalaxyEngine.spawnSupernova(window.innerWidth / 2, window.innerHeight * 0.45);
      });
    }

    // Add Love Message on the fly into Orbit
    if (addLoveMessageBtn) {
      addLoveMessageBtn.addEventListener('click', () => {
        const messages = [
          'BABY KO FOREVER ❤️',
          'IKAW RA GYUD BABE ✨',
          'TO 8 YEARS AND BEYOND 💫',
          'MY WHOLE UNIVERSE 🌌',
          'I LOVE YOU BABE 💖',
          '7 YEARS WITH YOU 💕'
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        GalaxyEngine.orbitingTexts.push({
          text: randomMsg,
          radius: Math.random() * 200 + 200,
          angle: Math.random() * Math.PI * 2,
          orbitSpeed: 0.004,
          yOffset: (Math.random() - 0.5) * 40,
          color: '#ff80ab',
          fontSize: 16
        });
        GalaxyEngine.spawnSupernova(window.innerWidth / 2, window.innerHeight * 0.5);
      });
    }

    if (musicToggle) {
      musicToggle.addEventListener('click', () => {
        ChristmasSynth.toggle();
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  };

  const init = () => {
    initCanvas();
    initInteractions();
    console.log('✨ Responsive Christmas & Galaxy Love Universe Ready! ❤️🌌');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
