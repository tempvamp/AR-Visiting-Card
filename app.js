// ============================================
//    AR BUSINESS CARD - MAIN APPLICATION
// ============================================

class ARBusinessCard {
    constructor() {
        // Configuration - UPDATE THESE VALUES WITH YOUR INFORMATION
        this.config = {
            // 🔹 PERSONAL INFORMATION (REQUIRED)
            personalInfo: {
                name: "Ashish Machhindra Muley",                          // Replace with your name
                title: "Instrumentation Engineer | MTES Pvt. Ltd.",         // Replace with your title
                email: "ashish.muley@domain.com",                 // Replace with your email
                phone: "+1-234-567-8900",                       // Replace with your phone (include country code)
                linkedin: "https://linkedin.com/in", // Replace with your LinkedIn URL
                instagram: "https://instagram.com",   // Replace with your Instagram URL
                github: "https://github.com/tempvamp",       // Replace with your GitHub URL
                portfolio: "https://your-website.com"           // Replace with your portfolio/website URL
            },

            // 🔹 ASSETS - UPDATE WITH YOUR GITHUB RAW URLS
            assets: {
                // Format: https://raw.githubusercontent.com/YOUR-USERNAME/ar-visiting-card/main/assets/FILENAME
                profileImage: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/profile.jpg",              // Path to your profile photo
                companyLogo: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/logo.png",                  // Path to your company logo
                videoUrl: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/demo.mp4",                     // Path to demo video (optional)
                resumeUrl: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/resume.pdf"                   // Path to your resume PDF
            },

            // 🔹 SKILLS SECTION (CUSTOMIZE YOUR SKILLS)
            skills: [
                {name: "JavaScript", level: 90, color: "#f7df1e"},
                {name: "Python", level: 85, color: "#3776ab"},
                {name: "React", level: 80, color: "#61dafb"},
                {name: "Node.js", level: 75, color: "#339933"},
                {name: "AR/VR", level: 70, color: "#ff6b6b"},
                {name: "Firebase", level: 65, color: "#ffca28"}
            ],

            // 🔹 AR SETTINGS (FINE-TUNE AR EXPERIENCE)
            arSettings: {
                markerSize: 1,
                animationSpeed: 2000,
                objectPositions: {
                    text: {x: 0, y: 1.5, z: 0},
                    image: {x: -1.5, y: 0.5, z: 0},
                    logo: {x: 1.5, y: 0.5, z: 0},
                    video: {x: 2, y: 1, z: 0},
                    cube: {x: 0, y: 2.5, z: 0},
                    skillBars: {x: 0, y: -1.5, z: 0}
                }
            },

            // 🔹 OPTIONAL FEATURES
            features: {
                enableBackgroundAudio: false,    // Set to true to enable background music
                enableVideoDemo: false,          // Set to true to show video in AR
                enableSkillBars: true,           // Set to false to hide skill bars
                enableFloatingCube: true,        // Set to false to hide 3D cube
                enableParticleEffects: false     // Set to true for particle effects (advanced)
            }
        };

        // Application state
        this.state = {
            isLoaded: false,
            markerVisible: false,
            audioEnabled: false,
            cameraPermission: false,
            arInitialized: false,
            currentStep: 'loading'
        };

        // DOM elements cache
        this.elements = {
            loadingScreen: null,
            instructionsOverlay: null,
            arScene: null,
            markerMessage: null,
            contactPanel: null,
            errorMessage: null,
            marker: null
        };

        // Initialize the application
        this.init();
    }

    // ============================================
    //    INITIALIZATION
    // ============================================

    async init() {
        try {
            console.log('🚀 Initializing AR Business Card...');

            // Cache DOM elements
            this.cacheElements();

            // Set up event listeners
            this.setupEventListeners();

            // Check device compatibility
            if (!this.checkCompatibility()) {
                this.showError('Your device does not support AR functionality. Please try on a mobile device with a camera.');
                return;
            }

            // Request camera permission
            await this.requestCameraPermission();

            // Initialize AR after a short delay
            setTimeout(() => {
                this.initializeAR();
            }, 2000);

        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Failed to initialize AR experience. Please refresh and try again.');
        }
    }

    cacheElements() {
        this.elements.loadingScreen = document.getElementById('loading-screen');
        this.elements.instructionsOverlay = document.getElementById('instructions-overlay');
        this.elements.arScene = document.getElementById('ar-scene');
        this.elements.markerMessage = document.getElementById('marker-message');
        this.elements.contactPanel = document.getElementById('contact-panel');
        this.elements.errorMessage = document.getElementById('error-message');
        this.elements.marker = document.getElementById('main-marker');
    }

