(async () => {
  // 1) Request camera permission immediately
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (err) {
    alert('⚠️ Please allow camera access and reload.');
    return;
  }

  // 2) When marker is detected, pop in each asset
  const marker = document.getElementById('marker');
  marker.addEventListener('markerFound', () => {
    ['text-asset','photo-asset','logo-asset','video-asset'].forEach((id, idx) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible','true');
        el.classList.add('pop-in');
      }, idx * 1000 + 500);
    });
  });
})();
