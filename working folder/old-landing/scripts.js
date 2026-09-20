// Auto-fit the "Coming Soon" text to fill both the width and height of .hero-box,
// allowing natural wrapping (no forced line breaks). Keeps per-letter animation intact.

(function fitTitleToBox() {
  const box = document.querySelector('.hero-box');
  const title = document.querySelector('.big-title'); // <h1>

  if (!box || !title) return;

  const MAX_ITER = 18;        // binary search steps
  const EPS = 0.5;            // px precision
  const MIN_FS = 4;           // px
  const MAX_FS = 2000;        // px ceiling to explore

  function getRect(el) {
    // Use scroll size to catch overflow beyond client box
    return { w: el.scrollWidth, h: el.scrollHeight };
  }

  function fit() {
    // Reset any transforms so measurements are honest
    title.style.transform = 'none';

    const boxRect = box.getBoundingClientRect();
    const targetW = boxRect.width;
    const targetH = boxRect.height;

    // Binary search font-size so both width and height fit simultaneously.
    let lo = MIN_FS, hi = MAX_FS, best = MIN_FS;

    for (let i = 0; i < MAX_ITER; i++) {
      const mid = (lo + hi) / 2;
      title.style.fontSize = mid + 'px';

      // Force reflow and measure
      const r = getRect(title);

      const fits = (r.w <= targetW + EPS) && (r.h <= targetH + EPS);

      if (fits) {
        best = mid;      // try bigger
        lo = mid + EPS;
      } else {
        hi = mid - EPS;  // too big, go smaller
      }
    }

    // Apply the best size found
    title.style.fontSize = best + 'px';
  }

  const runFit = () => {
    // Allow font loading to settle for accurate metrics
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    } else {
      // Fallback
      setTimeout(fit, 0);
    }
  };

  // Initial fit
  runFit();

  // Refit on resize / orientation / viewport changes
  let rAF;
  const schedule = () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(runFit);
  };

  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);

  // Also refit when container changes size
  const ro = new ResizeObserver(schedule);
  ro.observe(box);

  // Refit if device pixel ratio changes (zoom)
  let dpr = window.devicePixelRatio;
  setInterval(() => {
    if (window.devicePixelRatio !== dpr) {
      dpr = window.devicePixelRatio;
      schedule();
    }
  }, 800);
})();
