// QR Scanner functionality using Html5Qrcode - Simple and Mobile-Friendly
let scanner = null;
let isScanning = false;
let lastScanTimestamp = 0;
let preferredDeviceId = null;
let currentTrack = null;

// Check if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

// Initialize QR Scanner
function initQRScanner() {
    console.log('Initializing QR Scanner...');
    
    const scannerContainer = document.getElementById('qr-reader');
    if (!scannerContainer) {
        console.error('QR reader container not found');
        return;
    }
    
    // Check if we're in a secure context (required for camera access)
    const isLocalNetwork = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|localhost|127\.0\.0\.1)/.test(location.hostname);
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.startsWith('192.168.') || location.hostname.startsWith('10.');
    const isSecure = window.isSecureContext || location.protocol === 'https:' || isLocalhost;
    
    if (!isSecure) {
        scannerContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px;">
                <h4 style="color: #721c24; margin-top: 0;">🔒 Secure Connection Required</h4>
                <p style="color: #721c24; margin-bottom: 15px;">Camera access requires a secure connection (HTTPS).</p>
                <p style="color: #721c24; font-size: 14px;">Current protocol: ${location.protocol}</p>
                <button onclick="manualQRInput()" class="btn btn-secondary">Manual QR Input</button>
            </div>
        `;
        return;
    }
    
    // Check camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('Camera API check failed:');
        console.log('- navigator.mediaDevices:', !!navigator.mediaDevices);
        console.log('- getUserMedia:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
        console.log('- isSecureContext:', window.isSecureContext);
        console.log('- protocol:', location.protocol);
        console.log('- hostname:', location.hostname);
        
        scannerContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px;">
                <h4 style="color: #721c24; margin-top: 0;">❌ Camera Not Supported</h4>
                <p style="color: #721c24; margin-bottom: 15px;">Your browser doesn't support camera access.</p>
                <div style="text-align: left; color: #721c24; font-size: 14px; margin-bottom: 15px;">
                    <strong>Debug Info:</strong><br>
                    • Protocol: ${location.protocol}<br>
                    • Hostname: ${location.hostname}<br>
                    • Secure Context: ${window.isSecureContext ? 'Yes' : 'No'}<br>
                    • MediaDevices: ${navigator.mediaDevices ? 'Yes' : 'No'}<br>
                    • getUserMedia: ${navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? 'Yes' : 'No'}
                </div>
                <div style="text-align: left; color: #721c24; font-size: 14px; margin-bottom: 15px;">
                    <strong>Solutions:</strong><br>
                    • Try accessing via: <code>https://localhost:5000</code><br>
                    • Or use: <code>http://localhost:5000</code> (should work for localhost)<br>
                    • Check Chrome camera permissions<br>
                    • Try incognito mode
                </div>
                <button onclick="manualQRInput()" class="btn btn-primary">Manual QR Input</button>
                <button onclick="location.reload()" class="btn btn-secondary">Refresh Page</button>
            </div>
        `;
        return;
    }
    
    // Load Html5Qrcode library first
    loadHtml5Qrcode().then(() => {
        console.log('Html5Qrcode library loaded successfully');
        showCameraStartButton();
    }).catch(error => {
        console.error('Failed to load Html5Qrcode:', error);
        showMessage('Failed to load QR scanner library. Please check your internet connection.', 'error');
        
        scannerContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h4 style="color: #721c24; margin-top: 0;">⚠️ Scanner Unavailable</h4>
                <p style="color: #721c24; margin-bottom: 15px;">QR scanner library could not be loaded.</p>
                <div style="text-align: left; color: #666; font-size: 14px; margin-bottom: 15px;">
                    <strong>Possible solutions:</strong><br>
                    • Check your internet connection<br>
                    • Try refreshing the page<br>
                    • Use a different browser<br>
                    • Disable ad blockers temporarily
                </div>
                <button onclick="manualQRInput()" class="btn btn-primary">Manual QR Input</button>
                <button onclick="location.reload()" class="btn btn-secondary">Refresh Page</button>
            </div>
        `;
    });
}

// Show camera start button for mobile compatibility
function showCameraStartButton() {
    // We no longer show a start button in the preview; controls are below
    const scannerContainer = document.getElementById('qr-reader');
    if (!scannerContainer) return;
    scannerContainer.innerHTML = '<p style="color:#cbd5e1; text-align:center;">Scanner idle</p>';
}

// Load Html5Qrcode library
function loadHtml5Qrcode() {
    return new Promise((resolve, reject) => {
        if (window.Html5Qrcode) {
            console.log('Html5Qrcode library already loaded');
            resolve(window.Html5Qrcode);
            return;
        }
        
        console.log('Loading Html5Qrcode library...');
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            console.log('Script loaded, checking for Html5Qrcode...');
            // Wait a bit for the library to initialize
            setTimeout(() => {
                if (window.Html5Qrcode) {
                    console.log('Html5Qrcode library loaded successfully');
                    resolve(window.Html5Qrcode);
                } else {
                    console.error('Html5Qrcode not available after script load');
                    reject(new Error('Html5Qrcode library failed to initialize'));
                }
            }, 100);
        };
        
        script.onerror = (error) => {
            console.error('Failed to load Html5Qrcode library script:', error);
            reject(new Error('Failed to load Html5Qrcode library script'));
        };
        
        document.head.appendChild(script);
    });
}

// Start Html5Qrcode scanner
function startHtml5QrcodeScanner() {
    console.log('Starting Html5Qrcode scanner...');
    const scannerContainer = document.getElementById('qr-reader');
    if (!scannerContainer) {
        console.error('Scanner container not found');
        showMessage('Scanner container not found', 'error');
        return;
    }
    
    if (!window.Html5Qrcode) {
        console.error('Html5Qrcode library not loaded');
        showMessage('QR scanner library not loaded', 'error');
        return;
    }
    
    // Create scanner element
    const scannerElement = document.createElement('div');
    scannerElement.id = 'html5-qrcode-scanner';
    scannerElement.style.cssText = `
        width: 100%; 
        height: 300px; 
        border: 2px solid #007bff; 
        border-radius: 8px; 
        background: #000; 
        position: relative;
        overflow: hidden;
    `;
    scannerContainer.innerHTML = ''; // Clear existing content
    scannerContainer.appendChild(scannerElement);
    
    // Add loading message
    scannerElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #fff; background: #000;">Loading camera...</div>';
    
    try {
        // Initialize scanner
        scanner = new Html5Qrcode("html5-qrcode-scanner");
        console.log('Scanner instance created');
    } catch (error) {
        console.error('Failed to create scanner instance:', error);
        showMessage('Failed to create scanner: ' + error.message, 'error');
        return;
    }
    
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
        useBarCodeDetectorIfSupported: true
    };
    
    // Try different camera configurations
    const cameraConfigs = [
        { facingMode: "environment" },
        { facingMode: "user" },
        { facingMode: { exact: "environment" } },
        { facingMode: { exact: "user" } },
        true // Default camera
    ];
    
    let currentConfigIndex = 0;
    
    const tryNextCamera = () => {
        if (currentConfigIndex >= cameraConfigs.length) {
            console.error('All camera configurations failed');
            showCameraError(scannerContainer, 'No camera available or accessible');
            return;
        }
        
        const cameraConfig = cameraConfigs[currentConfigIndex];
        console.log(`Trying camera config ${currentConfigIndex + 1}:`, cameraConfig);
        
        scanner.start(
            cameraConfig,
            config,
            (decodedText) => {
                console.log('QR Code detected:', decodedText);
                handleQRScan(decodedText);
            },
            (error) => {
                // Silent error handling - don't spam console
                console.log('Scanner error (normal):', error);
            }
        ).then(() => {
            console.log('Html5Qrcode scanner started successfully');
            isScanning = true;
            
            // Wait a moment for the video to render, then clear loading message
            setTimeout(() => {
                scannerElement.innerHTML = '';
                console.log('Scanner video should now be visible');
            }, 1000);
            
            showMessage('📷 QR Scanner Ready! Point camera at QR code', 'success');
        }).catch(err => {
            console.error(`Camera config ${currentConfigIndex + 1} failed:`, err.message);
            currentConfigIndex++;
            tryNextCamera();
        });
    };
    
    tryNextCamera();
}

// Show camera not supported message
function showCameraNotSupported(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 20px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px;">
            <h4 style="color: #721c24; margin-top: 0;">❌ Camera Not Supported</h4>
            <p style="color: #721c24; margin-bottom: 15px;">Your browser doesn't support camera access for QR scanning.</p>
            <div style="text-align: left; color: #721c24; font-size: 14px; margin-bottom: 15px;">
                <strong>Solutions:</strong><br>
                • Use Chrome, Firefox, Safari, or Edge (latest version)<br>
                • Make sure you're using HTTPS (not HTTP)<br>
                • Check if camera permissions are blocked<br>
                • Try a different device with a camera
            </div>
            <div style="margin-top: 15px;">
                <button onclick="manualQRInput()" class="btn btn-primary" style="margin-right: 10px;">Manual QR Input</button>
                <button onclick="location.reload()" class="btn btn-secondary">Refresh Page</button>
            </div>
        </div>
    `;
}

// Show camera error message
function showCameraError(container, message) {
    container.innerHTML = `
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h4 style="color: #721c24; margin-top: 0;">📷 Camera Error</h4>
            <p style="color: #721c24; margin-bottom: 15px;">${message}</p>
            <div style="text-align: left; color: #666; font-size: 14px; margin-bottom: 15px;">
                <strong>Troubleshooting:</strong><br>
                • Make sure you have a camera connected<br>
                • Check if another app is using the camera<br>
                • Try refreshing the page<br>
                • Check browser permissions
            </div>
            <button onclick="restartCamera()" class="btn btn-warning" style="margin-right: 10px;">Try Again</button>
            <button onclick="manualQRInput()" class="btn btn-secondary">Manual Input</button>
        </div>
    `;
}

// Handle QR scan
function handleQRScan(qrData) {
    if (!qrData) return;
    // Debounce to prevent immediate re-triggers and accidental stops
    const now = Date.now();
    if (now - lastScanTimestamp < 1200) {
        return;
    }
    lastScanTimestamp = now;
    
    console.log('QR Code detected:', qrData);
    
    // Show success message
    showMessage('QR Code scanned successfully! Username: ' + qrData, 'success');
    
    // Fill username field
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.value = qrData.trim();
        usernameInput.focus();
    }
    
    // Vibrate on mobile if supported
    if (navigator.vibrate) {
        try {
            navigator.vibrate(100);
        } catch(e) {
            // Ignore vibration errors
        }
    }
    
    // Keep scanning until Stop pressed (no auto-restart/stop here)
}

