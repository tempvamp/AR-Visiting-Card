(async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (err) {
    alert('⚠️ Please allow camera access and refresh.');
    return;
  }

  const marker = document.getElementById('marker');
  marker.addEventListener('markerFound', () => {
    const assets = [
      'text-asset',
      'photo-asset',
      'resume-preview',
      'resume-button',
      'linkedin-btn',
      'whatsapp-btn',
      'email-btn'
    ];
    assets.forEach((id, i) => {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.setAttribute('visible', 'true');
        el.classList.add('pop-in');
      }, i * 800 + 400); // staggered reveal
    });

    // Setup clickable handlers
    document.getElementById('resume-button').addEventListener('click', () => {
      window.open('assets/resume.pdf', '_blank');
    });
    document.getElementById('linkedin-btn').addEventListener('click', () => {
      window.open('https://linkedin.com/in/ashishmuley', '_blank');
    });
    document.getElementById('whatsapp-btn').addEventListener('click', () => {
      window.open('https://wa.me/919876543210?text=Hello%20Ashish!', '_blank');
    });
    document.getElementById('email-btn').addEventListener('click', () => {
      window.open('mailto:ashish.muley@mtes.in', '_blank');
    });
  });
})();
