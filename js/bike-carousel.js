// Enhanced Bike Carousel Component with Dynamic Data Loading
import { bikeDataUtils } from './bike-api.js';
import { AutoScrollManager } from './auto-scroll-manager.js';
import { BrandManager } from './brand-manager.js';

export class BikeCarousel {
  constructor() {
    // Elements
    this.bikeImage = document.getElementById("s1-bikeImage");
    this.title = document.getElementById("s1-title");
    this.description = document.getElementById("s1-description");
    this.prevBtn = document.getElementById("s1-prevBtn");
    this.nextBtn = document.getElementById("s1-nextBtn");
    this.seriesLink = document.getElementById("s1-seriesLink");

    // Dynamic elements (will be updated based on brand)
    this.thumbnails = [];
    this.variantButtons = [];
    this.colorButtons = [];

    // State management
    this.currentBrand = 'PULSAR';
    this.currentModelIndex = 0;
    this.currentColorId = 'black';
    this.currentColorIndex = 0; // Track color index for navigation
    this.isTransitioning = false;
    this.models = [];
    this.availableColors = []; // Current model's available colors

    // Managers
    this.autoScrollManager = null;
    this.brandManager = null;

    // Initialize
    this.init();
  }

  async init() {
    try {
      // Initialize data first
      await bikeDataUtils.initialize();

      // Initialize managers
      this.brandManager = new BrandManager(this);
      await this.brandManager.init();

      // Load initial brand data
      this.loadBrandData(this.currentBrand);

      // Add transition styles with Tailwind classes
      if (this.bikeImage) {
        this.bikeImage.className += ' transition-opacity duration-300 ease-in-out';
      }

      // Setup event listeners
      this.setupEventListeners();

      // Initialize auto-scroll
      this.initializeAutoScroll();

      // Initialize view
      this.updateView(this.currentModelIndex, this.currentColorId);

    } catch (error) {
      console.error('Failed to initialize bike carousel:', error);
      this.showErrorState(error.message);
    }
  }

  loadBrandData(brandName) {
    const brandData = bikeDataUtils.getBrandData(brandName);
    if (!brandData) {
      console.error(`Brand ${brandName} not found`);
      return;
    }

    this.currentBrand = brandName;
    this.models = brandData.models;
    this.currentModelIndex = 0;
    this.currentColorId = 'black';

    // Initialize available colors for the current model
    if (this.models.length > 0) {
      this.availableColors = this.models[0].availableColors;
      this.currentColorIndex = this.availableColors.indexOf(this.currentColorId);
      if (this.currentColorIndex === -1) {
        this.currentColorIndex = 0;
        this.currentColorId = this.availableColors[0];
      }
    }

    // Update UI elements
    this.updateColorButtons();
    this.refreshVariantButtons();
  }

  updateBrandData(brandData) {
    this.models = brandData.models;
    this.currentModelIndex = 0;
    this.currentColorId = 'black';

    // Initialize available colors for the current model
    if (this.models.length > 0) {
      this.availableColors = this.models[0].availableColors;
      this.currentColorIndex = this.availableColors.indexOf(this.currentColorId);
      if (this.currentColorIndex === -1) {
        this.currentColorIndex = 0;
        this.currentColorId = this.availableColors[0];
      }
    }

    // Update UI elements
    this.updateColorButtons();
    this.refreshVariantButtons();

    // Update view
    this.updateView(this.currentModelIndex, this.currentColorId);

    // Restart auto-scroll for new brand
    if (this.autoScrollManager) {
      this.autoScrollManager.stop();
      this.autoScrollManager.start();
    }
  }

  initializeAutoScroll() {
    const autoScrollConfig = bikeDataUtils.getAutoScrollConfig();
    this.autoScrollManager = new AutoScrollManager(this, autoScrollConfig);
  }

