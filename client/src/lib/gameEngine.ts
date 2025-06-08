interface Bird {
  x: number;
  y: number;
  velocity: number;
  radius: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  gap: number;
  passed: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private bird: Bird;
  private pipes: Pipe[] = [];
  private onGameOver: () => void;
  private gravity = 0.5;
  private jumpForce = -12;
  private pipeSpeed = 2;
  private pipeGap = 150;
  private pipeWidth = 60;
  private lastPipeTime = 0;
  private pipeInterval = 1500; // ms

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, onGameOver: () => void) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onGameOver = onGameOver;
    this.bird = this.createBird();
  }

  private createBird(): Bird {
    return {
      x: this.canvas.width * 0.25,
      y: this.canvas.height * 0.5,
      velocity: 0,
      radius: 20,
    };
  }

  private createPipe(): Pipe {
    const minHeight = 50;
    const maxHeight = this.canvas.height - this.pipeGap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    return {
      x: this.canvas.width,
      topHeight,
      bottomHeight: this.canvas.height - topHeight - this.pipeGap,
      width: this.pipeWidth,
      gap: this.pipeGap,
      passed: false,
    };
  }

  private updateBird() {
    this.bird.velocity += this.gravity;
    this.bird.y += this.bird.velocity;
  }

  private updatePipes(currentTime: number) {
    // Add new pipes
    if (currentTime - this.lastPipeTime > this.pipeInterval) {
      this.pipes.push(this.createPipe());
      this.lastPipeTime = currentTime;
    }

    // Update pipe positions and remove off-screen pipes
    this.pipes = this.pipes.filter(pipe => {
      pipe.x -= this.pipeSpeed;
      return pipe.x + pipe.width > 0;
    });
  }

  private checkCollisions(): boolean {
    // Check ground and ceiling collision
    if (this.bird.y - this.bird.radius <= 0 || this.bird.y + this.bird.radius >= this.canvas.height) {
      return true;
    }

    // Check pipe collisions
    for (const pipe of this.pipes) {
      const birdLeft = this.bird.x - this.bird.radius;
      const birdRight = this.bird.x + this.bird.radius;
      const birdTop = this.bird.y - this.bird.radius;
      const birdBottom = this.bird.y + this.bird.radius;

      if (birdRight > pipe.x && birdLeft < pipe.x + pipe.width) {
        if (birdTop < pipe.topHeight || birdBottom > this.canvas.height - pipe.bottomHeight) {
          return true;
        }
      }
    }

    return false;
  }

  private drawBird() {
    const ctx = this.ctx;
    const bird = this.bird;

    // Draw bird body
    ctx.fillStyle = '#F59E0B'; // amber color
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw beak
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.radius, bird.y);
    ctx.lineTo(bird.x + bird.radius + 10, bird.y - 5);
    ctx.lineTo(bird.x + bird.radius + 10, bird.y + 5);
    ctx.closePath();
    ctx.fill();
  }

  private drawPipes() {
    const ctx = this.ctx;
    
    for (const pipe of this.pipes) {
      // Top pipe
      ctx.fillStyle = '#10B981'; // green color
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      
      // Bottom pipe
      ctx.fillRect(pipe.x, this.canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
      
      // Pipe caps
      ctx.fillStyle = '#059669'; // darker green
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
      ctx.fillRect(pipe.x - 5, this.canvas.height - pipe.bottomHeight, pipe.width + 10, 20);
    }
  }

  private render() {
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw game elements
    this.drawPipes();
    this.drawBird();
  }

  private gameLoop = (currentTime: number) => {
    this.updateBird();
    this.updatePipes(currentTime);
    
    if (this.checkCollisions()) {
      this.stop();
      this.onGameOver();
      return;
    }
    
    this.render();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  public start(gameState: any) {
    this.bird = this.createBird();
    this.pipes = [];
    this.lastPipeTime = 0;
    
    if (!this.animationId) {
      this.animationId = requestAnimationFrame(this.gameLoop);
    }
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public jump() {
    this.bird.velocity = this.jumpForce;
  }
}
