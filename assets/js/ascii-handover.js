/* Decorative pre-rendered ASCII handover. Mesh provenance: /assets/animations/README.md. */
(() => {
  const art = document.querySelector('.ascii-handover');
  const toggle = document.querySelector('.ascii-motion-toggle');
  const intro = document.querySelector('.home-intro');
  if (!art || !toggle || !intro) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frames;
  let loading;
  let index = 28;
  let interval = 125;
  let paused = reducedMotion.matches;
  let visible = true;
  let request;
  let previous = 0;

  const label = () => {
    toggle.textContent = paused ? 'Play background' : 'Pause background';
    toggle.setAttribute('aria-label', paused ? 'Play ASCII background animation' : 'Pause ASCII background animation');
    toggle.setAttribute('aria-pressed', String(!paused));
  };
  const stop = () => {
    cancelAnimationFrame(request);
    request = undefined;
    previous = 0;
  };
  const draw = time => {
    if (!previous) previous = time;
    if (time - previous >= interval) {
      index = (index + 1) % frames.length;
      art.textContent = frames[index];
      previous = time - ((time - previous) % interval);
    }
    request = requestAnimationFrame(draw);
  };
  const sync = () => {
    stop();
    if (frames && !paused && visible && !document.hidden) request = requestAnimationFrame(draw);
  };
  const load = async () => {
    if (!loading) loading = fetch(art.dataset.framesUrl).then(response => {
      if (!response.ok) throw new Error('Animation unavailable');
      return response.json();
    }).then(data => {
      if (!Number.isFinite(data.fps) || data.fps < 1 || data.fps > 12 || !Array.isArray(data.frames) || !data.frames.length || !data.frames.every(frame => typeof frame === 'string')) throw new Error('Invalid animation');
      frames = data.frames;
      interval = 1000 / data.fps;
      index = data.poster || 0;
      art.textContent = frames[index];
      toggle.hidden = false;
      label();
      sync();
    }).catch(() => { toggle.hidden = true; }); // Keep the inline static pose if loading fails.
    return loading;
  };

  toggle.addEventListener('click', () => {
    paused = !paused;
    label();
    if (!frames) load();
    sync();
  });
  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    label();
    if (!paused && visible) load();
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !paused) load();
      sync();
    }).observe(intro);
  } else if (!paused) load();
  // Reduced-motion users receive the static handover pose without fetching frames.
  if (paused) {
    label();
    toggle.hidden = false;
  }
})();
