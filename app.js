// ============================================
//    AR BUSINESS CARD - MAIN APPLICATION
// ============================================

class ARBusinessCard {
    constructor() {
        // Configuration - UPDATE THESE VALUES WITH YOUR INFORMATION
        this.config = {
            // 🔹 PERSONAL INFORMATION (REQUIRED)
            personalInfo: {
                name: "Ashish Machhindra Muley",                          
                title: "Instrumentation Engineer | MTES Pvt. Ltd.",         
                email: "ashish.muley@domain.com",                 
                phone: "+91-9876543210",                       // Updated to Indian format
                linkedin: "https://linkedin.com/in/ashishmuley", 
                instagram: "https://instagram.com/ashishmuley",   
                github: "https://github.com/tempvamp",       
                portfolio: "https://ashishmuley.com"           
            },
            
            // 🔹 ASSETS - YOUR GITHUB RAW URLS
            assets: {
                profileImage: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/profile.jpg",              
                companyLogo: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/logo.png",                  
                videoUrl: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/demo.mp4",                     
                resumeUrl: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/resume.pdf"                   
            },
            
            // 🔹 SKILLS SECTION (CUSTOMIZE YOUR SKILLS)
            skills: [
                {name: "Instrumentation", level: 95, color: "#00bcd4"},
                {name: "PLC Programming", level: 90, color: "#ff9800"},
                {name: "SCADA Systems", level: 85, color: "#4caf50"},
                {name: "Process Control", level: 88, color: "#9c27b0"},
                {name: "AutoCAD", level: 80, color: "#f44336"},
                {name: "Project Management", level: 75, color: "#2196f3"}
            ],
            
            // 🔹 AR SETTINGS
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
                enableBackgroundAudio: false,    
                enableVideoDemo: false,          
                enableSkillBars: true,           
                enableFloatingCube: true,        
                enableParticleEffects: false     
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
    //    INITIALIZATION - FIXED VERSION
    // ============================================

    async init() {
        try {
            console.log('🚀 Initializing AR Business Card...');
            console.log('📱 Device Info:', {
                userAgent: navigator.userAgent,
                isHTTPS: location.protocol === 'https:',
                hasCamera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
                isMobile: this.isMobile()
            });
            
            // Cache DOM elements
            this.cacheElements();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Check device compatibility
            if (!this.checkCompatibility()) {
                this.showError('Your device does not support AR functionality. Please try on a mobile device with a camera.');
                return;
            }
            
            // Add timeout protection
            this.addTimeoutProtection();
            
            // Request camera permission and initialize AR
            const permissionGranted = await this.requestCameraPermission();
            if (permissionGranted) {
                await this.initializeAR();
            }
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Failed to initialize AR experience. Please refresh and try again.');
        }
    }

    addTimeoutProtection() {
        // Add timeout protection - if AR doesn't initialize in 15 seconds, show error
        setTimeout(() => {
            if (!this.state.arInitialized) {
                console.warn('⚠️ AR initialization timeout');
                this.hideLoading();
                this.showError('AR initialization timed out. Please refresh the page and ensure camera permissions are granted.');
            }
        }, 15000);
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

        // Marker events - Add delay to ensure AR.js is ready
        setTimeout(() => {
            if (this.elements.marker) {
                this.elements.marker.addEventListener('markerFound', () => this.onMarkerFound());
                this.elements.marker.addEventListener('markerLost', () => this.onMarkerLost());
            }
        }, 2000);
    }

    setupContactButtons() {
        const buttons = [
            { id: 'email-btn', action: () => this.openEmail() },
            { id: 'phone-btn', action: () => this.openPhone() },
            { id: 'linkedin-btn', action: () => this.openLinkedIn() },
            { id: 'instagram-btn', action: () => this.openInstagram() },
            { id: 'github-btn', action: () => this.openGitHub() },
            { id: 'resume-download-btn', action: () => this.downloadResume() }
        ];

        buttons.forEach(button => {
            const element = document.getElementById(button.id);
            if (element) {
                element.addEventListener('click', button.action);
            }
        });
    }

    setupARInteractions() {
        const arButtons = [
            { id: 'resume-button', action: () => this.downloadResume() },
            { id: 'linkedin-button', action: () => this.openLinkedIn() },
            { id: 'whatsapp-button', action: () => this.openWhatsApp() },
            { id: 'portfolio-button', action: () => this.openPortfolio() }
        ];

        arButtons.forEach(button => {
            setTimeout(() => {
                const element = document.getElementById(button.id);
                if (element) {
                    element.addEventListener('click', button.action);
                }
            }, 3000); // Delay to ensure AR elements are created
        });
    }

    // ============================================
    //    CAMERA AND COMPATIBILITY - IMPROVED
    // ============================================

    checkCompatibility() {
        const hasWebGL = !!window.WebGLRenderingContext;
        const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        const hasDeviceOrientation = 'DeviceOrientationEvent' in window;
        const isHTTPS = location.protocol === 'https:';
        
        console.log('🔍 Compatibility check:', {
            WebGL: hasWebGL,
            UserMedia: hasUserMedia,
            DeviceOrientation: hasDeviceOrientation,
            HTTPS: isHTTPS
        });
        
        return hasWebGL && hasUserMedia && isHTTPS;
    }

    async requestCameraPermission() {
        try {
            console.log('📸 Requesting camera permission...');
            
            const constraints = {
                video: { 
                    facingMode: 'environment',
                    width: { min: 320, ideal: 640, max: 1280 },
                    height: { min: 240, ideal: 480, max: 720 }
                }
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            this.state.cameraPermission = true;
            console.log('✅ Camera permission granted');
            
            // Stop the test stream immediately
            stream.getTracks().forEach(track => track.stop());
            
            // Hide error message if visible
            this.hideError();
            
            return true;
            
        } catch (error) {
            console.error('❌ Camera permission denied:', error);
            
            let errorMessage = 'Camera access is required for the AR experience. ';
            
            switch (error.name) {
                case 'NotAllowedError':
                    errorMessage += 'Please allow camera permissions and reload the page.';
                    break;
                case 'NotFoundError':
                    errorMessage += 'No camera found on this device.';
                    break;
                case 'NotSupportedError':
                    errorMessage += 'Camera not supported on this browser.';
                    break;
                default:
                    errorMessage += 'Please try again or use a different browser.';
            }
            
            this.showError(errorMessage);
            this.state.cameraPermission = false;
            return false;
        }
    }

    // ============================================
    //    AR INITIALIZATION - COMPLETELY FIXED
    // ============================================

    async initializeAR() {
        if (!this.state.cameraPermission) {
            console.warn('⚠️ Cannot initialize AR without camera permission');
            return;
        }

        try {
            console.log('🎯 Initializing AR scene...');
            
            // Wait for A-Frame and AR.js to be fully loaded
            await this.waitForARLibraries();
            
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
            
            // Mark as initialized
            this.state.arInitialized = true;
            console.log('✅ AR initialized successfully');
            
            // Hide loading screen and show instructions with delay
            setTimeout(() => {
                this.hideLoading();
                this.showInstructions();
            }, 1500);
            
        } catch (error) {
            console.error('❌ AR initialization failed:', error);
            this.showError('Failed to initialize AR. Please refresh and try again.');
        }
    }

    async waitForARLibraries() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 10 seconds max wait
            
            const checkLibraries = () => {
                attempts++;
                
                if (typeof AFRAME !== 'undefined' && AFRAME.registerComponent) {
                    console.log('✅ A-Frame loaded');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('A-Frame failed to load'));
                } else {
                    setTimeout(checkLibraries, 200);
                }
            };
            
            checkLibraries();
        });
    }

    updateARContent() {
        try {
            // Update profile text
            const profileText = document.getElementById('profile-text');
            if (profileText) {
                const info = this.config.personalInfo;
                profileText.setAttribute('value', `${info.name}\\n${info.title}\\n${info.email}`);
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
        } catch (error) {
            console.warn('⚠️ Error updating AR content:', error);
        }
    }

    createSkillBars() {
        try {
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
        } catch (error) {
            console.warn('⚠️ Error creating skill bars:', error);
        }
    }

    setupVideo() {
        try {
            const video = document.getElementById('demo-video');
            if (video && this.config.assets.videoUrl) {
                video.setAttribute('src', this.config.assets.videoUrl);
                video.setAttribute('visible', 'true');
            }
        } catch (error) {
            console.warn('⚠️ Error setting up video:', error);
        }
    }

    // ============================================
    //    MARKER EVENTS
    // ============================================

    onMarkerFound() {
        console.log('🎯 AR Marker detected!');
        this.state.markerVisible = true;
        this.hideMarkerMessage();
        
        if (this.config.features.enableBackgroundAudio) {
            this.startBackgroundAudio();
        }
        
        this.addMarkerFoundEffects();
    }

    onMarkerLost() {
        console.log('👻 AR Marker lost');
        this.state.markerVisible = false;
        this.showMarkerMessage();
        this.stopBackgroundAudio();
    }

    addMarkerFoundEffects() {
        const cube = document.getElementById('floating-cube');
        if (cube) {
            cube.classList.add('ar-pulse');
        }
        
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
        const link = document.createElement('a');
        link.href = this.config.assets.resumeUrl;
        link.download = `${this.config.personalInfo.name.replace(/\\s+/g, '_')}_Resume.pdf`;
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
        this.hideLoading(); // Hide loading screen when showing error
        
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

    // ============================================
    //    UTILITY FUNCTIONS
    // ============================================

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
}

// ============================================
//    INITIALIZE APPLICATION - IMPROVED
// ============================================

// Wait for DOM and libraries to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, starting AR Business Card...');
    
    // Add additional delay for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const delay = isMobile ? 1000 : 500;
    
    setTimeout(() => {
        window.arBusinessCard = new ARBusinessCard();
    }, delay);
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
        setTimeout(() => {
            if (window.arBusinessCard.elements.arScene.renderer) {
                window.arBusinessCard.elements.arScene.renderer.setSize(
                    window.innerWidth,
                    window.innerHeight
                );
            }
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

// Log device information for debugging
console.log('📱 Device Info:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenSize: `${screen.width}x${screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    isHTTPS: location.protocol === 'https:'
});
