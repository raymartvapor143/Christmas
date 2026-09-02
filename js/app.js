/**
 * Romantic Christmas "Ber Months" Surprise Website Logic
 * Handles animations, audio synthesis, memory gallery, and responsive letter revealing.
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
  const galaxyPhotoOverlay = document.getElementById('galaxyPhotoOverlay');

  let fxCtx = null;
  let hasLetterBeenRevealed = false;

  // --- CELESTIAL SOUND SYNTHESIZER FOR GALAXY ---
  const CosmicSynth = {
    playChord() {
      if (!AppState.audioCtx) ChristmasSynth.init();
      if (!AppState.audioCtx) return;
      const freqs = [329.63, 493.88, 659.25, 987.77, 1318.51]; // E major ethereal shimmer
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

    // Camera & Orbit Angles
    pitch: 0.48, // Tilt angle of the galaxy disc
    yaw: 0,      // Continuous rotation
    zoom: 1.0,
    speedMultiplier: 1.0,

    // Interactive Dragging
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    autoRotateSpeed: 0.0035,

    // Data Collections
    galaxyParticles: [],
    heartBeamParticles: [],
    orbitingTexts: [],
    orbitingMemories: [],
    shootingStars: [],
    supernovas: [],

    // Memory Image Objects
    loadedImages: [],

    init() {
      this.canvas = galaxyCanvas;
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

    // 1. Build Multi-Arm Spiral Galaxy Particles (Pink, Magenta, Violet, Warm Gold)
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
        
        // Non-linear distribution: dense core, sprawling arms
        const distRatio = Math.pow(Math.random(), 1.6);
        const distance = distRatio * maxRadius + 25;
        const angle = armOffset + distance * 0.006 + (Math.random() - 0.5) * armSpread;

        const x = Math.cos(angle) * distance + (Math.random() - 0.5) * (distance * 0.15);
        const z = Math.sin(angle) * distance + (Math.random() - 0.5) * (distance * 0.15);
        // Vertical thickness (galaxy disk is thicker at center, thinner at edges)
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

      // Galactic Central Black Hole / Glowing Core Sparkles
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

    // 2. Build Love Heart Particle Constellation Beam (Rising from center of galaxy)
    buildHeartBeamParticles() {
      this.heartBeamParticles = [];
      const heartCount = window.innerWidth < 768 ? 400 : 700;
      const heartScale = window.innerWidth < 768 ? 7.5 : 12;

      // Parametric 3D Heart Curve:
      // x = 16 sin^3(t)
      // y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))
      for (let i = 0; i < heartCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3) * heartScale;
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * heartScale;
        // Heart altitude above the galactic plane
        const baseElevation = -(window.innerHeight < 700 ? 150 : 220);

        // Add stardust interior fill & outline glitter
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

      // Add Glittering Light Beam Stream from Galaxy Core to Heart
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

    // 3. Build Orbiting 3D Text Billboards (Matching reference image + custom romantic messages)
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

    // 4. Touch & Mouse Orbit Controls (Rotate 3D Universe Smoothly)
    initOrbitControls() {
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

        // Clamp pitch to prevent inverted perspective
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

      // Mouse Wheel Zoom
      this.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY * -0.0012;
        this.zoom = Math.max(0.6, Math.min(1.8, this.zoom + zoomDelta));
      }, { passive: false });

      // Click to spawn Supernova
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

    // 5. 3D Coordinate Projection with Pitch, Yaw, and Zoom
    project3D(x, y, z, cx, cy) {
      // 1. Yaw rotation (around Y axis)
      const cosYaw = Math.cos(this.yaw);
      const sinYaw = Math.sin(this.yaw);
      const x1 = x * cosYaw - z * sinYaw;
      const z1 = x * sinYaw + z * cosYaw;

      // 2. Pitch rotation (around X axis)
      const cosPitch = Math.cos(this.pitch);
      const sinPitch = Math.sin(this.pitch);
      const y2 = y * cosPitch - z1 * sinPitch;
      const z2 = y * sinPitch + z1 * cosPitch;

      // Perspective Projection
      const fov = 750 * this.zoom;
      const distance = 850 + z2;
      if (distance <= 10) return null;

      const scale = fov / distance;
      const projX = cx + x1 * scale;
      const projY = cy + y2 * scale;

      return { x: projX, y: projY, scale: scale, depth: z2 };
    },

    // 6. Main Render Loop
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
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const cx = w / 2;
      // Position center slightly below middle for grand perspective
      const cy = h * 0.58;

      // Clear dark background with subtle persistence
      ctx.fillStyle = '#030008';
      ctx.fillRect(0, 0, w, h);

      // Auto Orbit Yaw
      this.yaw += this.autoRotateSpeed * this.speedMultiplier;

      // Render Deep Space Background Shooting Stars
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

      // Draw Shooting Stars
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

      // Collect Billboards & Elements to sort by 3D Depth
      const depthQueue = [];

      // A. Galaxy Particles Projection
      const now = performance.now() * 0.001;
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

      // B. Love Heart Beam Particles Projection
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

      // C. Orbiting Romantic Love Texts
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

      // D. Orbiting Memory Polaroid Billboards
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

      // Sort depthQueue back-to-front (largest depth rendered first)
      depthQueue.sort((a, b) => b.depth - a.depth);

      // Draw Center Accretion Ring & Core Glow before foreground elements
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

        // Dark Singularity Eye Center (as seen in the reference)
        ctx.fillStyle = '#05000a';
        ctx.beginPath();
        ctx.arc(coreProj.x, coreProj.y, 14 * coreProj.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5 * coreProj.scale;
        ctx.stroke();
      }

      // RENDER ALL 3D ELEMENTS IN DEPTH ORDER
      for (let i = 0; i < depthQueue.length; i++) {
        const item = depthQueue[i];

        if (item.type === 'particle' || item.type === 'heartParticle') {
          ctx.globalAlpha = Math.min(1.0, Math.max(0, item.alpha));
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(item.x, item.y, Math.max(0.6, item.size), 0, Math.PI * 2);
          ctx.fill();

          if (item.type === 'heartParticle' && item.scale > 0.8) {
            // Heart particle glow halo
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

          // Glowing text drop shadow
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

          // Polaroid Card Outer Glass Body
          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
          ctx.strokeStyle = 'rgba(255, 107, 180, 0.8)';
          ctx.lineWidth = 1.5 * item.scale;
          ctx.shadowColor = 'rgba(255, 107, 180, 0.7)';
          ctx.shadowBlur = 12 * item.scale;

          // Rounded Rectangle
          ctx.beginPath();
          ctx.roundRect(cardX, cardY, cardW, cardH, 6 * item.scale);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Draw Photo
          const pad = 4 * item.scale;
          const imgH = 46 * item.scale;
          try {
            ctx.drawImage(item.img, cardX + pad, cardY + pad, cardW - pad * 2, imgH);
          } catch (e) {}

          // Polaroid caption text
          ctx.fillStyle = '#102a43';
          ctx.font = `bold ${Math.max(6, 7 * item.scale)}px 'Outfit', sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(item.title, item.x, cardY + cardH - 5 * item.scale);
        }
      }

      ctx.globalAlpha = 1.0;

      // Render Supernova Particle Explosions (2D Screen overlay)
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

  // Reveal Glassmorphic Love Letter ONLY When the Man is Tapped
  const triggerLoveLetterReveal = () => {
    // Unhide the section container if not yet displayed
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

  // --- TRANSITION INTO GALAXY LOVE UNIVERSE SCENE ---
  const enterGalaxyScene = () => {
    AppState.currentScene = 'galaxy';

    // Hide Christmas Scenes Smoothly
    sceneMain.classList.add('opacity-0');
    finalSurpriseModal.classList.add('opacity-0', 'pointer-events-none');
    finalSurpriseModal.classList.remove('opacity-100');

    // Show Galaxy Scene with Flash & Chime
    flashOverlay.classList.remove('opacity-0');
    flashOverlay.classList.add('opacity-100');

    CosmicSynth.playChord();

    setTimeout(() => {
      sceneMain.classList.add('hidden');
      sceneGalaxy.classList.remove('hidden');
      sceneGalaxy.classList.remove('opacity-0');
      sceneGalaxy.classList.add('opacity-100');

      GalaxyEngine.init();
      GalaxyEngine.start();

      flashOverlay.classList.remove('opacity-100');
      flashOverlay.classList.add('opacity-0');

      // Initial Galaxy Supernova celebration
      setTimeout(() => {
        GalaxyEngine.spawnSupernova(window.innerWidth / 2, window.innerHeight * 0.45);
      }, 400);
    }, 400);
  };

  // Return to Christmas Scene
  const returnToChristmasScene = () => {
    AppState.currentScene = 'main';
    GalaxyEngine.stop();

    sceneGalaxy.classList.add('opacity-0');
    flashOverlay.classList.remove('opacity-0');
    flashOverlay.classList.add('opacity-100');

    setTimeout(() => {
      sceneGalaxy.classList.add('hidden');
      sceneMain.classList.remove('hidden');
      sceneMain.classList.remove('opacity-0');
      sceneMain.classList.add('opacity-100');

      flashOverlay.classList.remove('opacity-100');
      flashOverlay.classList.add('opacity-0');
    }, 350);
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

    // MAN CLICK TRIGGER -> REVEALS AND SCROLLS TO LOVE LETTER
    charMan.addEventListener('click', () => {
      showBubble(manBubble, 3000);
      manHeartFloat.classList.remove('opacity-0');
      setTimeout(() => manHeartFloat.classList.add('opacity-0'), 1500);

      const rect = charMan.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + 20, 15, 4, ['heart', 'star']);
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
      spawnBurst(rect.left + rect.width / 2, rect.top + 20, 15, 4, ['star', 'heart']);
      playMagicalChime();
    });

    document.querySelectorAll('.polaroid-card').forEach((card) => {
      card.addEventListener('click', () => {
        const rect = card.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15, 4, ['heart', 'star']);
        playMagicalChime();
      });
    });

    // Final Surprise Button in Love Letter -> Opens Climax Modal
    finalSurpriseBtn.addEventListener('click', () => {
      AppState.currentScene = 'final';
      spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 35, 7, ['heart', 'star']);
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

    // Galaxy Navigation Triggers
    enterGalaxyBtn.addEventListener('click', enterGalaxyScene);
    galaxyBackBtn.addEventListener('click', returnToChristmasScene);
    goToGalaxyNavBtn.addEventListener('click', enterGalaxyScene);

    // Galaxy Controls: Orbit Speed Toggle
    let speedLevel = 1;
    galaxySpeedBtn.addEventListener('click', () => {
      speedLevel = (speedLevel + 1) % 3;
      if (speedLevel === 0) {
        GalaxyEngine.speedMultiplier = 0.4;
        galaxySpeedLabel.textContent = 'Slow Orbit 🐢';
      } else if (speedLevel === 1) {
        GalaxyEngine.speedMultiplier = 1.0;
        galaxySpeedLabel.textContent = 'Normal Speed ⚡';
      } else {
        GalaxyEngine.speedMultiplier = 2.2;
        galaxySpeedLabel.textContent = 'Warp Speed 🚀';
      }
    });

    // Galaxy Supernova Button
    galaxyBurstBtn.addEventListener('click', () => {
      GalaxyEngine.spawnSupernova(window.innerWidth / 2, window.innerHeight * 0.45);
    });

    // Add Love Message on the fly into Orbit
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
    console.log('✨ Responsive Christmas & Galaxy Love Universe Ready! ❤️🌌');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
