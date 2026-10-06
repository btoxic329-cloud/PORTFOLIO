// Ahmad Mujtaba Portfolio — responsive interactions and lightweight 3D background
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-link');

function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});
navItems.forEach(link => link.addEventListener('click', closeMenu));
document.querySelectorAll('.nav-cta').forEach(link => link.addEventListener('click', closeMenu));
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal elements as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Keep the current navigation item in sync with the visible section.
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

// Lightweight animated 3D particle field. It is drawn on Canvas so it works without
// a large 3D library and remains smooth on phones and laptops.
(() => {
  const canvas = document.getElementById('scene-canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1, particles = [], frame = 0;
  const pointer = { x: 0, y: 0, active: false };
  const particleCount = () => window.innerWidth < 600 ? 55 : window.innerWidth < 1000 ? 85 : 115;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: particleCount() }, () => ({
      x: (Math.random() - .5) * width * 1.5,
      y: (Math.random() - .5) * height * 1.5,
      z: Math.random() * 900 + 100,
      size: Math.random() * 1.6 + .35,
      drift: (Math.random() - .5) * .18
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const cx = width * .5 + (pointer.active ? (pointer.x - width / 2) * .025 : 0);
    const cy = height * .48 + (pointer.active ? (pointer.y - height / 2) * .025 : 0);
    const projected = [];

    particles.forEach(p => {
      p.z -= reducedMotion ? 0 : .42;
      p.x += p.drift;
      if (p.z < 90) {
        p.z = 1000;
        p.x = (Math.random() - .5) * width * 1.5;
        p.y = (Math.random() - .5) * height * 1.5;
      }
      const scale = 420 / p.z;
      const x = cx + p.x * scale;
      const y = cy + p.y * scale;
      if (x > -20 && x < width + 20 && y > -20 && y < height + 20) {
        projected.push({ x, y, r: Math.max(.35, p.size * scale), z: p.z });
      }
    });

    // Fine connecting lines create depth without overwhelming the content.
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i], b = projected[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 105) {
          const alpha = (1 - dist / 105) * .11;
          ctx.strokeStyle = `rgba(130, 157, 239, ${alpha})`;
          ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    projected.forEach(p => {
      const alpha = Math.max(.12, (1 - p.z / 1100) * .7);
      ctx.fillStyle = p.z < 400 ? `rgba(111, 224, 241, ${alpha})` : `rgba(173, 163, 255, ${alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    frame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', event => {
    pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (!reducedMotion) draw();
  });
  resize();
  if (!reducedMotion) draw();
  else {
    // Static rendering for users who prefer reduced motion.
    particles.forEach(p => { p.z = 600; });
    draw();
    cancelAnimationFrame(frame);
  }
})();
