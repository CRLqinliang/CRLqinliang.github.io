(() => {
  const button = document.querySelector('.theme-switch');
  if (button) {
    button.hidden = false;
    const updateLabel = () => button.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    updateLabel();
    button.addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem('robotics-theme', theme); } catch (e) {}
      updateLabel();
    });
  }

  const viewer = document.querySelector('.image-viewer');
  if (viewer && typeof viewer.showModal === 'function') {
    const image = viewer.querySelector('.image-viewer-image');
    const caption = viewer.querySelector('.image-viewer-caption');
    const original = viewer.querySelector('.image-viewer-original');
    const zoom = viewer.querySelector('.image-viewer-zoom');
    const canvas = viewer.querySelector('.image-viewer-canvas');
    const resetZoom = () => {
      viewer.classList.remove('image-viewer--actual');
      zoom.setAttribute('aria-pressed', 'false');
      zoom.textContent = 'Actual size';
      canvas.scrollTo(0, 0);
    };
    zoom.hidden = false;
    zoom.addEventListener('click', () => {
      const actual = viewer.classList.toggle('image-viewer--actual');
      zoom.setAttribute('aria-pressed', String(actual));
      zoom.textContent = actual ? 'Fit to window' : 'Actual size';
      canvas.scrollTo(0, 0);
    });
    let opener;
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || !link.querySelector('img') || !/\.(png|jpe?g|webp|gif|svg)(?:[?#]|$)/i.test(link.href)) return;
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      resetZoom();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      caption.textContent = image.alt;
      original.href = link.dataset.originalHref || link.href;
      viewer.showModal();
    });
    viewer.addEventListener('click', event => {
      if (event.target === viewer) viewer.close();
    });
    viewer.addEventListener('close', () => {
      if (viewer.open) return;
      resetZoom();
      image.removeAttribute('src');
      if (opener) opener.focus({ preventScroll: true });
    });
  }

  const videoViewer = document.querySelector('.video-viewer');
  if (videoViewer && typeof videoViewer.showModal === 'function') {
    const player = videoViewer.querySelector('video');
    const title = videoViewer.querySelector('h2');
    let opener;
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || link.origin !== location.origin || !/\.mp4$/i.test(link.pathname) || link.hasAttribute('download')) return;
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      title.textContent = link.textContent.trim() || 'Video preview';
      player.setAttribute('aria-label', link.getAttribute('aria-label') || title.textContent);
      player.src = link.href;
      videoViewer.showModal();
      player.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
    });
    videoViewer.addEventListener('click', event => {
      const bounds = videoViewer.getBoundingClientRect();
      if (event.target === videoViewer && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) videoViewer.close();
    });
    videoViewer.addEventListener('close', () => {
      player.pause();
      player.removeAttribute('src');
      player.load();
      if (opener) opener.focus({ preventScroll: true });
    });
  }

  const track = document.querySelector('.gripper-projects');
  const navigation = document.querySelector('.gripper-navigation');
  if (track && navigation) {
    const cards = [...track.querySelectorAll('.gripper-project')];
    const previous = navigation.querySelector('.gripper-previous');
    const next = navigation.querySelector('.gripper-next');
    const position = navigation.querySelector('.gripper-position');
    let frame;
    const currentIndex = () => {
      const left = track.getBoundingClientRect().left;
      return cards.reduce((best, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? index : best, 0);
    };
    const update = () => {
      const index = currentIndex();
      previous.disabled = index === 0;
      next.disabled = index === cards.length - 1;
      position.textContent = `${index + 1} / ${cards.length}`;
    };
    const move = direction => {
      const index = Math.max(0, Math.min(cards.length - 1, currentIndex() + direction));
      const left = cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      track.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('keydown', event => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    });
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    navigation.hidden = false;
    update();
  }
})();
