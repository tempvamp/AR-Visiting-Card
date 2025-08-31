// Immediately request camera permissions and start AR
(async function() {
  try {
    // Request camera
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }});
    console.log('✅ Camera access granted');
    // Nothing else needed: AR.js and A-Frame auto-start the scene
  } catch(err) {
    alert('⚠️ Camera access is required for AR. Please allow camera permission and reload.');
    console.error('Camera access error:', err);
  }
})();
