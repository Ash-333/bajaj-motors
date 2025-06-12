// Bike Section Initialization
import { BikeCarousel } from './bike-carousel.js';

// Initialize the enhanced bike carousel when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const bikeCarousel = new BikeCarousel();

    // Make carousel globally available for debugging
    window.bikeCarousel = bikeCarousel;

    // Initialize with async data loading
    await bikeCarousel.init();

  } catch (error) {
    console.error('Failed to initialize bike carousel:', error);
  }
});
