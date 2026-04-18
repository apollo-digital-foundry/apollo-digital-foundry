// =========================================================
// Apollo Digital Foundry — Mission Control
// Live UTC clock, custom cursor, smooth scroll
// =========================================================

(() => {
  const pad = (n) => String(n).padStart(2, '0');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Live UTC clock ----------
  const clock = document.getElementById('utc-clock');
  if (clock) {
    const tick = () => {
      const d = new Date();
      clock.textContent =
        `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())} ` +
        `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
    };
    tick();
    setInterval(tick, 1000);
  }

  // ---------- Smooth anchor scroll + top ----------
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', href);
  });

  // ---------- Custom cursor ----------
  const cursor = document.querySelector('.cursor');
  const coords = document.querySelector('.cursor-coords');

  if (cursor && coords && !reducedMotion) {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.innerWidth <= 768;

    if (!isCoarse && !narrow) {
      let raf = 0;
      let pending = null;
      const fmt = (n) => String(Math.round(n)).padStart(4, '0');

      const onMove = (e) => {
        pending = e;
        if (!raf) {
          raf = requestAnimationFrame(() => {
            raf = 0;
            const ev = pending;
            cursor.classList.add('active');
            coords.classList.add('active');
            cursor.style.left = ev.clientX + 'px';
            cursor.style.top = ev.clientY + 'px';
            coords.style.left = ev.clientX + 'px';
            coords.style.top = ev.clientY + 'px';
            coords.textContent = `X:${fmt(ev.clientX)} Y:${fmt(ev.clientY)}`;
            const t = ev.target;
            const hovering = t && t.closest && t.closest('[data-hover], a, button, .project-row, .cta');
            cursor.classList.toggle('hover', !!hovering);
          });
        }
      };
      const onLeave = () => {
        cursor.classList.remove('active');
        coords.classList.remove('active');
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseleave', onLeave);
    }
  }
})();
