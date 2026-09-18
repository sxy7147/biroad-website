'use strict';
document.documentElement.classList.add('js');

// Wait for both on-demand clips before starting a pair. The caller can cancel.
function waitForVideo(video, signal) {
  if (signal.aborted) return Promise.reject(new DOMException('Cancelled', 'AbortError'));
  if (video.readyState >= 3) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener('canplay', ready);
      video.removeEventListener('error', failed);
      signal.removeEventListener('abort', cancelled);
    };
    const ready = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error('Video unavailable')); };
    const cancelled = () => { cleanup(); reject(new DOMException('Cancelled', 'AbortError')); };
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Video loading timed out'));
    }, 20000);
    video.addEventListener('canplay', ready);
    video.addEventListener('error', failed);
    signal.addEventListener('abort', cancelled, { once: true });
    video.preload = 'auto';
    // load() resets currentTime: keep an existing buffered/seek position intact.
    if (video.networkState === 0 || video.networkState === 3) video.load();
  });
}

document.querySelectorAll('.experiment').forEach((experiment) => {
  const videos = [...experiment.querySelectorAll('video')];
  const toggle = experiment.querySelector('.pair-toggle');
  const restart = experiment.querySelector('.pair-restart');
  const status = experiment.querySelector('.pair-status');
  const taskName = experiment.querySelector('h3').textContent.toLowerCase();
  let operation = 0;
  let busy = false;
  let loadingController;
  const isPlaying = () => videos.some((video) => !video.paused && !video.ended);
  const updateLabel = () => {
    if (busy) {
      toggle.textContent = 'Cancel loading';
      toggle.setAttribute('aria-label', `Cancel loading ${taskName} videos`);
      return;
    }
    toggle.textContent = isPlaying() ? 'Pause both' : 'Play both';
    toggle.setAttribute('aria-label', `${isPlaying() ? 'Pause' : 'Play'} both ${taskName} videos`);
  };
  const pause = () => {
    operation += 1;
    loadingController?.abort();
    busy = false;
    videos.forEach((video) => video.pause());
    toggle.disabled = false;
    restart.disabled = false;
    if (status.textContent === 'Loading paired videos…') status.textContent = '';
    updateLabel();
  };
  const play = async (fromStart) => {
    const currentOperation = ++operation;
    loadingController = new AbortController();
    busy = true;
    restart.disabled = true;
    status.textContent = 'Loading paired videos…';
    updateLabel();
    videos.forEach((video) => video.pause());
    if (fromStart || videos.some((video) => video.ended)) {
      videos.forEach((video) => { video.currentTime = 0; });
    }
    // Clips already contain 3× speed; never apply another playbackRate multiplier.
    try {
      await Promise.all(videos.map((video) => waitForVideo(video, loadingController.signal)));
      if (currentOperation !== operation) return;
      const results = await Promise.allSettled(videos.map((video) => video.play()));
      if (currentOperation !== operation) return;
      if (results.some((result) => result.status === 'rejected')) throw new Error('Playback unavailable');
      status.textContent = '';
    } catch {
      if (currentOperation !== operation) return;
      pause();
      status.textContent = 'The pair could not load. Try again or use each video’s controls.';
    }
    busy = false;
    toggle.disabled = false;
    restart.disabled = false;
    updateLabel();
  };
  toggle.addEventListener('click', () => {
    if (busy || isPlaying()) pause();
    else void play(false);
  });
  restart.addEventListener('click', () => { if (!busy) void play(true); });
  videos.forEach((video) => {
    ['play', 'pause', 'ended'].forEach((event) => video.addEventListener(event, updateLabel));
    video.addEventListener('error', () => {
      pause();
      status.textContent = 'This clip could not load. Please reload the page and try again.';
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        pause();
        if (status.textContent === 'Loading paired videos…') status.textContent = '';
      }
    });
    observer.observe(experiment);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
  });
});

document.querySelector('#copy-citation').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(document.querySelector('#bibtex').textContent.trim());
    status.textContent = 'Citation copied.';
  } catch {
    status.textContent = 'Select the BibTeX text above and copy it with your keyboard.';
  }
});
