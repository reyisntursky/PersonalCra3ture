/* ── script.js ─────────────────────────────────────── */
'use strict';

// ─── Theme Toggle (logo click) ─────────────────────
const html        = document.documentElement;
const logoToggle  = document.getElementById('logoToggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Initialise from saved or system preference
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || preferred);
})();

logoToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ─── Header shadow on scroll ────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── Modal helpers ──────────────────────────────────
function openModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Close when clicking outside the modal card
  overlay.addEventListener('click', function handler(e) {
    if (e.target === overlay) {
      closeModal(overlayId);
      overlay.removeEventListener('click', handler);
    }
  });
}

function closeModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('enquireOverlay');
    closeModal('cvOverlay');
  }
});

// ─── Enquire modal ──────────────────────────────────
document.getElementById('openEnquire').addEventListener('click', () => openModal('enquireOverlay'));
document.getElementById('closeEnquire').addEventListener('click', () => closeModal('enquireOverlay'));

document.getElementById('enquireForm').addEventListener('submit', (e) => {
  e.preventDefault();
  // Placeholder: show brief confirmation then close
  const btn = e.currentTarget.querySelector('.btn-send');
  btn.style.background = '#3ecc00';
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#1a2a00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>`;
  setTimeout(() => {
    closeModal('enquireOverlay');
    e.currentTarget.reset();
    btn.style.background = '';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#1a2a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
  }, 1200);
});

// ─── CV modal ───────────────────────────────────────
document.getElementById('openCV').addEventListener('click', () => openModal('cvOverlay'));
document.getElementById('closeCV').addEventListener('click', () => closeModal('cvOverlay'));

document.getElementById('cvYes').addEventListener('click', () => {
  setTimeout(() => closeModal('cvOverlay'), 200);
});

// ─── Float wrap + Scroll-reveal ───────────────────────
// Varied float settings so cards feel independent
const floatVariants = [
  { dur: '3.6s', delay: '0s'    },
  { dur: '4.3s', delay: '-1.4s' },
  { dur: '3.9s', delay: '-0.8s' },
  { dur: '4.7s', delay: '-2.2s' },
  { dur: '3.3s', delay: '-1.9s' },
  { dur: '4.1s', delay: '-0.3s' },
];

const cards = document.querySelectorAll('.work-card');

cards.forEach((card, i) => {
  const v = floatVariants[i % floatVariants.length];

  // Create float wrapper
  const wrap = document.createElement('div');
  wrap.className = 'float-wrap';
  wrap.style.setProperty('--float-dur',   v.dur);
  wrap.style.setProperty('--float-delay', v.delay);

  // Insert wrapper then move card into it
  card.parentNode.insertBefore(wrap, card);
  wrap.appendChild(card);
});

// Scroll-reveal on float-wrappers
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.float-wrap').forEach(w => revealObserver.observe(w));

// Section labels still get simple reveal
const labelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      labelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section-label').forEach(el => {
  el.classList.add('reveal');
  labelObserver.observe(el);
});
