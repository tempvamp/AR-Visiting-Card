(async () => {
  // Request camera permission
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (error) {
    alert('🚨 Camera access is required. Please allow and reload.');
    return;
  }

  const marker = document.getElementById('marker');

  marker.addEventListener('markerFound', () => {
    const sequence = [
      'name-entity',
      'video-entity',
      'logo-entity',
      'photo-entity',
    ];

    sequence.forEach((id, i) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible', 'true');
        el.classList.add('pop-in');
      }, i * 1200 + 500);
    });

    // Enable video playback on some mobile devices (manual play requirement)
    const videoEl = document.querySelector('#video-asset');
    if (videoEl) {
      videoEl.play().catch(() => {
        console.log('⚠️ Unable to autoplay video; user interaction required.');
      });
    }

    // Add clickable behavior to open links (optional)
    setupClickableLinks();
  });

  function setupClickableLinks() {
    // Name click opens LinkedIn
    const nameEntity = document.getElementById('name-entity');
    nameEntity.addEventListener('click', () => {
      window.open('https://linkedin.com/in/ashishmuley', '_blank');
    });

    // Logo click opens company website
    const logoEntity = document.getElementById('logo-entity');
    logoEntity.addEventListener('click', () => {
      window.open('https://mtes.com', '_blank');
    });

    // Profile photo click downloads resume
    const photoEntity = document.getElementById('photo-entity');
    photoEntity.addEventListener('click', () => {
      window.open('assets/resume.pdf', '_blank');
    });

    // Video click opens portfolio (example)
    const videoEntity = document.getElementById('video-entity');
    videoEntity.addEventListener('click', () => {
      window.open('https://ashishmuley.com', '_blank');
    });
  }
})();
