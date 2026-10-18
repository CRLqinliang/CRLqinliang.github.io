/* Decorative ASCII manipulation playlist. Model provenance: /assets/animations/README.md. */
(() => {
  const art = document.querySelector('.ascii-handover');
  const toggle = document.querySelector('.ascii-motion-toggle');
  const intro = document.querySelector('.home-intro');
  if (!art || !toggle || !intro) return;
  const sceneLayer = document.querySelector('.ascii-scene') || art;
  const caption = document.querySelector('.ascii-scene-caption');
  let scenes = [{ title: 'Handover', url: art.dataset.framesUrl }];
  try {
    const configured = JSON.parse(document.querySelector('#ascii-scenes').textContent);
    if (Array.isArray(configured) && configured.length && configured.every(scene => typeof scene.title === 'string' && typeof scene.url === 'string')) scenes = configured;
  } catch (e) { /* The inline handover remains a valid standalone fallback. */ }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const playbackRate = 1.5;
  const cache = new Map();
  let current;
  let sceneIndex = 0;
  let next;
  let prefetching = false;
  let loading;
  let index = 28;
  let paused = reducedMotion.matches;
  let visible = true;
  let request;
  let previous = 0;

  const label = () => {
    toggle.textContent = paused ? 'Play background' : 'Pause background';
    toggle.setAttribute('aria-label', paused ? 'Play ASCII background animation' : 'Pause ASCII background animation');
    toggle.setAttribute('aria-pressed', String(!paused));
  };
  const render = () => {
    if (!current) return;
    art.textContent = current.frames[index];
    // Fade only the artwork, keeping all introduction text stationary and readable.
    const fade = Math.min(4, Math.floor(current.frames.length / 3));
    sceneLayer.style.opacity = paused || scenes.length === 1 ? '1' : String(Math.min(1, index / fade, (current.frames.length - 1 - index) / fade));
  };
  const loadClip = id => {
    if (!cache.has(id)) cache.set(id, fetch(scenes[id].url).then(response => {
      if (!response.ok) throw new Error('Animation unavailable');
      return response.json();
    }).then(data => {
      if (!Number.isFinite(data.fps) || data.fps < 1 || data.fps > 12 || !Array.isArray(data.frames) || data.frames.length < 3 || !data.frames.every(frame => typeof frame === 'string')) throw new Error('Invalid animation');
      return data;
    }).catch(() => null));
    return cache.get(id);
  };
  const prefetchNext = async () => {
    if (prefetching || next || scenes.length < 2 || paused || !visible || document.hidden) return;
    prefetching = true;
    // Fetch just the next available scene; a failed vignette cannot stall the loop.
    for (let offset = 1; offset < scenes.length; offset++) {
      const id = (sceneIndex + offset) % scenes.length;
      const clip = await loadClip(id);
      if (clip) { next = { clip, id }; break; }
    }
    prefetching = false;
  };
  const activate = (clip, id, initial = false) => {
    current = clip;
    sceneIndex = id;
    index = initial && Number.isInteger(clip.poster) && clip.poster >= 0 && clip.poster < clip.frames.length ? clip.poster : 0;
    art.dataset.scene = scenes[id].title;
    if (caption) caption.textContent = scenes[id].title;
    render();
    prefetchNext();
  };
  const stop = () => {
    cancelAnimationFrame(request);
    request = undefined;
    previous = 0;
  };
  const draw = time => {
    if (!previous) previous = time;
    const interval = 1000 / (current.fps * playbackRate);
    if (time - previous >= interval) {
      if (index === current.frames.length - 1 && next) {
        const incoming = next;
        next = undefined;
        activate(incoming.clip, incoming.id);
      } else {
        index = (index + 1) % current.frames.length;
        render();
      }
      previous = time - ((time - previous) % interval);
    }
    request = requestAnimationFrame(draw);
  };
  const sync = () => {
    stop();
    render(); // A paused transition always shows a fully visible static pose.
    if (current && !paused && visible && !document.hidden) {
      prefetchNext();
      request = requestAnimationFrame(draw);
    }
  };
  const load = () => {
    if (!loading) loading = loadClip(0).then(clip => {
      if (!clip) { toggle.hidden = true; return; }
      activate(clip, 0, true);
      toggle.hidden = false;
      label();
      sync();
    });
    return loading;
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    label();
    if (!current) load();
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
  if (paused) {
    label();
    toggle.hidden = false;
  }
})();
