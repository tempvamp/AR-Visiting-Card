(async () => {
  // Request camera access
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (err) {
    alert('⚠️ Please allow camera access and reload.');
    return;
  }

  // When marker (your QR) is found, pop in each asset
  const marker = document.getElementById('marker');
  marker.addEventListener('markerFound', () => {
    const assets = [
      document.getElementById('text-asset'),
      document.getElementById('photo-asset'),
      document.getElementById('logo-asset'),
      document.getElementById('video-asset')
    ];
    assets.forEach((el, i) => {
      setTimeout(() => {
        el.setAttribute('visible', 'true');
        el.classList.add('pop-in');
      }, i * 1000 + 500);
    });
  });

  // Show the on-screen marker preview (QR) until actual AR appears
  const msg = document.getElementById('marker-message');
  msg.classList.remove('hidden');
  marker.addEventListener('markerFound', () => msg.classList.add('hidden'));
})();