  async preloadImages() {
    if (!this.models.length) return;

    const preloadPromises = [];

    this.models.forEach((model) => {
      model.availableColors.forEach((colorId) => {
        const imageUrl = model.images[colorId];
        if (imageUrl) {
          const promise = this.loadImage(imageUrl);
          preloadPromises.push(promise);
        }
      });
    });

    try {
      await Promise.all(preloadPromises);
      console.log('Images preloaded successfully');
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        resolve(); // Don't reject, just warn
      };
      img.src = src;
    });
  }

  updateView(modelIndex, colorId = 'black') {
    if (this.isTransitioning || !this.models[modelIndex]) return;
    this.isTransitioning = true;

    const model = this.models[modelIndex];
    const imageUrl = this.getModelImage(model, colorId);

    // Fade out current image
    if (this.bikeImage) {
      this.bikeImage.style.opacity = "0";
    }

    setTimeout(() => {
      // Update content
      if (this.bikeImage) {
        this.bikeImage.src = imageUrl;
        this.bikeImage.alt = `${model.name} - ${colorId}`;
      }

      if (this.title) {
        this.title.textContent = model.name;
      }

      if (this.description) {
        this.description.textContent = model.description;
      }

      // Update active button styles
      this.updateVariantButtons(model.buttonId);

      // Update color buttons
      this.updateColorButtonsState(colorId);

      // Update series link
      this.updateSeriesLink(model);

      // Update category display
      this.updateCategoryDisplay();

      // Fade in new image
      if (this.bikeImage) {
        this.bikeImage.style.opacity = "1";
      }

      this.isTransitioning = false;
    }, 300);
  }

  getModelImage(model, colorId) {
    return model.images[colorId] || model.images.black || model.fallbackImage || '/assets/fallbacks/bike-placeholder.svg';
  }

  updateVariantButtons(activeButtonId) {
    // Get current variant buttons
    this.variantButtons = document.querySelectorAll(".variant-btn");

    this.variantButtons.forEach((btn) => {
      // Remove active classes
      btn.classList.remove("font-semibold", "border-black", "text-black");
      btn.classList.add("text-gray-400", "border-transparent", "font-medium");
    });

    const activeBtn = document.getElementById(activeButtonId);
    if (activeBtn) {
      activeBtn.classList.add("font-semibold", "border-black", "text-black");
      activeBtn.classList.remove("text-gray-400", "border-transparent", "font-medium");
    }
  }

  refreshVariantButtons() {
    // This will be called when brand changes to refresh button references
    this.variantButtons = document.querySelectorAll(".variant-btn");

    // Update the active variant button for the current model
    if (this.models.length > 0) {
      const currentModel = this.models[this.currentModelIndex];
      if (currentModel) {
        this.updateVariantButtons(currentModel.buttonId);
      }
    }
  }

  // Thumbnails removed - no longer needed

  // Thumbnail state updates removed - no longer needed

  updateColorButtons() {
    const colorContainer = document.getElementById('color-options');
    if (!colorContainer) return;

    // Clear existing color buttons
    colorContainer.innerHTML = '';

    // Get current model's available colors
    const currentModel = this.models[this.currentModelIndex];
    if (!currentModel) return;

    // Create color buttons for available colors
    currentModel.availableColors.forEach((colorId, index) => {
      const colorVariant = bikeDataUtils.getColorVariant(colorId);
      if (!colorVariant) return;

      const colorButton = document.createElement('button');
      colorButton.id = `s1-color-${colorId}`;
      colorButton.className = `w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 cursor-pointer
                              transition-all duration-200 hover:scale-110 focus:outline-none
                              focus:ring-2 focus:ring-offset-2 ${colorVariant.class}`;
      colorButton.setAttribute('data-color', index.toString());
      colorButton.setAttribute('data-color-id', colorId);
      colorButton.setAttribute('tabindex', '0');
      colorButton.title = colorVariant.name;

      // Set initial state based on current color
      if (colorId === this.currentColorId) {
        colorButton.classList.add('border-gray-800', 'ring-2', 'ring-gray-600', 'scale-110', 'ring-offset-2');
      } else {
        colorButton.classList.add('border-gray-300');
      }

      colorContainer.appendChild(colorButton);
    });

    // Update color buttons reference
    this.colorButtons = document.querySelectorAll('[data-color]');
  }

  updateColorButtonsState(activeColorId) {
    // Refresh the color buttons reference in case they were regenerated
    this.colorButtons = document.querySelectorAll('[data-color-id]');

    this.colorButtons.forEach((btn) => {
      // Remove all active state classes
      btn.classList.remove("ring-2", "ring-gray-400", "scale-110", "border-gray-800", "ring-offset-2");
      btn.classList.add("border-gray-300");

      const btnColorId = btn.getAttribute('data-color-id');
      if (btnColorId === activeColorId) {
        // Add active state with stronger visual feedback
        btn.classList.add("ring-2", "ring-gray-600", "scale-110", "border-gray-800", "ring-offset-2");
        btn.classList.remove("border-gray-300");
      }
    });
  }

  updateSeriesLink(model) {
    if (this.seriesLink) {
      this.seriesLink.textContent = `View ${model.name} series page →`;
      this.seriesLink.href = `#${model.id}`;
    }
  }

  setupEventListeners() {
    // Arrow click events
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.nextSlide();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.prevSlide();
      });
    }

    // Use event delegation for dynamic elements
    document.addEventListener('click', (e) => {
      // Variant button clicks
      if (e.target.classList.contains('variant-btn')) {
        e.preventDefault();
        if (this.isTransitioning) return;
        const variantIndex = parseInt(e.target.getAttribute("data-variant"));
        if (!isNaN(variantIndex) && variantIndex < this.models.length) {
          this.currentModelIndex = variantIndex;

          // Update available colors for the new model
          this.availableColors = this.models[variantIndex].availableColors;
          this.currentColorId = this.availableColors[0]; // Reset to first available color
          this.currentColorIndex = 0;

          this.updateView(this.currentModelIndex, this.currentColorId);
          this.updateVariantButtons(e.target.id);
          this.updateColorButtons(); // Refresh color options for new variant
          this.updateColorButtonsState(this.currentColorId);
          this.updateColorNameDisplay(this.currentColorId);
        }
      }

      // Thumbnail functionality removed

      // Color picker functionality
      if (e.target.hasAttribute('data-color-id')) {
        if (this.isTransitioning) return;
        const colorId = e.target.getAttribute('data-color-id');
        if (colorId) {
          this.currentColorId = colorId;
          this.currentColorIndex = this.availableColors.indexOf(colorId);
          this.updateView(this.currentModelIndex, this.currentColorId);
          this.updateColorButtonsState(colorId);
          this.updateColorNameDisplay(colorId);
        }
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (this.isTransitioning) return;

      // Only handle keyboard events when carousel is focused or no other input is focused
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      );

      if (!isInputFocused) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          this.nextSlide();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.prevSlide();
        }
      }
    });
  }

  nextSlide() {
    if (this.isTransitioning || this.models.length === 0) return;

    // Navigate through models within the current brand
    this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;

    // Update available colors for the new model
    this.availableColors = this.models[this.currentModelIndex].availableColors;

    // Try to maintain the current color, or fall back to first available color
    if (this.availableColors.includes(this.currentColorId)) {
      this.currentColorIndex = this.availableColors.indexOf(this.currentColorId);
    } else {
      this.currentColorId = this.availableColors[0];
      this.currentColorIndex = 0;
    }

    this.updateView(this.currentModelIndex, this.currentColorId);
    this.updateColorButtons(); // Refresh color options for new model
    this.updateColorButtonsState(this.currentColorId);
    this.updateColorNameDisplay(this.currentColorId);
  }

  prevSlide() {
    if (this.isTransitioning || this.models.length === 0) return;

    // Navigate through models within the current brand
    this.currentModelIndex = (this.currentModelIndex - 1 + this.models.length) % this.models.length;

    // Update available colors for the new model
    this.availableColors = this.models[this.currentModelIndex].availableColors;

    // Try to maintain the current color, or fall back to first available color
    if (this.availableColors.includes(this.currentColorId)) {
      this.currentColorIndex = this.availableColors.indexOf(this.currentColorId);
    } else {
      this.currentColorId = this.availableColors[0];
      this.currentColorIndex = 0;
    }

    this.updateView(this.currentModelIndex, this.currentColorId);
    this.updateColorButtons(); // Refresh color options for new model
    this.updateColorButtonsState(this.currentColorId);
    this.updateColorNameDisplay(this.currentColorId);
  }

  updateColorNameDisplay(colorId) {
    const colorVariant = bikeDataUtils.getColorVariant(colorId);
    const colorNameElement = document.getElementById('current-color-name');

    if (colorNameElement && colorVariant) {
      colorNameElement.textContent = colorVariant.name;
    }
  }

  updateCategoryDisplay() {
    const currentModel = this.getCurrentModel();
    const categoryElement = document.getElementById('bike-category');

    if (categoryElement && currentModel) {
      const brandName = this.currentBrand.charAt(0) + this.currentBrand.slice(1).toLowerCase();
      categoryElement.textContent = `${brandName} ${currentModel.category}`;
    }
  }

  // Public API methods
  getCurrentModel() {
    return this.models[this.currentModelIndex] || null;
  }

  getCurrentBrand() {
    return this.currentBrand;
  }

  getCurrentColor() {
    return this.currentColorId;
  }

  getStatus() {
    return {
      currentBrand: this.currentBrand,
      currentModelIndex: this.currentModelIndex,
      currentColorId: this.currentColorId,
      isTransitioning: this.isTransitioning,
      totalModels: this.models.length,
      autoScrollStatus: this.autoScrollManager ? this.autoScrollManager.getStatus() : null
    };
  }

  // Auto-scroll control methods
  startAutoScroll() {
    if (this.autoScrollManager) {
      this.autoScrollManager.start();
    }
  }

  stopAutoScroll() {
    if (this.autoScrollManager) {
      this.autoScrollManager.stop();
    }
  }

  pauseAutoScroll() {
    if (this.autoScrollManager) {
      this.autoScrollManager.pause();
    }
  }

  resumeAutoScroll() {
    if (this.autoScrollManager) {
      this.autoScrollManager.resume();
    }
  }

  // Cleanup method
  destroy() {
    if (this.autoScrollManager) {
      this.autoScrollManager.destroy();
    }

    // Remove event listeners would require storing references
    // For now, we'll rely on garbage collection
  }

  // Error handling
  handleImageError(imageElement) {
    const currentModel = this.getCurrentModel();
    if (currentModel && currentModel.fallbackImage) {
      imageElement.src = currentModel.fallbackImage;
    } else {
      imageElement.src = '/assets/fallbacks/bike-placeholder.svg';
    }
    console.warn('Image failed to load, using fallback');
  }

  // Utility method for external access
  switchToModel(modelIndex, colorId = null) {
    if (modelIndex >= 0 && modelIndex < this.models.length) {
      this.currentModelIndex = modelIndex;
      if (colorId) {
        this.currentColorId = colorId;
      }
      this.updateView(this.currentModelIndex, this.currentColorId);
    }
  }

  switchToColor(colorId) {
    const currentModel = this.getCurrentModel();
    if (currentModel && currentModel.availableColors.includes(colorId)) {
      this.currentColorId = colorId;
      this.currentColorIndex = this.availableColors.indexOf(colorId);
      this.updateView(this.currentModelIndex, this.currentColorId);
      this.updateColorButtonsState(colorId);
      this.updateColorNameDisplay(colorId);
    }
  }

  // Navigate to next/previous color (for potential future use)
  nextColor() {
    if (this.isTransitioning || this.availableColors.length === 0) return;

    this.currentColorIndex = (this.currentColorIndex + 1) % this.availableColors.length;
    this.currentColorId = this.availableColors[this.currentColorIndex];
    this.updateView(this.currentModelIndex, this.currentColorId);
    this.updateColorButtonsState(this.currentColorId);
    this.updateColorNameDisplay(this.currentColorId);
  }

  prevColor() {
    if (this.isTransitioning || this.availableColors.length === 0) return;

    this.currentColorIndex = (this.currentColorIndex - 1 + this.availableColors.length) % this.availableColors.length;
    this.currentColorId = this.availableColors[this.currentColorIndex];
    this.updateView(this.currentModelIndex, this.currentColorId);
    this.updateColorButtonsState(this.currentColorId);
    this.updateColorNameDisplay(this.currentColorId);
  }

  // Error State Management

  showErrorState(errorMessage) {
    const errorOverlay = document.createElement('div');
    errorOverlay.id = 'carousel-error-overlay';
    errorOverlay.className = `fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50
                             transition-opacity duration-300`;
    errorOverlay.innerHTML = `
      <div class="flex flex-col items-center space-y-6 max-w-md text-center p-8">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Failed to Load Bike Data</h3>
          <p class="text-gray-600 mb-4">${errorMessage}</p>
          <button id="retry-load-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
            Retry Loading
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(errorOverlay);

    // Add retry functionality
    const retryBtn = document.getElementById('retry-load-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        errorOverlay.remove();
        this.init(); // Retry initialization
      });
    }
  }
}