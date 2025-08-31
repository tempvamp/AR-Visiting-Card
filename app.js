// ============================================
//    AR BUSINESS CARD - COMPLETE VERSION
// ============================================

class ARBusinessCard {
    constructor() {
        // Configuration
        this.config = {
            personalInfo: {
                name: "Ashish Machhindra Muley",
                title: "Instrumentation Engineer",
                company: "MTES Pvt. Ltd.",
                email: "ashish.muley@mtes.in",
                phone: "+91-9876543210",
                linkedin: "https://linkedin.com/in/ashishmuley",
                whatsapp: "919876543210",
                resumeUrl: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/resume.pdf"
            }
        };

        // Application state
        this.state = {
            currentView: 'qr', // qr, loading, ar
            cameraPermission: false,
            arInitialized: false,
            markerVisible: false
        };

        // DOM elements
        this.elements = {};

        // Initialize
        this.init();
    }

    // ============================================
    //    INITIALIZATION
    // ============================================

    init() {
        console.log('🚀 Starting AR Business Card...');
        this.cacheElements();
        this.setupEventListeners();
        this.generateQRCode();
        this.showView('qr');
    }

    cacheElements() {
        this.elements = {
            qrSection: document.getElementById('qr-section'),
            loadingScreen: document.getElementById('loading-screen'),
            instructionsOverlay: document.getElementById('instructions-overlay'),
            arScene: document.getElementById('ar-scene'),
            markerMessage: document.getElementById('marker-message'),
            contactPanel: document.getElementById('contact-panel'),
            
            // Buttons
            startArBtn: document.getElementById('start-ar-btn'),
            downloadMarkerBtn: document.getElementById('download-marker-btn'),
            skipLoadingBtn: document.getElementById('skip-loading'),
            gotItBtn: document.getElementById('got-it-btn'),
            backToQrBtn: document.getElementById('back-to-qr'),
            
            // Contact buttons
            emailContact: document.getElementById('email-contact'),
            phoneContact: document.getElementById('phone-contact'),
            linkedinContact: document.getElementById('linkedin-contact'),
            whatsappContact: document.getElementById('whatsapp-contact'),
            downloadResume: document.getElementById('download-resume')
        };
    }

    setupEventListeners() {
        // Main buttons
        this.elements.startArBtn?.addEventListener('click', () => this.startARExperience());
        this.elements.downloadMarkerBtn?.addEventListener('click', () => this.downloadMarker());
        this.elements.skipLoadingBtn?.addEventListener('click', () => this.skipToAR());
        this.elements.gotItBtn?.addEventListener('click', () => this.startARCamera());
        this.elements.backToQrBtn?.addEventListener('click', () => this.showView('qr'));

        // Contact buttons
        this.elements.emailContact?.addEventListener('click', () => this.openEmail());
        this.elements.phoneContact?.addEventListener('click', () => this.openPhone());
        this.elements.linkedinContact?.addEventListener('click', () => this.openLinkedIn());
        this.elements.whatsappContact?.addEventListener('click', () => this.openWhatsApp());
        this.elements.downloadResume?.addEventListener('click', () => this.downloadResumeFile());

        // AR interactions (delayed to ensure elements exist)
        setTimeout(() => this.setupARInteractions(), 2000);

        // Marker events
        setTimeout(() => {
            const marker = document.getElementById('main-marker');
            if (marker) {
                marker.addEventListener('markerFound', () => this.onMarkerFound());
                marker.addEventListener('markerLost', () => this.onMarkerLost());
            }
        }, 3000);
    }

    setupARInteractions() {
        const arButtons = [
            { id: 'resume-button', action: () => this.downloadResumeFile() },
            { id: 'linkedin-button', action: () => this.openLinkedIn() },
            { id: 'whatsapp-button', action: () => this.openWhatsApp() },
            { id: 'email-button', action: () => this.openEmail() }
        ];

        arButtons.forEach(button => {
            const element = document.getElementById(button.id);
            if (element) {
                element.addEventListener('click', button.action);
                element.style.cursor = 'pointer';
            }
        });
    }

    // ============================================
    //    QR CODE GENERATION
    // ============================================

    generateQRCode() {
        // Generate current page URL for QR code
        const currentUrl = window.location.href;
        console.log('📱 QR Code URL:', currentUrl);
        
        // In a real implementation, you'd use a QR code library like qrcode.js
        // For now, we'll create a visual placeholder
        this.createQRPlaceholder();
    }

