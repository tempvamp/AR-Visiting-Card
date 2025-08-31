(async () => {
  // 1) Request camera permission
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (err) {
    alert('⚠️ Please allow camera access and reload.');
    return;
  }

  // 2) On marker detection, pop in text, video, logo, photo in sequence
  const marker = document.getElementById('marker');
  marker.addEventListener('markerFound', () => {
    const sequence = [
      'text-asset',
      'video-asset',
      'logo-asset',
      'photo-asset'
    ];
    sequence.forEach((id, idx) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible', 'true');
        el.classList.add('pop-in');
      }, idx * 1000 + 500);
    });
  });
})();
