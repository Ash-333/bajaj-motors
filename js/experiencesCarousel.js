// Bajaj Experiences Carousel Component
import experiencesAPI from "./experiencesAPI.js";

class ExperiencesCarousel {
  constructor() {
    this.currentSlide = 0;
    this.experiences = [];
    this.isLoading = false;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 seconds

    // DOM elements
    this.loadingElement = null;
    this.carouselElement = null;
    this.trackElement = null;
    this.prevButton = null;
    this.nextButton = null;
    this.dotsContainer = null;

    // Center-focused carousel settings
    this.slidesPerView = 3; // Always show 3 slides
    this.centerSlideIndex = 1; // Middle slide is the center (0-based)
  }

  // Initialize the carousel
  async initialize() {
    console.log("🎠 Initializing Bajaj Experiences Carousel...");

    try {
      this.bindDOMElements();
      this.setupEventListeners();
      this.setupResizeListener();
      await this.loadExperiences();
      this.render();
      this.startAutoPlay();

      console.log("✅ Carousel initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize carousel:", error);
      this.showError(error.message);
    }
  }

  // Setup window resize listener for responsive positioning
  setupResizeListener() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.render();
      }, 100);
    });
  }

  // Bind DOM elements
  bindDOMElements() {
    this.loadingElement = document.getElementById("experiences-loading");
    this.carouselElement = document.getElementById("experiences-carousel");
    this.trackElement = document.getElementById("experiences-track");
    this.prevButton = document.getElementById("prev-btn");
    this.nextButton = document.getElementById("next-btn");
    this.dotsContainer = document.getElementById("carousel-dots");

    if (!this.trackElement) {
      throw new Error("Required carousel elements not found in DOM");
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Navigation buttons
    this.prevButton?.addEventListener("click", () => this.previousSlide());
    this.nextButton?.addEventListener("click", () => this.nextSlide());

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.previousSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });

    // Responsive handling
    window.addEventListener("resize", () => this.handleResize());

    // Pause autoplay on hover
    this.carouselElement?.addEventListener("mouseenter", () =>
      this.pauseAutoPlay()
    );
    this.carouselElement?.addEventListener("mouseleave", () =>
      this.startAutoPlay()
    );
  }

  // Load experiences from API
  async loadExperiences() {
    this.isLoading = true;
    this.showLoading();

    try {
      this.experiences = await experiencesAPI.fetchExperiences();
      console.log("📦 Loaded experiences:", this.experiences.length);
    } catch (error) {
      console.error("❌ Failed to load experiences:", error);
      throw error;
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }

  // Render the carousel
  render() {
    if (!this.experiences.length) return;

    this.renderSlides();
    this.updateCarousel();

    // Show carousel
    this.carouselElement?.classList.remove("hidden");
  }

  // Render slides with center-focused layout
  renderSlides() {
    // Get the visible slides (3 slides: prev, current, next)
    const visibleSlides = this.getVisibleSlides();

    const slidesHTML = visibleSlides
      .map((slideData, index) =>
        this.createSlideHTML(slideData.experience, slideData.position, index)
      )
      .join("");

    this.trackElement.innerHTML = slidesHTML;
  }

  // Get the 3 visible slides based on current position
  getVisibleSlides() {
    const totalSlides = this.experiences.length;
    if (totalSlides === 0) return [];

    const slides = [];

    // Calculate indices for prev, current, next
    const prevIndex =
      this.currentSlide === 0 ? totalSlides - 1 : this.currentSlide - 1;
    const currentIndex = this.currentSlide;
    const nextIndex =
      this.currentSlide === totalSlides - 1 ? 0 : this.currentSlide + 1;

    slides.push({
      experience: this.experiences[prevIndex],
      position: "left",
      index: prevIndex,
    });

    slides.push({
      experience: this.experiences[currentIndex],
      position: "center",
      index: currentIndex,
    });

    slides.push({
      experience: this.experiences[nextIndex],
      position: "right",
      index: nextIndex,
    });

    return slides;
  }

  // Create individual slide HTML
  createSlideHTML(experience, position) {
    // Get responsive transform values based on screen size
    const getResponsiveTransform = (position) => {
      const isMobile = window.innerWidth <= 640;
      const isTablet = window.innerWidth <= 768;

      let cardWidth, spacing;

      if (isMobile) {
        cardWidth = 200;
        spacing = 180; // Reduced spacing to bring cards closer to center
      } else if (isTablet) {
        cardWidth = 240;
        spacing = 220; // Reduced spacing to bring cards closer to center
      } else {
        cardWidth = 280;
        spacing = 260; // Reduced spacing to bring cards closer to center
      }

      // Calculate positions to center the carousel properly
      const centerOffset = -cardWidth / 2 - 50; // Center the middle card and shift left
      const leftOffset = -spacing - cardWidth / 2 - 50; // Position left card
      const rightOffset = spacing - cardWidth / 2 - 50; // Position right card

      const transforms = {
        left: `translateX(${leftOffset}px) translateY(-50%) scale(0.85) rotateY(-15deg)`,
        center: `translateX(${centerOffset}px) translateY(-50%) scale(1) rotateY(0deg)`,
        right: `translateX(${rightOffset}px) translateY(-50%) scale(0.85) rotateY(15deg)`,
      };

      return transforms[position];
    };

    // Define positioning and scaling based on position with spin animation
    const positionStyles = {
      left: {
        transform: getResponsiveTransform("left"),
        zIndex: "1",
        opacity: "0.6",
      },
      center: {
        transform: getResponsiveTransform("center"),
        zIndex: "10",
        opacity: "1",
      },
      right: {
        transform: getResponsiveTransform("right"),
        zIndex: "1",
        opacity: "0.6",
      },
    };

    const styles = positionStyles[position];

    // Get responsive card dimensions
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth <= 768;

    let cardWidth, cardHeight;

    if (isMobile) {
      cardWidth = 200;
      cardHeight = 320;
    } else if (isTablet) {
      cardWidth = 240;
      cardHeight = 380;
    } else {
      cardWidth = 280;
      cardHeight = 420;
    }

    return `
            <div class="carousel-slide absolute transition-all duration-700 ease-in-out cursor-pointer"
                 style="
                   width: ${cardWidth}px;
                   height: ${cardHeight}px;
                   left: 50%;
                   top: 50%;
                   transform: ${styles.transform};
                   z-index: ${styles.zIndex};
                   opacity: ${styles.opacity};
                 "
                 onclick="window.experiencesCarousel.handleSlideClick('${experience.id}', '${position}')">
                <div class="experience-card bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 relative" style="width: 100%; height: 100%; max-width: ${cardWidth}px; max-height: ${cardHeight}px;">

                    <!-- Full Background Image -->
                    <div class="absolute inset-0">
                        <img src="${experience.image}"
                             alt="${experience.title}"
                             class="w-full h-full object-cover transition-transform duration-300"
                             style="object-fit: cover; width: 100%; height: 100%;"
                             loading="lazy">

                        <!-- Dark Overlay for button visibility -->
                        <div class="absolute inset-0 bg-black/20"></div>
                    </div>

                    <!-- Explore More Button - Positioned at bottom right -->
                    <div class="absolute bottom-4 right-4">
                        <button class="bg-white/90 hover:bg-white text-gray-900 font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-sm backdrop-blur-sm flex items-center space-x-2">
                            <span>Explore More</span>
                            <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  // Update carousel position
  updateCarousel() {
    // Re-render slides with new positions
    this.renderSlides();
    this.updateNavigationButtons();
  }

  // Update navigation buttons
  updateNavigationButtons() {
    // In center-focused carousel, navigation is always available (circular)
    if (this.prevButton) {
      this.prevButton.style.opacity = "1";
    }

    if (this.nextButton) {
      this.nextButton.style.opacity = "1";
    }
  }

  // Navigation methods
  nextSlide() {
    const totalSlides = this.experiences.length;
    this.currentSlide = (this.currentSlide + 1) % totalSlides;
    this.updateCarousel();
  }

  previousSlide() {
    const totalSlides = this.experiences.length;
    this.currentSlide =
      this.currentSlide === 0 ? totalSlides - 1 : this.currentSlide - 1;
    this.updateCarousel();
  }

  goToSlide(index) {
    if (index >= 0 && index < this.experiences.length) {
      this.currentSlide = index;
      this.updateCarousel();
    }
  }

  // Handle slide click
  async handleSlideClick(experienceId, position) {
    console.log("🎯 Slide clicked:", experienceId, position);

    try {
      // Track the click
      await experiencesAPI.trackExperienceClick(experienceId, position);

      if (position === "center") {
        // Center slide clicked - show details
        const experience = this.experiences.find(
          (exp) => exp.id === experienceId
        );
        if (experience) {
          this.showExperienceModal(experience);
        }
      } else if (position === "left") {
        // Left slide clicked - go to previous
        this.previousSlide();
      } else if (position === "right") {
        // Right slide clicked - go to next
        this.nextSlide();
      }
    } catch (error) {
      console.error("❌ Error handling slide click:", error);
    }
  }

  // Handle experience click (legacy method)
  async handleExperienceClick(experienceId) {
    console.log("🎯 Experience clicked:", experienceId);

    try {
      // Track the click
      await experiencesAPI.trackExperienceClick(experienceId);

      // Find the experience
      const experience = this.experiences.find(
        (exp) => exp.id === experienceId
      );
      if (experience) {
        // Show experience details (you can customize this)
        this.showExperienceModal(experience);
      }
    } catch (error) {
      console.error("❌ Error handling experience click:", error);
    }
  }

  // Show experience modal (placeholder)
  showExperienceModal(experience) {
    alert(
      `Opening ${experience.title}...\n\n${experience.description}\n\nCategory: ${experience.category}\nRating: ${experience.metadata.rating}⭐`
    );
  }

  // Utility methods
  handleResize() {
    // Re-render on resize to adjust positioning
    this.render();
  }

  // Auto-play functionality
  startAutoPlay() {
    this.pauseAutoPlay(); // Clear any existing interval
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  // Loading and error states
  showLoading() {
    this.loadingElement?.classList.remove("hidden");
    this.carouselElement?.classList.add("hidden");
  }

  hideLoading() {
    this.loadingElement?.classList.add("hidden");
  }

  showError(message) {
    this.hideLoading();
    const errorHTML = `
            <div class="text-center py-20">
                <div class="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p class="text-gray-600 mb-4">${message}</p>
                <button onclick="window.experiencesCarousel.initialize()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Try Again
                </button>
            </div>
        `;

    if (this.carouselElement) {
      this.carouselElement.innerHTML = errorHTML;
      this.carouselElement.classList.remove("hidden");
    }
  }

  // Destroy carousel
  destroy() {
    this.pauseAutoPlay();
    // Remove event listeners if needed
    console.log("🗑️ Carousel destroyed");
  }
}

// Create and export singleton instance
const experiencesCarousel = new ExperiencesCarousel();

// Make it globally available
window.experiencesCarousel = experiencesCarousel;

export default experiencesCarousel;
