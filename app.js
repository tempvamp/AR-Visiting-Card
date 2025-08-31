(async () => {
  // 1. Camera permission
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (err) {
    alert('⚠️ Allow camera access and reload.');
    return;
  }

  // 2. On marker found, pop in each asset
  const marker = document.getElementById('marker');
  marker.addEventListener('markerFound', () => {
    const ids = ['text-asset','video-asset','logo-asset','photo-asset'];
    ids.forEach((id, idx) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible','true');
        el.classList.add('pop-in');
      }, idx * 1000 + 500);
    });
  });
})();
