(function () {
  const root = document.documentElement;

  // Theme toggle
  const themeBtn = document.querySelector('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => root.dataset.theme || (prefersDark.matches ? 'dark' : 'light');

  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  const menuBtn = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  menuBtn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    })
  );

  // Highlight the nav link for the section in view
  const navMap = new Map();
  links.querySelectorAll('a[href^="#"]').forEach((a) => navMap.set(a.getAttribute('href').slice(1), a));
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navMap.forEach((a) => a.classList.remove('active'));
        const link = navMap.get(entry.target.id);
        if (link) link.classList.add('active');
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

  // Fade-in on scroll
  const revealTargets = document.querySelectorAll('.card, .pub, .skill-group, .stats li');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealTargets.forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