    setupEventListeners() {
        // Instructions button
        const gotItBtn = document.getElementById('got-it-btn');
        if (gotItBtn) {
            gotItBtn.addEventListener('click', () => this.hideInstructions());
        }

        // Contact panel buttons
        this.setupContactButtons();

        // AR interaction buttons
        this.setupARInteractions();

        // Error retry button
        const retryBtn = document.getElementById('retry-camera-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.requestCameraPermission());
        }

        // Marker events
        if (this.elements.marker) {
            this.elements.marker.addEventListener('markerFound', () => this.onMarkerFound());
            this.elements.marker.addEventListener('markerLost', () => this.onMarkerLost());
        }
    }

    setupContactButtons() {
        // Email button
        const emailBtn = document.getElementById('email-btn');
        if (emailBtn) {
            emailBtn.addEventListener('click', () => this.openEmail());
        }

        // Phone button
        const phoneBtn = document.getElementById('phone-btn');
        if (phoneBtn) {
            phoneBtn.addEventListener('click', () => this.openPhone());
        }

        // LinkedIn button
        const linkedinBtn = document.getElementById('linkedin-btn');
        if (linkedinBtn) {
            linkedinBtn.addEventListener('click', () => this.openLinkedIn());
        }

        // Instagram button
        const instagramBtn = document.getElementById('instagram-btn');
        if (instagramBtn) {
            instagramBtn.addEventListener('click', () => this.openInstagram());
        }

        // GitHub button
        const githubBtn = document.getElementById('github-btn');
        if (githubBtn) {
            githubBtn.addEventListener('click', () => this.openGitHub());
        }

        // Resume download button
        const resumeBtn = document.getElementById('resume-download-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.downloadResume());
        }
    }

    setupARInteractions() {
        // Resume button in AR
        const resumeButton = document.getElementById('resume-button');
        if (resumeButton) {
            resumeButton.addEventListener('click', () => this.downloadResume());
        }

        // LinkedIn button in AR
        const linkedinButton = document.getElementById('linkedin-button');
        if (linkedinButton) {
            linkedinButton.addEventListener('click', () => this.openLinkedIn());
        }

        // WhatsApp button in AR
        const whatsappButton = document.getElementById('whatsapp-button');
        if (whatsappButton) {
            whatsappButton.addEventListener('click', () => this.openWhatsApp());
        }

        // Portfolio button in AR
        const portfolioButton = document.getElementById('portfolio-button');
        if (portfolioButton) {
            portfolioButton.addEventListener('click', () => this.openPortfolio());
        }
    }

    // ============================================
    //    CAMERA AND COMPATIBILITY
    // ============================================

    checkCompatibility() {
        // Check for required APIs
        const hasWebGL = !!window.WebGLRenderingContext;
        const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        const hasDeviceOrientation = 'DeviceOrientationEvent' in window;

        console.log('🔍 Compatibility check:', {
            WebGL: hasWebGL,
            UserMedia: hasUserMedia,
            DeviceOrientation: hasDeviceOrientation
        });

        return hasWebGL && hasUserMedia;
    }

    async requestCameraPermission() {
        try {
            console.log('📸 Requesting camera permission...');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            this.state.cameraPermission = true;
            console.log('✅ Camera permission granted');

            // Stop the test stream
            stream.getTracks().forEach(track => track.stop());

            // Hide error message if visible
            this.hideError();

        } catch (error) {
            console.error('❌ Camera permission denied:', error);
            this.showError('Camera access is required for the AR experience. Please allow camera permissions and try again.');
            this.state.cameraPermission = false;
        }
    }

    // ============================================
    //    AR INITIALIZATION
    // ============================================

    initializeAR() {
        if (!this.state.cameraPermission) {
            console.warn('⚠️ Cannot initialize AR without camera permission');
            return;
        }

        try {
            console.log('🎯 Initializing AR scene...');

            // Update AR content with personal information
            this.updateARContent();

            // Create skill bars if enabled
            if (this.config.features.enableSkillBars) {
                this.createSkillBars();
            }

            // Set up video if enabled
            if (this.config.features.enableVideoDemo) {
                this.setupVideo();
            }

            // Hide loading screen and show instructions
            this.hideLoading();
            this.showInstructions();

            this.state.arInitialized = true;
            console.log('✅ AR initialized successfully');

        } catch (error) {
            console.error('❌ AR initialization failed:', error);
            this.showError('Failed to initialize AR. Please refresh and try again.');
        }
    }

