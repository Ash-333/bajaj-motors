// Main Application Module
import { CarouselManager } from "./carousel.js";
import { NavbarManager } from "./navbar.js";
import experiencesCarousel from "./experiencesCarousel.js";

class BajajApp {
  constructor() {
    this.carouselManager = null;
    this.navbarManager = null;
    this.experiencesCarousel = null;
  }

  // Initialize the application
  async initialize() {
    // Initialize carousel
    this.carouselManager = new CarouselManager();
    this.carouselManager.initialize();

    // Initialize navbar
    this.navbarManager = new NavbarManager();
    this.navbarManager.initialize();

    // Initialize experiences carousel
    this.experiencesCarousel = experiencesCarousel;
    await this.experiencesCarousel.initialize();

    // Make managers globally available for debugging and external access
    window.carouselManager = this.carouselManager;
    window.navbarManager = this.navbarManager;
    window.experiencesCarousel = this.experiencesCarousel;

    console.log("Bajaj App initialized successfully");
    console.log("Carousel stats:", this.carouselManager.getStats());
  }

  // Get carousel manager
  getCarouselManager() {
    return this.carouselManager;
  }

  // Get navbar manager
  getNavbarManager() {
    return this.navbarManager;
  }

  // Get experiences carousel
  getExperiencesCarousel() {
    return this.experiencesCarousel;
  }

  // Add new slide to carousel
  addCarouselSlide(slideData) {
    if (this.carouselManager) {
      return this.carouselManager.addSlide(slideData);
    }
    return null;
  }

  // Add new motorcycle
  addMotorcycle(category, motorcycle) {
    if (this.navbarManager) {
      this.navbarManager.addMotorcycle(category, motorcycle);
    }
  }

  // Update carousel settings
  updateCarouselSettings(settings) {
    if (this.carouselManager) {
      this.carouselManager.updateSettings(settings);
    }
  }

  // Get application status
  getStatus() {
    return {
      carouselInitialized: !!this.carouselManager,
      navbarInitialized: !!this.navbarManager,
      experiencesInitialized: !!this.experiencesCarousel,
      carouselStats: this.carouselManager
        ? this.carouselManager.getStats()
        : null,
      currentCategory: this.navbarManager
        ? this.navbarManager.getCurrentCategory()
        : null,
      experiencesCount: this.experiencesCarousel
        ? this.experiencesCarousel.experiences.length
        : 0,
    };
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  const app = new BajajApp();
  await app.initialize();

  // Make app globally available
  window.bajajApp = app;

  // Example usage functions for testing
  window.testCarousel = function () {
    console.log("Testing carousel functionality...");

    // Test adding a new slide
    app.addCarouselSlide({
      id: "test-slide",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
      title: "Test Slide",
      subtitle: "Testing functionality",
      description: "This is a test slide to verify carousel functionality.",
      cta: "Test Button",
      category: "test",
    });

    console.log(
      "New slide added. Current stats:",
      app.getCarouselManager().getStats()
    );
  };

  window.testNavbar = function () {
    console.log("Testing navbar functionality...");

    // Test adding a new motorcycle
    app.addMotorcycle("Test", {
      name: "Test Bike",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop",
    });

    console.log("New motorcycle added to Test category");
  };

  window.testExperiences = function () {
    console.log("Testing experiences functionality...");

    // Test carousel navigation
    const carousel = app.getExperiencesCarousel();
    if (carousel) {
      console.log("Current experiences:", carousel.experiences.length);
      console.log("Current slide:", carousel.currentSlide);

      // Test navigation
      setTimeout(() => carousel.nextSlide(), 1000);
      setTimeout(() => carousel.previousSlide(), 2000);
    }
  };

  window.getAppStatus = function () {
    console.log("App Status:", app.getStatus());
    return app.getStatus();
  };
});

// Export for potential module usage
export default BajajApp;
