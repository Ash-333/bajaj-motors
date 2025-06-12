// 360° Bike Viewer with Three.js - Level 2 Enhanced Implementation
class Bike360Viewer {
  constructor(containerId, config = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with ID "${containerId}" not found`);
    }

    // Configuration - now uses image array instead of path/count
    this.config = {
      images: config.images || [
        './assets/360/1.png',
        './assets/360/2.png',
        './assets/360/3.png',
        './assets/360/4.png',
        './assets/360/5.png',
        './assets/360/6.png',
        './assets/360/7.png',
        './assets/360/8.png',
        './assets/360/9.png',
        './assets/360/10.png',
        './assets/360/11.png',
        './assets/360/12.png',
        './assets/360/13.png'
      ],
      autoRotate: false,
      rotationSpeed: 0.5, // Slower rotation speed
      enableZoom: true,
      enableMomentum: true,
      mobileOptimized: true
    };

    // Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.plane = null;
    this.textures = [];
    this.currentFrame = 0;
    this.isLoading = true;
    this.loadedImages = 0;

    // Interaction state
    this.isDragging = false;
    this.previousMouseX = 0;
    this.previousTouchX = 0;
    this.velocity = 0;
    this.momentum = 0;
    this.autoRotateTimer = null;

    // Device detection
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isTouch = 'ontouchstart' in window;

    // Animation frame ID
    this.animationId = null;

    this.init();
  }

  async init() {
    try {
      this.createLoadingIndicator();
      await this.loadTextures();
      this.setupThreeJS();
      this.setupEventListeners();
      this.startRenderLoop();
      this.hideLoadingIndicator();
      
      if (this.config.autoRotate) {
        this.startAutoRotation();
      }
    } catch (error) {
      console.error('Failed to initialize 360° viewer:', error);
      this.showError('Failed to load 360° viewer');
    }
  }

  createLoadingIndicator() {
    this.container.innerHTML = `
      <div class="viewer-360-loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading 360° View...</div>
        <div class="loading-progress">
          <div class="progress-bar" style="width: 0%"></div>
        </div>
      </div>
    `;
  }

  updateLoadingProgress() {
    const progress = (this.loadedImages / this.config.images.length) * 100;
    const progressBar = this.container.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  hideLoadingIndicator() {
    const loadingElement = this.container.querySelector('.viewer-360-loading');
    if (loadingElement) {
      loadingElement.style.opacity = '0';
      setTimeout(() => {
        if (loadingElement.parentNode) {
          loadingElement.parentNode.removeChild(loadingElement);
        }
      }, 300);
    }
  }

  async loadTextures() {
    const loader = new THREE.TextureLoader();
    const loadPromises = [];

    this.config.images.forEach((imagePath, index) => {
      const loadPromise = new Promise((resolve, reject) => {
        loader.load(
          imagePath,
          (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.flipY = false;
            this.textures[index] = texture;
            this.loadedImages++;
            this.updateLoadingProgress();
            resolve(texture);
          },
          undefined,
          (error) => {
            console.error(`Failed to load texture ${imagePath}:`, error);
            reject(error);
          }
        );
      });

      loadPromises.push(loadPromise);
    });

    await Promise.all(loadPromises);
    console.log(`Loaded ${this.textures.length} textures for 360° viewer`);
  }

  setupThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    // Transparent background for mountain backdrop
    this.scene.background = null;

    // Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 3.5); // Moved camera back slightly for larger bike

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: this.isMobile ? 'low-power' : 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 2 : 3));
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear container and add renderer
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Create bike plane
    this.createBikePlane();

    // Add lighting
    this.setupLighting();

    // Add platform
    this.createPlatform();

    // Add 360° text overlay
    this.create360Text();
  }

  createBikePlane() {
    const geometry = new THREE.PlaneGeometry(4.8, 2.88); // Increased size by 50% more (was 3.2x1.92)
    const material = new THREE.MeshLambertMaterial({
      map: this.textures[0],
      transparent: true,
      alphaTest: 0.1
    });

    this.plane = new THREE.Mesh(geometry, material);
    this.plane.position.set(0, 0.1, 0);
    // Fix upside-down image by rotating 180 degrees around Z-axis
    this.plane.rotation.z = Math.PI;
    this.plane.castShadow = true;
    this.scene.add(this.plane);
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = this.isMobile ? 1024 : 2048;
    directionalLight.shadow.mapSize.height = this.isMobile ? 1024 : 2048;
    this.scene.add(directionalLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);
  }

  createPlatform() {
    // Create subtle circular platform like in the design - scaled for larger bike
    const ringGeometry = new THREE.RingGeometry(3.6, 4.3, 64); // Increased for larger bike
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(0, -1.0, 0);
    ring.rotation.x = -Math.PI / 2;
    this.scene.add(ring);

    // Add subtle inner circle
    const innerRingGeometry = new THREE.RingGeometry(3.1, 3.6, 64); // Increased for larger bike
    const innerRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    });

    const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
    innerRing.position.set(0, -0.99, 0);
    innerRing.rotation.x = -Math.PI / 2;
    this.scene.add(innerRing);
  }

  // Create 360° text overlay
  create360Text() {
    // Create text element
    const textElement = document.createElement('div');
    textElement.innerHTML = '360°';
    textElement.style.cssText = `
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(156, 163, 175, 0.8);
      font-size: 16px;
      font-weight: 300;
      letter-spacing: 2px;
      pointer-events: none;
      z-index: 5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    this.container.appendChild(textElement);
  }