    updateARContent() {
        // Update profile text
        const profileText = document.getElementById('profile-text');
        if (profileText) {
            const info = this.config.personalInfo;
            profileText.setAttribute('value', `${info.name}\n${info.title}\n${info.email}`);
        }

        // Update profile image
        const profileImg = document.getElementById('profile-img');
        if (profileImg && this.config.assets.profileImage) {
            profileImg.setAttribute('src', this.config.assets.profileImage);
        }

        // Update company logo
        const logoImg = document.getElementById('company-logo-img');
        if (logoImg && this.config.assets.companyLogo) {
            logoImg.setAttribute('src', this.config.assets.companyLogo);
        }
    }

    createSkillBars() {
        const skillBarsContainer = document.getElementById('skill-bars');
        if (!skillBarsContainer) return;

        // Clear existing skill bars
        skillBarsContainer.innerHTML = '';

        this.config.skills.forEach((skill, index) => {
            const yPosition = -0.3 * index;

            // Create skill background bar
            const backgroundBar = document.createElement('a-box');
            backgroundBar.setAttribute('position', `0 ${yPosition} 0`);
            backgroundBar.setAttribute('width', '2');
            backgroundBar.setAttribute('height', '0.1');
            backgroundBar.setAttribute('depth', '0.05');
            backgroundBar.setAttribute('color', '#333333');
            skillBarsContainer.appendChild(backgroundBar);

            // Create skill progress bar
            const progressBar = document.createElement('a-box');
            const skillWidth = (skill.level / 100) * 2;
            progressBar.setAttribute('position', `${-1 + skillWidth/2} ${yPosition} 0.03`);
            progressBar.setAttribute('width', skillWidth);
            progressBar.setAttribute('height', '0.08');
            progressBar.setAttribute('depth', '0.02');
            progressBar.setAttribute('color', skill.color);
            progressBar.setAttribute('animation', `property: width; to: ${skillWidth}; dur: 2000; delay: ${index * 200}; easing: easeOutQuad`);
            skillBarsContainer.appendChild(progressBar);

            // Create skill label
            const label = document.createElement('a-text');
            label.setAttribute('position', `-1.2 ${yPosition + 0.1} 0`);
            label.setAttribute('value', `${skill.name} ${skill.level}%`);
            label.setAttribute('color', '#ffffff');
            label.setAttribute('width', '6');
            label.setAttribute('align', 'left');
            skillBarsContainer.appendChild(label);
        });
    }

    setupVideo() {
        const video = document.getElementById('demo-video');
        if (video && this.config.assets.videoUrl) {
            video.setAttribute('src', this.config.assets.videoUrl);
            video.setAttribute('visible', 'true');
        }
    }

    // ============================================
    //    MARKER EVENTS
    // ============================================

    onMarkerFound() {
        console.log('🎯 AR Marker detected!');
        this.state.markerVisible = true;

        // Hide marker message
        this.hideMarkerMessage();

        // Start background audio if enabled
        if (this.config.features.enableBackgroundAudio) {
            this.startBackgroundAudio();
        }

        // Add visual feedback
        this.addMarkerFoundEffects();
    }

    onMarkerLost() {
        console.log('👻 AR Marker lost');
        this.state.markerVisible = false;

        // Show marker message
        this.showMarkerMessage();

        // Stop background audio
        this.stopBackgroundAudio();
    }

    addMarkerFoundEffects() {
        // Add pulse effect to floating cube
        const cube = document.getElementById('floating-cube');
        if (cube) {
            cube.classList.add('ar-pulse');
        }

        // Add glow effect to interactive elements
        const interactiveElements = document.querySelectorAll('.interactive');
        interactiveElements.forEach(element => {
            element.classList.add('ar-glow');
        });
    }

    // ============================================
    //    CONTACT ACTIONS
    // ============================================

    openEmail() {
        const email = this.config.personalInfo.email;
        const subject = encodeURIComponent('Hello from AR Business Card');
        const body = encodeURIComponent('Hi! I found your AR business card and would like to connect.');
        window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
        console.log('📧 Opening email client');
    }

    openPhone() {
        const phone = this.config.personalInfo.phone;
        window.open(`tel:${phone}`, '_blank');
        console.log('📞 Opening phone dialer');
    }

    openLinkedIn() {
        window.open(this.config.personalInfo.linkedin, '_blank');
        console.log('💼 Opening LinkedIn profile');
    }

    openInstagram() {
        window.open(this.config.personalInfo.instagram, '_blank');
        console.log('📸 Opening Instagram profile');
    }

    openGitHub() {
        window.open(this.config.personalInfo.github, '_blank');
        console.log('💻 Opening GitHub profile');
    }

