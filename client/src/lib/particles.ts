export function createParticles(x: number, y: number) {
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }> = [];

  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10;
    const speed = 2 + Math.random() * 2;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
    });
  }

  return particles;
}

export function updateParticles(
  ctx: CanvasRenderingContext2D,
  particles: ReturnType<typeof createParticles>
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
    ctx.fill();
  }

  return particles.length > 0;
}
