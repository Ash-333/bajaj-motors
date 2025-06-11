// Auto-scroll Manager for Bike Carousel
export class AutoScrollManager {
  constructor(carousel, config = {}) {
    this.carousel = carousel;
    this.config = {
      enabled: true,
      interval: 4000,
      pauseOnHover: true,
      pauseOnInteraction: true,
      resumeDelay: 2000,
      showProgress: true,
      respectReducedMotion: true,
      ...config
    };

    this.isActive = false;
    this.isPaused = false;
    this.intervalId = null;
    this.resumeTimeoutId = null;
    this.progressIntervalId = null;
    this.currentProgress = 0;
    this.lastInteractionTime = 0;

    this.init();
  }

  init() {
    // Check for reduced motion preference
    if (this.config.respectReducedMotion && this.prefersReducedMotion()) {
      this.config.enabled = false;
      return;
    }

    // Remove any existing floating buttons
    this.removeExistingProgressIndicator();

    this.setupEventListeners();
    this.createProgressIndicator();

    if (this.config.enabled) {
      this.start();
    }
  }

  removeExistingProgressIndicator() {
    const existing = document.getElementById('auto-scroll-progress');
    if (existing) {
      existing.remove();
    }
  }

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  setupEventListeners() {
    // Pause on hover
    if (this.config.pauseOnHover) {
      const carouselElement = this.carousel.bikeImage?.parentElement;
      if (carouselElement) {
        carouselElement.addEventListener('mouseenter', () => this.pause());
        carouselElement.addEventListener('mouseleave', () => this.scheduleResume());
      }
    }

    // Pause on user interaction
    if (this.config.pauseOnInteraction) {
      document.addEventListener('click', (e) => this.handleUserInteraction(e));
      document.addEventListener('keydown', (e) => this.handleUserInteraction(e));
      document.addEventListener('touchstart', (e) => this.handleUserInteraction(e));
    }

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (this.isActive && !this.isPaused) {
        this.start();
      }
    });
  }

  handleUserInteraction(event) {
    // Check if interaction is with carousel elements
    const carouselElements = [
      '.s1-tab', '.variant-btn', '.thumbnail', '[data-color]', 
      '#s1-prevBtn', '#s1-nextBtn', '.bike-carousel'
    ];

    const isCarouselInteraction = carouselElements.some(selector => 
      event.target.closest(selector)
    );

    if (isCarouselInteraction) {
      this.lastInteractionTime = Date.now();
      this.pause();
      this.scheduleResume();
    }
  }

  createProgressIndicator() {
    // Progress indicator disabled - no floating button
    return;
  }

  updateProgress() {
    // Progress indicator disabled
    return;
  }

  start() {
    if (!this.config.enabled || this.isActive) return;

    this.isActive = true;
    this.isPaused = false;
    this.currentProgress = 0;

    // Clear any existing intervals
    this.clearIntervals();

    // Start main interval
    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.carousel.nextSlide();
        this.currentProgress = 0;
      }
    }, this.config.interval);

    // Progress tracking disabled

    // Auto-scroll started
  }

  pause() {
    if (!this.isActive) return;
    
    this.isPaused = true;
    // Auto-scroll paused
  }

  resume() {
    if (!this.isActive) return;
    
    this.isPaused = false;
    // Auto-scroll resumed
  }

  stop() {
    this.isActive = false;
    this.isPaused = false;
    this.clearIntervals();
    this.currentProgress = 0;
    this.updateProgress();
    // Auto-scroll stopped
  }

  scheduleResume() {
    if (this.resumeTimeoutId) {
      clearTimeout(this.resumeTimeoutId);
    }

    this.resumeTimeoutId = setTimeout(() => {
      const timeSinceLastInteraction = Date.now() - this.lastInteractionTime;
      if (timeSinceLastInteraction >= this.config.resumeDelay) {
        this.resume();
      }
    }, this.config.resumeDelay);
  }

  clearIntervals() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.progressIntervalId) {
      clearInterval(this.progressIntervalId);
      this.progressIntervalId = null;
    }
    if (this.resumeTimeoutId) {
      clearTimeout(this.resumeTimeoutId);
      this.resumeTimeoutId = null;
    }
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isActive) {
      this.stop();
      if (this.config.enabled) {
        this.start();
      }
    }
  }

  getStatus() {
    return {
      isActive: this.isActive,
      isPaused: this.isPaused,
      currentProgress: this.currentProgress,
      config: { ...this.config }
    };
  }

  destroy() {
    this.stop();
    
    // Remove progress indicator
    const progressContainer = document.getElementById('auto-scroll-progress');
    if (progressContainer) {
      progressContainer.remove();
    }

    // Remove event listeners would require storing references
    // For now, we'll rely on garbage collection
  }
}
