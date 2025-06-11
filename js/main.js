// Main Application Module
import { CarouselManager } from "./carousel.js";
import { NavbarManager } from "./navbar.js";

class BajajApp {
  constructor() {
    this.carouselManager = null;
    this.navbarManager = null;
  }

  // Initialize the application
  initialize() {
    // Initialize carousel
    this.carouselManager = new CarouselManager();
    this.carouselManager.initialize();

    // Initialize navbar
    this.navbarManager = new NavbarManager();
    this.navbarManager.initialize();

    // Make navbar manager globally available for HTML onclick handlers
    window.navbarManager = this.navbarManager;
  }

  // Get carousel manager
  getCarouselManager() {
    return this.carouselManager;
  }

  // Get navbar manager
  getNavbarManager() {
    return this.navbarManager;
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
      carouselStats: this.carouselManager
        ? this.carouselManager.getStats()
        : null,
      currentCategory: this.navbarManager
        ? this.navbarManager.getCurrentCategory()
        : null,
    };
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const app = new BajajApp();
  app.initialize();
});

// Export for potential module usage
export default BajajApp;