// Manual QR input for testing
function manualQRInput() {
    const qrData = prompt('Enter QR code data (username):');
    if (qrData && qrData.trim()) {
        console.log('Manual QR input:', qrData.trim());
        handleQRScan(qrData.trim());
    }
}

// Debug function to check scanner state
function debugScanner() {
    console.log('=== Scanner Debug Info ===');
    console.log('Scanner instance:', scanner);
    console.log('Is scanning:', isScanning);
    console.log('Scanner container:', document.getElementById('qr-reader'));
    console.log('Scanner element:', document.getElementById('html5-qrcode-scanner'));
    console.log('Video elements:', document.querySelectorAll('video'));
    console.log('Canvas elements:', document.querySelectorAll('canvas'));
    
    if (scanner) {
        scanner.getState().then(state => {
            console.log('Scanner state:', state);
        }).catch(err => {
            console.log('Scanner state error:', err);
        });
    }
}

// Restart camera
function restartCamera() {
    stopCamera();
    setTimeout(() => {
        startHtml5QrcodeScanner();
    }, 300);
}

// Stop camera
function stopCamera() {
    if (scanner && isScanning) {
        scanner.stop().then(() => {
            console.log('Scanner stopped');
            isScanning = false;
        }).catch(err => {
            console.error('Error stopping scanner:', err);
        });
    }
}

// Explicit controls used by UI buttons
function startScanner(){
    startHtml5QrcodeScanner();
}
function stopScanner(){
    stopCamera();
}

// Show message
function showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = document.getElementById('scan-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'scan-message';
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 90%;
            text-align: center;
        `;
        document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.style.backgroundColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (messageEl) messageEl.remove();
    }, 3000);
}

// Show scan result (alias for showMessage)
function showScanResult(message, isSuccess) {
    showMessage(message, isSuccess ? 'success' : 'error');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize QR scanner if on manager dashboard
    if (document.getElementById('qr-reader')) {
        initQRScanner();
    }
    
    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isScanning) {
            stopCamera();
        }
    });
});