    createQRPlaceholder() {
        // Create animated QR code placeholder
        const qrDots = document.querySelectorAll('.qr-dot');
        setInterval(() => {
            qrDots.forEach(dot => {
                if (Math.random() > 0.7) {
                    dot.classList.toggle('dark');
                }
            });
        }, 2000);
    }

    // ============================================
    //    VIEW MANAGEMENT
    // ============================================

    showView(viewName) {
        console.log(`📺 Switching to view: ${viewName}`);
        
        // Hide all views
        this.elements.qrSection?.classList.add('hidden');
        this.elements.loadingScreen?.classList.add('hidden');
        this.elements.instructionsOverlay?.classList.add('hidden');
        this.elements.arScene?.classList.add('hidden');
        this.elements.markerMessage?.classList.add('hidden');
        this.elements.contactPanel?.classList.add('hidden');

        // Show requested view
        switch (viewName) {
            case 'qr':
                this.elements.qrSection?.classList.remove('hidden');
                this.state.currentView = 'qr';
                break;
                
            case 'loading':
                this.elements.loadingScreen?.classList.remove('hidden');
                this.state.currentView = 'loading';
                this.startLoadingAnimation();
                break;
                
            case 'instructions':
                this.elements.instructionsOverlay?.classList.remove('hidden');
                this.state.currentView = 'instructions';
                break;
                
            case 'ar':
                this.elements.arScene?.classList.remove('hidden');
                this.elements.markerMessage?.classList.remove('hidden');
                this.elements.contactPanel?.classList.remove('hidden');
                this.state.currentView = 'ar';
                break;
        }
    }

    startLoadingAnimation() {
        // Auto-progress through loading
        setTimeout(() => {
            if (this.state.currentView === 'loading') {
                this.showView('instructions');
            }
        }, 3000);
    }

    // ============================================
    //    AR EXPERIENCE FLOW
    // ============================================

    async startARExperience() {
        console.log('🎯 Starting AR experience...');
        
        // Check device compatibility
        if (!this.checkDeviceCompatibility()) {
            alert('AR not supported on this device. Please use a mobile device with camera.');
            return;
        }

        // Show loading screen
        this.showView('loading');

        // Request camera permission
        try {
            await this.requestCameraPermission();
            // Auto-advance to instructions after loading
        } catch (error) {
            console.error('❌ Camera permission failed:', error);
            alert('Camera access is required for AR experience. Please allow camera access and try again.');
            this.showView('qr');
        }
    }

    checkDeviceCompatibility() {
        const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        const hasWebGL = !!window.WebGLRenderingContext;
        const isHTTPS = location.protocol === 'https:';
        
        console.log('🔍 Device compatibility:', { hasCamera, hasWebGL, isHTTPS });
        return hasCamera && hasWebGL && isHTTPS;
    }

    async requestCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            // Stop test stream
            stream.getTracks().forEach(track => track.stop());
            
            this.state.cameraPermission = true;
            console.log('✅ Camera permission granted');
            
