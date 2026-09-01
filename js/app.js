/**
 * Romantic Christmas "Ber Months" Surprise Website Logic
 * Instant, smooth, lag-free performance with zero frame drops.
 */

(() => {
  'use strict';

  // --- STATE MANAGEMENT ---
  const AppState = {
    currentScene: 'intro', // 'intro' | 'opening' | 'transitioning' | 'main' | 'final'
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
      musicIcon.textContent = '🔊';
      musicLabel.textContent = 'Music Playing 🎶';
      musicToggle.classList.add('bg-warmGold/20', 'border-warmGold');

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
      musicIcon.textContent = '🎵';
      musicLabel.textContent = 'Play Holiday Music';
      musicToggle.classList.remove('bg-warmGold/20', 'border-warmGold');
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

  // --- ULTRA LIGHTWEIGHT CANVAS ENGINE ---
  const initCanvas = () => {
    const resize = () => {
      fxCanvas.width = window.innerWidth;
      fxCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    fxCtx = fxCanvas.getContext('2d', { alpha: true });

    AppState.snowflakes = [];
    for (let i = 0; i < 35; i++) {
      AppState.snowflakes.push({
        x: Math.random() * fxCanvas.width,
        y: Math.random() * fxCanvas.height,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.9 + 0.5,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.02,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    startRenderLoop();
  };

  const startRenderLoop = () => {
    const loop = () => {
      renderScene();
      requestAnimationFrame(loop);
    };
    loop();
  };

  const renderScene = () => {
    if (!fxCtx) return;
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

  const spawnBurst = (x, y, count = 25, spread = 5, types = ['circle', 'star', 'heart']) => {
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
        size: Math.random() * 6 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: 0.025,
        type: type
      });
    }
  };

  // --- FAST, CRISP & LAG-FREE GIFT OPENING SEQUENCE ---
  const openGift = () => {
    if (AppState.currentScene !== 'intro') return;
    AppState.currentScene = 'opening';

    if (!AppState.isAudioPlaying) {
      ChristmasSynth.start();
    }
    playMagicalChime();

    giftClickBtn.disabled = true;
    giftClickBtn.classList.add('opacity-50', 'pointer-events-none');

    giftContainer.classList.add('gift-shaking');
    innerGiftGlow.classList.remove('opacity-0');
    innerGiftGlow.classList.add('opacity-100');

    setTimeout(() => {
      giftLid.classList.add('gift-lid-opening');
      const rect = giftContainer.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 3, 20, 6, ['star', 'circle', 'heart']);
    }, 200);

    setTimeout(() => {
      AppState.currentScene = 'transitioning';
      const rect = giftContainer.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, 8, ['star', 'heart']);

      flashOverlay.classList.remove('opacity-0');
      flashOverlay.classList.add('opacity-100');

      setTimeout(() => {
        sceneIntro.classList.add('hidden');
        sceneMain.classList.remove('hidden');

        sceneMain.classList.remove('opacity-0');
        sceneMain.classList.add('opacity-100');
        flashOverlay.classList.remove('opacity-100');
        flashOverlay.classList.add('opacity-0');
        restartBtn.classList.remove('hidden');

        // Smoothly animate Memory Photos into view
        if (memoryGallery) {
          setTimeout(() => {
            memoryGallery.classList.remove('opacity-0', 'translate-y-6');
            memoryGallery.classList.add('opacity-100', 'translate-y-0');
            const rect = memoryGallery.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + 30, 20, 4, ['star', 'heart']);
          }, 300);
        }

        // Smoothly display Man
        charMan.style.opacity = '1';
        charMan.style.transform = 'translateY(0px)';

        setTimeout(() => {
          showBubble(manBubble, 3500);
        }, 500);

        AppState.currentScene = 'main';
      }, 250);

    }, 450);
  };

  const triggerLoveLetterReveal = () => {
    if (hasLetterBeenRevealed) {
      messageCardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    hasLetterBeenRevealed = true;

    messageCardSection.classList.remove('opacity-0', 'translate-y-6');
    messageCardSection.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      messageCardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

    const lines = document.querySelectorAll('.letter-line');
    lines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.remove('opacity-0');
        line.classList.add('opacity-100');
      }, index * 80 + 100);
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

  // --- INTERACTION HANDLERS ---
  const initInteractions = () => {
    giftContainer.addEventListener('click', openGift);
    giftClickBtn.addEventListener('click', openGift);
    giftContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGift();
      }
    });

    charMan.addEventListener('click', () => {
      showBubble(manBubble, 3000);
      manHeartFloat.classList.remove('opacity-0');
      setTimeout(() => manHeartFloat.classList.add('opacity-0'), 1500);

      const rect = charMan.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + 30, 15, 4, ['heart', 'star']);
      playMagicalChime();

      triggerLoveLetterReveal();
    });

    xmasTree.addEventListener('click', () => {
      showBubble(treeBubble, 3000);
      const rect = xmasTree.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 3, 15, 4, ['star', 'circle']);
      playMagicalChime();
    });

    santaCharacter.addEventListener('click', () => {
      showBubble(santaBubble, 3000);
      const rect = santaCharacter.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + 30, 15, 4, ['star', 'heart']);
      playMagicalChime();
    });

    // Add particle burst when clicking photos in gallery
    document.querySelectorAll('.polaroid-card').forEach((card) => {
      card.addEventListener('click', () => {
        const rect = card.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, 5, ['heart', 'star']);
        playMagicalChime();
      });
    });

    finalSurpriseBtn.addEventListener('click', () => {
      AppState.currentScene = 'final';
      spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 40, 8, ['heart', 'star']);
      playMagicalChime();

      finalSurpriseModal.classList.remove('opacity-0', 'pointer-events-none');
      finalSurpriseModal.classList.add('opacity-100');
      finalSurpriseModal.querySelector('div').classList.remove('scale-90');
      finalSurpriseModal.querySelector('div').classList.add('scale-100');
    });

    closeFinalBtn.addEventListener('click', () => {
      finalSurpriseModal.classList.add('opacity-0', 'pointer-events-none');
      finalSurpriseModal.classList.remove('opacity-100');
      finalSurpriseModal.querySelector('div').classList.add('scale-90');
      finalSurpriseModal.querySelector('div').classList.remove('scale-100');
    });

    musicToggle.addEventListener('click', () => {
      ChristmasSynth.toggle();
    });

    restartBtn.addEventListener('click', () => {
      window.location.reload();
    });
  };

  const init = () => {
    initCanvas();
    initInteractions();
    console.log('✨ Ultra-Fast Christmas Surprise with Memory Gallery for BABE Ready! ❤️🎄');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
