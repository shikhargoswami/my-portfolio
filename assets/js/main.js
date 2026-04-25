/* ── THEME TOGGLE ─────────────────────────────────────────────── */
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (toggle) {
      toggle.innerHTML = t === 'dark' ? sunSVG : moonSVG;
      toggle.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} mode`);
    }
  }
  applyTheme(theme);
  if (toggle) toggle.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; applyTheme(theme); });
})();

/* ── LUCIDE ICONS ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

/* ── NAV: HIDE ON SCROLL DOWN ─────────────────────────────────── */
const header = document.getElementById('header');
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (header) {
    header.classList.toggle('header--hidden', y > lastScrollY && y > 100);
    header.classList.toggle('header--scrolled', y > 10);
  }
  lastScrollY = y;
}, { passive: true });

/* ── MOBILE HAMBURGER ─────────────────────────────────────────── */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('open', !open);
    hamburger.innerHTML = !open
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  });
  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── ACTIVE NAV LINK ON SCROLL ────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--color-primary)' : '';
      });
    }
  });
}, observerOpts);
sections.forEach(s => sectionObserver.observe(s));

/* ── RESUME TABS ──────────────────────────────────────────────── */
const tabs   = document.querySelectorAll('.resume-tab');
const panels = document.querySelectorAll('.resume-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`panel-${target}`)?.classList.add('active');
  });
});

/* ── SCROLL REVEAL (without GSAP dependency) ──────────────────── */
const revealEls = document.querySelectorAll(
  '.project-card, .skill-card, .blog-card, .resume-item, .stat-card, .contact-link'
);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.06}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s`;
  revealObserver.observe(el);
});

/* ── CONTACT FORM ─────────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    // Replace with your Formspree/EmailJS endpoint
    setTimeout(() => {
      btn.textContent = '✓ Sent! I\'ll be in touch.';
      contactForm.reset();
    }, 1200);
  });
}

/* ── GSAP (optional — loads if available) ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-tag',     { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.from('.hero-heading', { opacity: 0, y: 40, duration: 1.0, ease: 'power3.out', delay: 0.25 });
  gsap.from('.hero-sub',     { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.45 });
  gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.6 });
});
