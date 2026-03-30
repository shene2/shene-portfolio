/* ═══════════ CUSTOM CURSOR ═══════════ */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ═══════════ STAR CANVAS ═══════════ */
const canvas = document.getElementById('starCanvas');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

function initStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.2 + 0.2,
      a:    Math.random(),
      s:    (Math.random() - 0.5) * 0.005,
      blink: Math.random() * Math.PI * 2
    });
  }
}
initStars();

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.blink += 0.02;
    const alpha = (Math.sin(s.blink) * 0.4 + 0.6) * s.a;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(249,168,201,${alpha * 0.6})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

/* ═══════════ FALLING PETALS ═══════════ */
const petalContainer = document.getElementById('petals');
const PETAL_EMOJIS   = ['🌸', '🌸', '🌸', '✿', '❀'];

function spawnPetal() {
  const el = document.createElement('span');
  el.classList.add('petal');
  el.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];
  const size = Math.random() * 10 + 10;
  const left = Math.random() * 100;
  const dur  = Math.random() * 10 + 10;
  const del  = Math.random() * 5;
  el.style.cssText = `left:${left}%;font-size:${size}px;animation-duration:${dur}s;animation-delay:${del}s`;
  petalContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + del) * 1000 + 500);
}
setInterval(spawnPetal, 700);
for (let i = 0; i < 6; i++) spawnPetal();

/* ═══════════ SCROLL PROGRESS ═══════════ */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ═══════════ NAV SCROLL STATE ═══════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ═══════════ ACTIVE NAV ON SCROLL ═══════════ */
const navAs    = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const secObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => secObserver.observe(s));

/* ═══════════ MOBILE DRAWER ═══════════ */
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('drawer');
const overlay = document.getElementById('drawerOverlay');

function toggleDrawer() {
  const open = drawer.classList.toggle('open');
  overlay.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}
burger.addEventListener('click', toggleDrawer);

/* ═══════════ AOS — SCROLL REVEAL ═══════════ */
const aosEls = document.querySelectorAll('[data-aos]');

function initAOS() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.aosDelay || 0);
        setTimeout(() => e.target.classList.add('aos-animate'), delay);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  aosEls.forEach(el => observer.observe(el));
}
initAOS();

/* ═══════════ SKILL BAR ANIMATION ═══════════ */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animate'), i * 120);
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(c => barObserver.observe(c));

/* ═══════════ COUNTER ANIMATION ═══════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  let current  = 0;
  const step   = Math.ceil(target / 30);
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current + (target >= 10 ? '+' : '');
  }, 40);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.astat-n[data-count]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const aboutSection = document.querySelector('#about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ═══════════ PROJECT CARD SHINE ON HOVER ═══════════ */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
    card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s var(--ease)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s';
  });
});

/* ═══════════ SKILL CARD GLOW FOLLOW MOUSE ═══════════ */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--gx', x + 'px');
    card.style.setProperty('--gy', y + 'px');
    const glow = card.querySelector('.sk-glow');
    if (glow) { glow.style.top = (y - 75) + 'px'; glow.style.right = 'auto'; glow.style.left = (x - 75) + 'px'; }
  });
});