    openWhatsApp() {
        const phone = this.config.personalInfo.phone.replace(/[^0-9]/g, '');
        const message = encodeURIComponent('Hi! I found your AR business card.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        console.log('💬 Opening WhatsApp');
    }

    openPortfolio() {
        window.open(this.config.personalInfo.portfolio, '_blank');
        console.log('🌐 Opening portfolio website');
    }

    downloadResume() {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = this.config.assets.resumeUrl;
        link.download = `${this.config.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('📄 Downloading resume');
    }

    // ============================================
    //    AUDIO MANAGEMENT
    // ============================================

    startBackgroundAudio() {
        const audio = document.getElementById('bg-audio');
        if (audio && !this.state.audioEnabled) {
            audio.play().catch(error => {
                console.warn('⚠️ Could not start background audio:', error);
            });
            this.state.audioEnabled = true;
        }
    }

    stopBackgroundAudio() {
        const audio = document.getElementById('bg-audio');
        if (audio && this.state.audioEnabled) {
            audio.pause();
            this.state.audioEnabled = false;
        }
    }

    // ============================================
    //    UI STATE MANAGEMENT
    // ============================================

    hideLoading() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showInstructions() {
        if (this.elements.instructionsOverlay) {
            this.elements.instructionsOverlay.classList.remove('hidden');
        }
    }

    hideInstructions() {
        if (this.elements.instructionsOverlay) {
            this.elements.instructionsOverlay.classList.add('hidden');
            this.showMarkerMessage();
        }
    }

    showMarkerMessage() {
        if (this.elements.markerMessage && !this.state.markerVisible) {
            this.elements.markerMessage.classList.remove('hidden');
        }
    }

    hideMarkerMessage() {
        if (this.elements.markerMessage) {
            this.elements.markerMessage.classList.add('hidden');
        }
    }

    showError(message) {
        if (this.elements.errorMessage) {
            const errorContent = this.elements.errorMessage.querySelector('.error-content p');
            if (errorContent) {
                errorContent.textContent = message;
            }
            this.elements.errorMessage.classList.remove('hidden');
        }
    }

    hideError() {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.add('hidden');
        }
    }
}

// ============================================
//    INITIALIZE APPLICATION
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, starting AR Business Card...');

    // Initialize the AR Business Card application
    window.arBusinessCard = new ARBusinessCard();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.arBusinessCard) {
        if (document.hidden) {
            window.arBusinessCard.stopBackgroundAudio();
        } else if (window.arBusinessCard.state.markerVisible) {
            window.arBusinessCard.startBackgroundAudio();
        }
    }
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    if (window.arBusinessCard && window.arBusinessCard.elements.arScene) {
        // Refresh AR scene after orientation change
        setTimeout(() => {
            window.arBusinessCard.elements.arScene.renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );
        }, 500);
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('💥 Global error:', event.error);
    if (window.arBusinessCard) {
        window.arBusinessCard.showError('An unexpected error occurred. Please refresh the page.');
    }
});

// ============================================
//    UTILITY FUNCTIONS
// ============================================

// Detect if device is iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Detect if device is mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Log device information for debugging
console.log('📱 Device Info:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    isIOS: isIOS(),
    isMobile: isMobile(),
    screenSize: `${screen.width}x${screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`
});

// ============================================
//    INSTRUCTIONS FOR CUSTOMIZATION
// ============================================

/*
🎯 CUSTOMIZATION GUIDE:

1. PERSONAL INFORMATION (Lines 13-22):
   - Update name, title, email, phone, and social media links
   - Use full URLs for social media profiles

2. ASSET PATHS (Lines 25-30):
   - After uploading to GitHub, update these paths with your raw GitHub URLs
   - Format: https://raw.githubusercontent.com/USERNAME/REPO/main/assets/FILENAME

3. SKILLS (Lines 33-40):
   - Add/remove/modify skills and proficiency levels
   - Change colors using hex color codes
   - Adjust skill levels (0-100)

4. AR SETTINGS (Lines 43-53):
   - Fine-tune AR object positions in 3D space
   - Adjust animation speeds and marker settings

5. OPTIONAL FEATURES (Lines 56-62):
   - Enable/disable background audio, video, skill bars, etc.
   - Set to true/false based on your preferences

6. GITHUB SETUP:
   - Create repository: your-username/ar-visiting-card
   - Upload files to: index.html, style.css, app.js
   - Upload assets to: assets/ folder
   - Enable GitHub Pages in repository settings
   - Your site will be live at: https://your-username.github.io/ar-visiting-card

🔧 TESTING:
   - Test locally with a local server (python -m http.server or Live Server)
   - Test on mobile devices for camera functionality
   - Print Hiro marker for AR testing
   - Generate QR code pointing to your GitHub Pages URL

📞 SUPPORT:
   - Check browser console for error messages
   - Ensure HTTPS is enabled (automatic on GitHub Pages)
   - Verify camera permissions are granted
   - Test with good lighting for marker detection

Happy coding! 🚀

*/
