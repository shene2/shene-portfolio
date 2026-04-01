/* ═══════════ LOADER ═══════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    document.body.classList.remove('loading');
  }, 1800);
});

/* ═══════════ CUSTOM CURSOR ═══════════ */
const cursor     = document.getElementById('cursor');
const cursorDot  = cursor.querySelector('.cursor-dot');
const cursorRing = cursor.querySelector('.cursor-ring');
const cursorPetal = document.getElementById('cursorPetal');

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left  = mx + 'px';
  cursorDot.style.top   = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  cursorRing.style.left  = rx + 'px';
  cursorRing.style.top   = ry + 'px';
  cursorPetal.style.left = rx + 'px';
  cursorPetal.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

// Petal trail on click
document.addEventListener('click', e => {
  const el = document.createElement('div');
  el.textContent = ['🌸','🌷','✿','❀'][Math.floor(Math.random()*4)];
  el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    font-size:${14+Math.random()*10}px;pointer-events:none;z-index:9997;
    transform:translate(-50%,-50%);animation:clickPetal 0.8s forwards`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
});

// inject click petal keyframes
const ks = document.createElement('style');
ks.textContent = `@keyframes clickPetal{0%{opacity:1;transform:translate(-50%,-50%) scale(0.5)}50%{opacity:1;transform:translate(-50%,-100%) scale(1.2)}100%{opacity:0;transform:translate(-50%,-180%) scale(0.8) rotate(${Math.random()>0.5?'':'-'}40deg)}}`;
document.head.appendChild(ks);

/* ═══════════ AMBIENT PARTICLES CANVAS ═══════════ */
const canvas = document.getElementById('ambientCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); buildParticles(); });

function buildParticles() {
  particles = [];
  const n = Math.floor((W * H) / 7000);
  for (let i = 0; i < n; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.6 + 0.1,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      blink: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? '232,160,191' : '206,180,232',
    });
  }
}
buildParticles();

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.blink += 0.015;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    const alpha = (Math.sin(p.blink) * 0.3 + 0.6) * p.a;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ═══════════ BACKGROUND PETALS (HERO) ═══════════ */
const bgPetalContainer = document.getElementById('bgPetals');
const BG_PETALS = ['🌸','🌷','🌸','✿','🌸'];
for (let i = 0; i < 12; i++) {
  const el = document.createElement('div');
  el.className = 'hero-bg-petal';
  el.textContent = BG_PETALS[i % BG_PETALS.length];
  el.style.setProperty('--ps', (12 + Math.random() * 18) + 'px');
  el.style.setProperty('--pd', (8 + Math.random() * 10) + 's');
  el.style.setProperty('--pp', (Math.random() * 8) + 's');
  el.style.left  = (Math.random() * 100) + '%';
  el.style.top   = (Math.random() * 100) + '%';
  bgPetalContainer.appendChild(el);
}

/* ═══════════ NAV ═══════════ */
const nav = document.getElementById('nav');
const scrollRibbon = document.getElementById('scrollRibbon');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle('scrolled', scrolled > 50);
  scrollRibbon.style.width = ((scrolled / total) * 100) + '%';
}, { passive: true });

/* Active nav on scroll */
const allSections = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.nav-link');
const sectionObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.35 });
allSections.forEach(s => sectionObs.observe(s));

/* Mobile menu */
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
let menuOpen  = false;
function toggleMob() {
  menuOpen = !menuOpen;
  mobMenu.classList.toggle('open', menuOpen);
  burger.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}
function closeMob() {
  menuOpen = false;
  mobMenu.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}
burger.addEventListener('click', toggleMob);

/* ═══════════ REVEAL ON SCROLL ═══════════ */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.revealDelay || 0);
      setTimeout(() => e.target.classList.add('revealed'), delay);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ═══════════ COUNTER ANIMATION ═══════════ */
function runCounter(el) {
  const target = parseInt(el.dataset.count);
  let cur = 0;
  const step  = Math.ceil(target / 40);
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.querySelector('.avs-num').textContent = cur + (target >= 5 ? '+' : '');
    if (cur >= target) clearInterval(timer);
  }, 45);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { runCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.av-stat[data-count]').forEach(el => counterObs.observe(el));

/* ═══════════ PROJECT ITEM HOVER SILK ═══════════ */
document.querySelectorAll('.proj-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transition = 'background 0.4s';
  });
});

/* ═══════════ SKILL CARDS GLOW FOLLOW ═══════════ */
document.querySelectorAll('.sb-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    card.style.setProperty('--gx', x + '%');
    card.style.setProperty('--gy', y + '%');
  });
});

/* ═══════════ PARALLAX PHOTO ═══════════ */
const parallaxEl = document.querySelector('[data-scroll="parallax"]');
if (parallaxEl) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.12;
    parallaxEl.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

/* ═══════════ PHOTO FRAME MOUSE TILT ═══════════ */
const photoFrame = document.querySelector('.photo-frame');
if (photoFrame) {
  document.addEventListener('mousemove', e => {
    const rect = photoFrame.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / window.innerWidth;
    const dy   = (e.clientY - cy) / window.innerHeight;
    photoFrame.style.transform = `perspective(800px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;
  });
  photoFrame.addEventListener('mouseleave', () => {
    photoFrame.style.transform = '';
    photoFrame.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
  photoFrame.addEventListener('mouseenter', () => {
    photoFrame.style.transition = 'transform 0.15s';
  });
}

/* ═══════════ SMOOTH SECTION TRANSITIONS ═══════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeMob();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});