            return true;
        } catch (error) {
            console.error('❌ Camera permission denied:', error);
            throw error;
        }
    }

    skipToAR() {
        console.log('⏭️ Skipping to AR view');
        this.showView('instructions');
    }

    startARCamera() {
        console.log('📸 Starting AR camera...');
        this.showView('ar');
        
        // Initialize AR after view change
        setTimeout(() => {
            this.initializeAR();
        }, 500);
    }

    async initializeAR() {
        try {
            console.log('🔧 Initializing AR...');
            
            // Wait for A-Frame to be ready
            if (typeof AFRAME === 'undefined') {
                console.warn('⚠️ A-Frame not loaded, retrying...');
                setTimeout(() => this.initializeAR(), 1000);
                return;
            }

            // Update AR content
            this.updateARContent();
            
            this.state.arInitialized = true;
            console.log('✅ AR initialized successfully');
            
        } catch (error) {
            console.error('❌ AR initialization failed:', error);
        }
    }

    updateARContent() {
        // Update text content with personal info
        const profileText = document.getElementById('profile-text');
        if (profileText) {
            const info = this.config.personalInfo;
            profileText.setAttribute('value', 
                `${info.name}\\n${info.title}\\n${info.company}\\n${info.email}`
            );
        }
    }

    // ============================================
    //    MARKER EVENTS
    // ============================================

    onMarkerFound() {
        console.log('🎯 AR Marker detected!');
        this.state.markerVisible = true;
        this.elements.markerMessage?.classList.add('hidden');
        
        // Add visual effects
        const sphere = document.querySelector('a-sphere');
        if (sphere) {
            sphere.setAttribute('visible', 'true');
        }
    }

    onMarkerLost() {
        console.log('👻 AR Marker lost');
        this.state.markerVisible = false;
        this.elements.markerMessage?.classList.remove('hidden');
    }

    // ============================================
    //    CONTACT ACTIONS
    // ============================================

    openEmail() {
        const email = this.config.personalInfo.email;
        const subject = encodeURIComponent('Hello from AR Business Card');
        const body = encodeURIComponent('Hi Ashish, I found your AR business card and would like to connect!');
        window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
        console.log('📧 Opening email');
    }

    openPhone() {
        const phone = this.config.personalInfo.phone;
        window.open(`tel:${phone}`, '_blank');
        console.log('📞 Opening phone');
    }

    openLinkedIn() {
        window.open(this.config.personalInfo.linkedin, '_blank');
        console.log('💼 Opening LinkedIn');
    }

    openWhatsApp() {
        const phone = this.config.personalInfo.whatsapp;
        const message = encodeURIComponent('Hi Ashish! I found your AR business card. Great work!');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        console.log('💬 Opening WhatsApp');
    }

    downloadResumeFile() {
        window.open(this.config.personalInfo.resumeUrl, '_blank');
        console.log('📄 Downloading resume');
    }

    // ============================================
    //    UTILITY FUNCTIONS
    // ============================================

    downloadMarker() {
        // Download Hiro marker
        const link = document.createElement('a');
        link.href = 'https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg';
        link.download = 'AR_Marker_Hiro.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('📥 Downloading AR marker');
    }
}

// ============================================
//    INITIALIZE APPLICATION
// ============================================

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, initializing AR Business Card...');
    window.arBusinessCard = new ARBusinessCard();
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('📱 Page hidden');
    } else {
        console.log('📱 Page visible');
    }
});

