(async () => {
  // 1) Request camera permission
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (err) {
    alert('⚠️ Please allow camera access and reload.');
    return;
  }

  const marker = document.getElementById('marker');
  // 2) When marker is found, pop in each asset
  marker.addEventListener('markerFound', () => {
    ['text-asset','photo-asset','logo-asset','video-asset'].forEach((id, idx) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible','true');
        el.classList.add('pop-in');
      }, idx * 1000 + 500);
    });
    // Hide on-screen preview once AR starts
    document.getElementById('marker-message').style.display = 'none';
  });
})();
