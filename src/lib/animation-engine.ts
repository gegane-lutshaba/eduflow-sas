/**
 * Animation Engine - Advanced visual effects and animations for the chatbot onboarding
 * Provides particle effects, morphing UI, and dynamic backgrounds
 */

export interface AnimationConfig {
  type: 'celebration' | 'thinking' | 'excitement' | 'encouragement' | 'achievement' | 'typing';
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  colors?: string[];
  position?: { x: number; y: number };
}

export interface ParticleConfig {
  count: number;
  colors: string[];
  shapes: ('circle' | 'star' | 'heart' | 'sparkle')[];
  velocity: { min: number; max: number };
  size: { min: number; max: number };
  lifetime: number;
  gravity?: number;
}

class AnimationEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrame: number | null = null;
  private isInitialized = false;

  // Initialize the animation engine
  initialize(canvasElement: HTMLCanvasElement): void {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.isInitialized = true;
    this.resizeCanvas();
    this.startAnimationLoop();

    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private startAnimationLoop(): void {
    const animate = () => {
      this.update();
      this.render();
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  // Main animation triggers
  triggerAnimation(config: AnimationConfig): void {
    if (!this.isInitialized) return;

    switch (config.type) {
      case 'celebration':
        this.createCelebrationEffect(config);
        break;
      case 'achievement':
        this.createAchievementEffect(config);
        break;
      case 'excitement':
        this.createExcitementEffect(config);
        break;
      case 'thinking':
        this.createThinkingEffect(config);
        break;
      case 'encouragement':
        this.createEncouragementEffect(config);
        break;
      case 'typing':
        this.createTypingEffect(config);
        break;
    }
  }

  // Celebration effect - confetti and sparkles
  private createCelebrationEffect(config: AnimationConfig): void {
    const particleConfig: ParticleConfig = {
      count: config.intensity === 'high' ? 100 : config.intensity === 'medium' ? 60 : 30,
      colors: config.colors || ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      shapes: ['circle', 'star', 'sparkle'],
      velocity: { min: 2, max: 8 },
      size: { min: 4, max: 12 },
      lifetime: 3000,
      gravity: 0.1
    };

    this.createParticleSystem(particleConfig, config.position);
    
    // Add screen shake effect
    this.createScreenShake(200, 2);
  }

  // Achievement effect - golden particles with glow
  private createAchievementEffect(config: AnimationConfig): void {
    const particleConfig: ParticleConfig = {
      count: 50,
      colors: ['#FFD700', '#FFA500', '#FFFF00', '#FFE55C'],
      shapes: ['star', 'sparkle'],
      velocity: { min: 1, max: 4 },
      size: { min: 6, max: 16 },
      lifetime: 4000,
      gravity: -0.05 // Float upward
    };

    this.createParticleSystem(particleConfig, config.position);
    this.createGlowEffect(config.position || { x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }

  // Excitement effect - energetic bursts
  private createExcitementEffect(config: AnimationConfig): void {
    const particleConfig: ParticleConfig = {
      count: 40,
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F'],
      shapes: ['circle', 'sparkle'],
      velocity: { min: 3, max: 10 },
      size: { min: 3, max: 8 },
      lifetime: 2000,
      gravity: 0.05
    };

    // Create multiple bursts
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createParticleSystem(particleConfig, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.6
        });
      }, i * 200);
    }
  }

  // Thinking effect - gentle floating bubbles
  private createThinkingEffect(config: AnimationConfig): void {
    const particleConfig: ParticleConfig = {
      count: 15,
      colors: ['#E8F4FD', '#B3E5FC', '#81D4FA', '#4FC3F7'],
      shapes: ['circle'],
      velocity: { min: 0.5, max: 2 },
      size: { min: 8, max: 20 },
      lifetime: 5000,
      gravity: -0.02 // Slow float upward
    };

    this.createParticleSystem(particleConfig, config.position);
  }

  // Encouragement effect - warm, supportive particles
  private createEncouragementEffect(config: AnimationConfig): void {
    const particleConfig: ParticleConfig = {
      count: 25,
      colors: ['#FFB6C1', '#FFA07A', '#98FB98', '#87CEEB'],
      shapes: ['heart', 'circle'],
      velocity: { min: 1, max: 3 },
      size: { min: 5, max: 12 },
      lifetime: 3500,
      gravity: -0.01
    };

    this.createParticleSystem(particleConfig, config.position);
  }

  // Typing effect - subtle indicators
  private createTypingEffect(config: AnimationConfig): void {
    const particleConfig: ParticleConfig = {
      count: 8,
      colors: ['#4ECDC4', '#45B7D1'],
      shapes: ['circle'],
      velocity: { min: 0.2, max: 1 },
      size: { min: 2, max: 4 },
      lifetime: 1500,
      gravity: 0
    };

    this.createParticleSystem(particleConfig, config.position);
  }

  // Core particle system
  private createParticleSystem(config: ParticleConfig, position?: { x: number; y: number }): void {
    const centerX = position?.x || window.innerWidth / 2;
    const centerY = position?.y || window.innerHeight / 2;

    for (let i = 0; i < config.count; i++) {
      const particle = new Particle({
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * (config.velocity.max - config.velocity.min) + config.velocity.min,
        vy: (Math.random() - 0.5) * (config.velocity.max - config.velocity.min) + config.velocity.min,
        size: Math.random() * (config.size.max - config.size.min) + config.size.min,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        shape: config.shapes[Math.floor(Math.random() * config.shapes.length)],
        lifetime: config.lifetime,
        gravity: config.gravity || 0
      });

      this.particles.push(particle);
    }
  }

  // Screen shake effect
  private createScreenShake(duration: number, intensity: number): void {
    const startTime = Date.now();
    const originalTransform = document.body.style.transform;

    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const currentIntensity = intensity * (1 - progress);
        
        const x = (Math.random() - 0.5) * currentIntensity;
        const y = (Math.random() - 0.5) * currentIntensity;
        
        document.body.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(shake);
      } else {
        document.body.style.transform = originalTransform;
      }
    };

    shake();
  }

  // Glow effect
  private createGlowEffect(position: { x: number; y: number }): void {
    if (!this.ctx) return;

    const glowElement = document.createElement('div');
    glowElement.style.position = 'fixed';
    glowElement.style.left = `${position.x - 50}px`;
    glowElement.style.top = `${position.y - 50}px`;
    glowElement.style.width = '100px';
    glowElement.style.height = '100px';
    glowElement.style.borderRadius = '50%';
    glowElement.style.background = 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0) 70%)';
    glowElement.style.pointerEvents = 'none';
    glowElement.style.zIndex = '1000';
    glowElement.style.animation = 'pulse 2s ease-in-out';

    document.body.appendChild(glowElement);

    setTimeout(() => {
      document.body.removeChild(glowElement);
    }, 2000);
  }

  // Update particles
  private update(): void {
    this.particles = this.particles.filter(particle => {
      particle.update();
      return particle.isAlive();
    });
  }

  // Render particles
  private render(): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      particle.render(this.ctx!);
    });
  }

  // Cleanup
  destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.particles = [];
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}