  setupEventListeners() {
    const canvas = this.renderer.domElement;

    if (this.isTouch) {
      // Touch events for mobile
      canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
      canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
      canvas.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
    } else {
      // Mouse events for desktop
      canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
      canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
      canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
      canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
    }

    // Prevent context menu
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  // Mouse event handlers
  onMouseDown(event) {
    this.isDragging = true;
    this.previousMouseX = event.clientX;
    this.velocity = 0;
    this.stopAutoRotation();
    this.renderer.domElement.style.cursor = 'grabbing';
  }

  onMouseMove(event) {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.previousMouseX;
    this.velocity = deltaX * 0.01;
    this.rotateToFrame(deltaX);
    this.previousMouseX = event.clientX;
  }

  onMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.renderer.domElement.style.cursor = 'grab';

    if (this.config.enableMomentum && Math.abs(this.velocity) > 0.001) {
      this.startMomentum();
    }
  }

  // Touch event handlers
  onTouchStart(event) {
    event.preventDefault();
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.previousTouchX = event.touches[0].clientX;
      this.velocity = 0;
      this.stopAutoRotation();

      // Haptic feedback on supported devices
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  }

  onTouchMove(event) {
    event.preventDefault();
    if (!this.isDragging || event.touches.length !== 1) return;

    const deltaX = event.touches[0].clientX - this.previousTouchX;
    this.velocity = deltaX * 0.015; // Slightly more sensitive for touch
    this.rotateToFrame(deltaX);
    this.previousTouchX = event.touches[0].clientX;
  }

  onTouchEnd(event) {
    event.preventDefault();
    if (!this.isDragging) return;

    this.isDragging = false;

    if (this.config.enableMomentum && Math.abs(this.velocity) > 0.001) {
      this.startMomentum();
    }
  }

  rotateToFrame(deltaX) {
    const sensitivity = this.isMobile ? 0.15 : 0.25; // Reduced sensitivity for smoother rotation
    const frameChange = Math.round(deltaX * sensitivity);

    if (frameChange !== 0) {
      // Fixed rotation direction: + for right drag, - for left drag
      this.currentFrame = (this.currentFrame + frameChange + this.config.images.length) % this.config.images.length;
      this.updateTexture();
    }
  }

  updateTexture() {
    if (this.plane && this.textures[this.currentFrame]) {
      this.plane.material.map = this.textures[this.currentFrame];
      this.plane.material.needsUpdate = true;
    }
  }

  startMomentum() {
    this.momentum = this.velocity;
    this.momentumDecay();
  }

  momentumDecay() {
    if (Math.abs(this.momentum) < 0.001) {
      this.momentum = 0;
      return;
    }

    const frameChange = Math.round(this.momentum * 10);
    if (frameChange !== 0) {
      // Fixed momentum rotation direction to match drag direction
      this.currentFrame = (this.currentFrame + frameChange + this.config.images.length) % this.config.images.length;
      this.updateTexture();
    }

    this.momentum *= 0.95; // Decay factor
    requestAnimationFrame(() => this.momentumDecay());
  }

  startAutoRotation() {
    this.stopAutoRotation();
    this.autoRotateTimer = setInterval(() => {
      if (!this.isDragging) {
        this.currentFrame = (this.currentFrame + 1) % this.config.images.length;
        this.updateTexture();
      }
    }, 1000 / this.config.rotationSpeed);
  }

  stopAutoRotation() {
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
      this.autoRotateTimer = null;
    }
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  startRenderLoop() {
    const render = () => {
      this.animationId = requestAnimationFrame(render);
      this.renderer.render(this.scene, this.camera);
    };
    render();
  }

  // Public methods
  goToFrame(frameIndex) {
    if (frameIndex >= 0 && frameIndex < this.config.images.length) {
      this.currentFrame = frameIndex;
      this.updateTexture();
    }
  }

  setAutoRotate(enabled) {
    this.config.autoRotate = enabled;
    if (enabled) {
      this.startAutoRotation();
    } else {
      this.stopAutoRotation();
    }
  }

  reset() {
    this.currentFrame = 0;
    this.updateTexture();
    this.stopAutoRotation();
    if (this.config.autoRotate) {
      this.startAutoRotation();
    }
  }

  destroy() {
    this.stopAutoRotation();

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Dispose of Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
    }

    this.textures.forEach(texture => {
      if (texture) texture.dispose();
    });

    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }

    // Clear container
    this.container.innerHTML = '';
  }

  showError(message) {
    this.container.innerHTML = `
      <div class="viewer-360-error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">${message}</div>
        <button class="error-retry" onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Bike360Viewer;
} else {
  window.Bike360Viewer = Bike360Viewer;
}