// Log device info for debugging
console.log('📱 Device Info:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    isHTTPS: location.protocol ===
// ============================================
//    AR BUSINESS CARD - COMPLETE VERSION
// ============================================

class ARBusinessCard {
    constructor() {
        // Configuration
        this.config = {
            personalInfo: {
                name: "Ashish Machhindra Muley",
                title: "Instrumentation Engineer",
                company: "MTES Pvt. Ltd.",
                email: "ashish.muley@mtes.in",
                phone: "+91-9876543210",
                linkedin: "https://linkedin.com/in/ashishmuley",
                whatsapp: "919876543210",
                resumeUrl: "https://raw.githubusercontent.com/tempvamp/AR-Visiting-Card/main/assets/resume.pdf"
            }
        };

        // Application state
        this.state = {
            currentView: 'qr', // qr, loading, ar
            cameraPermission: false,
            arInitialized: false,
            markerVisible: false
        };

        // DOM elements
        this.elements = {};

        // Initialize
        this.init();
    }

    // ============================================
    //    INITIALIZATION
    // ============================================

    init() {
        console.log('🚀 Starting AR Business Card...');
        this.cacheElements();
        this.setupEventListeners();
        this.generateQRCode();
        this.showView('qr');
    }

    cacheElements() {
        this.elements = {
            qrSection: document.getElementById('qr-section'),
            loadingScreen: document.getElementById('loading-screen'),
            instructionsOverlay: document.getElementById('instructions-overlay'),
            arScene: document.getElementById('ar-scene'),
            markerMessage: document.getElementById('marker-message'),
            contactPanel: document.getElementById('contact-panel'),
            
            // Buttons
            startArBtn: document.getElementById('start-ar-btn'),
            downloadMarkerBtn: document.getElementById('download-marker-btn'),
            skipLoadingBtn: document.getElementById('skip-loading'),
            gotItBtn: document.getElementById('got-it-btn'),
            backToQrBtn: document.getElementById('back-to-qr'),
            
            // Contact buttons
            emailContact: document.getElementById('email-contact'),
            phoneContact: document.getElementById('phone-contact'),
            linkedinContact: document.getElementById('linkedin-contact'),
            whatsappContact: document.getElementById('whatsapp-contact'),
            downloadResume: document.getElementById('download-resume')
        };
    }

    setupEventListeners() {
        // Main buttons
        this.elements.startArBtn?.addEventListener('click', () => this.startARExperience());
        this.elements.downloadMarkerBtn?.addEventListener('click', () => this.downloadMarker());
        this.elements.skipLoadingBtn?.addEventListener('click', () => this.skipToAR());
        this.elements.gotItBtn?.addEventListener('click', () => this.startARCamera());
        this.elements.backToQrBtn?.addEventListener('click', () => this.showView('qr'));

        // Contact buttons
        this.elements.emailContact?.addEventListener('click', () => this.openEmail());
        this.elements.phoneContact?.addEventListener('click', () => this.openPhone());
        this.elements.linkedinContact?.addEventListener('click', () => this.openLinkedIn());
        this.elements.whatsappContact?.addEventListener('click', () => this.openWhatsApp());
        this.elements.downloadResume?.addEventListener('click', () => this.downloadResumeFile());

        // AR interactions (delayed to ensure elements exist)
        setTimeout(() => this.setupARInteractions(), 2000);

        // Marker events
        setTimeout(() => {
            const marker = document.getElementById('main-marker');
            if (marker) {
                marker.addEventListener('markerFound', () => this.onMarkerFound());
                marker.addEventListener('markerLost', () => this.onMarkerLost());
            }
        }, 3000);
    }

    setupARInteractions() {
        const arButtons = [
            { id: 'resume-button', action: () => this.downloadResumeFile() },
            { id: 'linkedin-button', action: () => this.openLinkedIn() },
            { id: 'whatsapp-button', action: () => this.openWhatsApp() },
            { id: 'email-button', action: () => this.openEmail() }
        ];

        arButtons.forEach(button => {
            const element = document.getElementById(button.id);
            if (element) {
                element.addEventListener('click', button.action);
                element.style.cursor = 'pointer';
            }
        });
    }

    // ============================================
    //    QR CODE GENERATION
    // ============================================

    generateQRCode() {
        // Generate current page URL for QR code
        const currentUrl = window.location.href;
        console.log('📱 QR Code URL:', currentUrl);
        
        // In a real implementation, you'd use a QR code library like qrcode.js
        // For now, we'll create a visual placeholder
        this.createQRPlaceholder();
    }

    createQRPlaceholder() {
        // Create animated QR code placeholder
        const qrDots = document.querySelectorAll('.qr-dot');
        setInterval(() => {
            qrDots.forEach(dot => {
                if (Math.random() > 0.7) {
                    dot.classList.toggle('dark');
                }
            });
        }, 2000);
    }

    // ============================================
    //    VIEW MANAGEMENT
    // ============================================

    showView(viewName) {
        console.log(`📺 Switching to view: ${viewName}`);
        
        // Hide all views
        this.elements.qrSection?.classList.add('hidden');
        this.elements.loadingScreen?.classList.add('hidden');
        this.elements.instructionsOverlay?.classList.add('hidden');
        this.elements.arScene?.classList.add('hidden');
        this.elements.markerMessage?.classList.add('hidden');
        this.elements.contactPanel?.classList.add('hidden');

        // Show requested view
        switch (viewName) {
            case 'qr':
                this.elements.qrSection?.classList.remove('hidden');
                this.state.currentView = 'qr';
                break;
                
            case 'loading':
                this.elements.loadingScreen?.classList.remove('hidden');
                this.state.currentView = 'loading';
                this.startLoadingAnimation();
                break;
                
            case 'instructions':
                this.elements.instructionsOverlay?.classList.remove('hidden');
                this.state.currentView = 'instructions';
                break;
                
            case 'ar':
                this.elements.arScene?.classList.remove('hidden');
                this.elements.markerMessage?.classList.remove('hidden');
                this.elements.contactPanel?.classList.remove('hidden');
                this.state.currentView = 'ar';
                break;
        }
    }

    startLoadingAnimation() {
        // Auto-progress through loading
        setTimeout(() => {
            if (this.state.currentView === 'loading') {
                this.showView('instructions');
            }
        }, 3000);
    }

    // ============================================
    //    AR EXPERIENCE FLOW
    // ============================================

    async startARExperience() {
        console.log('🎯 Starting AR experience...');
        
        // Check device compatibility
        if (!this.checkDeviceCompatibility()) {
            alert('AR not supported on this device. Please use a mobile device with camera.');
            return;
        }

        // Show loading screen
        this.showView('loading');

        // Request camera permission
        try {
            await this.requestCameraPermission();
            // Auto-advance to instructions after loading
        } catch (error) {
            console.error('❌ Camera permission failed:', error);
            alert('Camera access is required for AR experience. Please allow camera access and try again.');
            this.showView('qr');
        }
    }

    checkDeviceCompatibility() {
        const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        const hasWebGL = !!window.WebGLRenderingContext;
        const isHTTPS = location.protocol === 'https:';
        
        console.log('🔍 Device compatibility:', { hasCamera, hasWebGL, isHTTPS });
        return hasCamera && hasWebGL && isHTTPS;
    }

    async requestCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            // Stop test stream
            stream.getTracks().forEach(track => track.stop());
            
            this.state.cameraPermission = true;
            console.log('✅ Camera permission granted');
            
            return true;
        } catch (error) {
            console.error('❌ Camera permission denied:', error);
            throw error;
        }
    }

    skipToAR() {
        console.log('⏭️ Skipping to AR view');
        this.showView('instructions');
    }

    startARCamera() {
        console.log('📸 Starting AR camera...');
        this.showView('ar');
        
        // Initialize AR after view change
        setTimeout(() => {
            this.initializeAR();
        }, 500);
    }

    async initializeAR() {
        try {
            console.log('🔧 Initializing AR...');
            
            // Wait for A-Frame to be ready
            if (typeof AFRAME === 'undefined') {
                console.warn('⚠️ A-Frame not loaded, retrying...');
                setTimeout(() => this.initializeAR(), 1000);
                return;
            }

            // Update AR content
            this.updateARContent();
            
            this.state.arInitialized = true;
            console.log('✅ AR initialized successfully');
            
        } catch (error) {
            console.error('❌ AR initialization failed:', error);
        }
    }

    updateARContent() {
        // Update text content with personal info
        const profileText = document.getElementById('profile-text');
        if (profileText) {
            const info = this.config.personalInfo;
            profileText.setAttribute('value', 
                `${info.name}\\n${info.title}\\n${info.company}\\n${info.email}`
            );
        }
    }

    // ============================================
    //    MARKER EVENTS
    // ============================================

    onMarkerFound() {
        console.log('🎯 AR Marker detected!');
        this.state.markerVisible = true;
        this.elements.markerMessage?.classList.add('hidden');
        
        // Add visual effects
        const sphere = document.querySelector('a-sphere');
        if (sphere) {
            sphere.setAttribute('visible', 'true');
        }
    }

    onMarkerLost() {
        console.log('👻 AR Marker lost');
        this.state.markerVisible = false;
        this.elements.markerMessage?.classList.remove('hidden');
    }

    // ============================================
    //    CONTACT ACTIONS
    // ============================================

    openEmail() {
        const email = this.config.personalInfo.email;
        const subject = encodeURIComponent('Hello from AR Business Card');
        const body = encodeURIComponent('Hi Ashish, I found your AR business card and would like to connect!');
        window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
        console.log('📧 Opening email');
    }

    openPhone() {
        const phone = this.config.personalInfo.phone;
        window.open(`tel:${phone}`, '_blank');
        console.log('📞 Opening phone');
    }

    openLinkedIn() {
        window.open(this.config.personalInfo.linkedin, '_blank');
        console.log('💼 Opening LinkedIn');
    }

    openWhatsApp() {
        const phone = this.config.personalInfo.whatsapp;
        const message = encodeURIComponent('Hi Ashish! I found your AR business card. Great work!');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        console.log('💬 Opening WhatsApp');
    }

    downloadResumeFile() {
        window.open(this.config.personalInfo.resumeUrl, '_blank');
        console.log('📄 Downloading resume');
    }

    // ============================================
    //    UTILITY FUNCTIONS
    // ============================================

    downloadMarker() {
        // Download Hiro marker
        const link = document.createElement('a');
        link.href = 'https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg';
        link.download = 'AR_Marker_Hiro.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('📥 Downloading AR marker');
    }
}

// ============================================
//    INITIALIZE APPLICATION
// ============================================

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, initializing AR Business Card...');
    window.arBusinessCard = new ARBusinessCard();
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('📱 Page hidden');
    } else {
        console.log('📱 Page visible');
    }
});

// Log device info for debugging
console.log('📱 Device Info:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    isHTTPS: location.protocol ===