// Particle class
class Particle {
  private x: number;
  private y: number;
  private vx: number;
  private vy: number;
  private size: number;
  private color: string;
  private shape: string;
  private lifetime: number;
  private maxLifetime: number;
  private gravity: number;
  private alpha: number = 1;

  constructor(config: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    shape: string;
    lifetime: number;
    gravity: number;
  }) {
    this.x = config.x;
    this.y = config.y;
    this.vx = config.vx;
    this.vy = config.vy;
    this.size = config.size;
    this.color = config.color;
    this.shape = config.shape;
    this.lifetime = config.lifetime;
    this.maxLifetime = config.lifetime;
    this.gravity = config.gravity;
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    
    this.lifetime -= 16; // Assuming 60fps
    this.alpha = this.lifetime / this.maxLifetime;

    // Add some randomness to movement
    this.vx += (Math.random() - 0.5) * 0.1;
    this.vy += (Math.random() - 0.5) * 0.1;

    // Damping
    this.vx *= 0.99;
    this.vy *= 0.99;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;

    switch (this.shape) {
      case 'circle':
        this.renderCircle(ctx);
        break;
      case 'star':
        this.renderStar(ctx);
        break;
      case 'heart':
        this.renderHeart(ctx);
        break;
      case 'sparkle':
        this.renderSparkle(ctx);
        break;
    }

    ctx.restore();
  }

  private renderCircle(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderStar(ctx: CanvasRenderingContext2D): void {
    const spikes = 5;
    const outerRadius = this.size;
    const innerRadius = this.size * 0.5;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = this.x + Math.cos(angle) * radius;
      const y = this.y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  private renderHeart(ctx: CanvasRenderingContext2D): void {
    const size = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + size * 0.3);
    ctx.bezierCurveTo(this.x, this.y, this.x - size * 0.5, this.y, this.x - size * 0.5, this.y + size * 0.3);
    ctx.bezierCurveTo(this.x - size * 0.5, this.y + size * 0.6, this.x, this.y + size * 0.9, this.x, this.y + size);
    ctx.bezierCurveTo(this.x, this.y + size * 0.9, this.x + size * 0.5, this.y + size * 0.6, this.x + size * 0.5, this.y + size * 0.3);
    ctx.bezierCurveTo(this.x + size * 0.5, this.y, this.x, this.y, this.x, this.y + size * 0.3);
    ctx.fill();
  }

  private renderSparkle(ctx: CanvasRenderingContext2D): void {
    const size = this.size;
    ctx.beginPath();
    // Vertical line
    ctx.moveTo(this.x, this.y - size);
    ctx.lineTo(this.x, this.y + size);
    // Horizontal line
    ctx.moveTo(this.x - size, this.y);
    ctx.lineTo(this.x + size, this.y);
    // Diagonal lines
    ctx.moveTo(this.x - size * 0.7, this.y - size * 0.7);
    ctx.lineTo(this.x + size * 0.7, this.y + size * 0.7);
    ctx.moveTo(this.x + size * 0.7, this.y - size * 0.7);
    ctx.lineTo(this.x - size * 0.7, this.y + size * 0.7);
    
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  isAlive(): boolean {
    return this.lifetime > 0;
  }
}

// CSS animations for additional effects
export const injectAnimationStyles = (): void => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(0); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 0.4; }
      100% { transform: scale(0); opacity: 0; }
    }

    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0, -30px, 0); }
      70% { transform: translate3d(0, -15px, 0); }
      90% { transform: translate3d(0, -4px, 0); }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
      20%, 40%, 60%, 80% { transform: translateX(2px); }
    }

    @keyframes glow {
      0% { box-shadow: 0 0 5px currentColor; }
      50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
      100% { box-shadow: 0 0 5px currentColor; }
    }

    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }

    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInRight {
      0% { opacity: 0; transform: translateX(30px); }
      100% { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideInLeft {
      0% { opacity: 0; transform: translateX(-30px); }
      100% { opacity: 1; transform: translateX(0); }
    }

    .animate-bounce { animation: bounce 1s infinite; }
    .animate-pulse { animation: pulse 2s infinite; }
    .animate-shake { animation: shake 0.5s ease-in-out; }
    .animate-glow { animation: glow 2s ease-in-out infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
    .animate-slideInRight { animation: slideInRight 0.5s ease-out; }
    .animate-slideInLeft { animation: slideInLeft 0.5s ease-out; }

    .chat-bubble-morph {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chat-bubble-excited {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transform: scale(1.02);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .chat-bubble-thinking {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      animation: float 2s ease-in-out infinite;
    }

    .chat-bubble-celebration {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      animation: bounce 0.6s ease-in-out;
    }

    .neural-bg-animated {
      background: linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533483);
      background-size: 400% 400%;
      animation: gradientShift 15s ease infinite;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .particle-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    }
  `;
  document.head.appendChild(style);
};

export const animationEngine = new AnimationEngine();
