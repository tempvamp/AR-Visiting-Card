(async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch {
    alert('⚠️ Please allow camera access and reload.');
    return;
  }

  const marker = document.getElementById('marker');

  marker.addEventListener('markerFound', () => {
    const assets = ['name-entity', 'video-entity', 'logo-entity', 'photo-entity'];

    assets.forEach((id, i) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible', 'true');
        el.classList.add('pop-in');
      }, i * 1000 + 500);
    });
  });
})();
