(async () => {
  // Request camera
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (err) {
    alert('⚠️ Allow camera and reload.');
    return;
  }

  const marker = document.getElementById('marker');
  marker.addEventListener('markerFound', () => {
    ['text-asset','photo-asset','logo-asset','video-asset'].forEach((id,i) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible','true');
        el.classList.add('pop-in');
      }, i*1000 + 500);
    });
  });
})();
