// Main Application Module
import { CarouselManager } from "./carousel.js";
import { NavbarManager } from "./navbar.js";

class BajajApp {
  constructor() {
    this.carouselManager = null;
    this.navbarManager = null;
  }

  // Initialize the application
  async initialize() {
    // Initialize carousel
    this.carouselManager = new CarouselManager();
    await this.carouselManager.initialize();

    // Initialize navbar (loads data when needed)
    this.navbarManager = new NavbarManager();
    this.navbarManager.initialize();

    // Make navbar manager globally available for HTML onclick handlers
    window.navbarManager = this.navbarManager;
  }

}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  const app = new BajajApp();
  await app.initialize();
});

// Export for potential module usage
export default BajajApp;
