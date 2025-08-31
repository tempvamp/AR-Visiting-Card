(async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch {
    alert('⚠️ Please allow camera access and reload.');
    return;
  }

  const marker = document.getElementById('marker');

  marker.addEventListener('markerFound', () => {
    const elements = [
      'name-entity',
      'video-entity',
      'logo-entity',
      'photo-entity',
    ];

    // Sequential pop-in animation
    elements.forEach((id, i) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible', 'true');
        el.classList.add('pop-in');
      }, i * 1200 + 500);
    });

    // Enable video playback
    const video = document.querySelector('#video-asset');
    if (video) {
      video.play().catch(() => {
        console.log('⚠️ Video autoplay blocked, user interaction needed.');
      });
    }

    // Add simple tap handlers for links/download
    addTapListeners();
  });

  function addTapListeners() {
    document.getElementById('name-entity')?.addEventListener('click', () => {
      window.open('https://linkedin.com/in/ashishmuley', '_blank');
    });
    document.getElementById('logo-entity')?.addEventListener('click', () => {
      window.open('https://mtes.com', '_blank');
    });
    document.getElementById('photo-entity')?.addEventListener('click', () => {
      window.open('assets/resume.pdf', '_blank');
    });
    document.getElementById('video-entity')?.addEventListener('click', () => {
      window.open('https://ashishmuley.com', '_blank');
    });
  }
})();
