// Simplified Bike Carousel Component - Self-contained with JSON data loading
let bikeData = null;

// Load bike data from simplified JSON file
async function loadBikeData() {
    if (!bikeData) {
        try {
            const response = await fetch('./data/bike-carousel.json');
            bikeData = await response.json();
        } catch (error) {
            console.error('Error loading bike data:', error);
            bikeData = { brands: {}, colorVariants: {}, fallbackImage: '' };
        }
    }
    return bikeData;
}

// Simple utility functions - moved here from bike-api.js
function getAllBrands() {
    return Object.keys(bikeData.brands);
}

function getBrandData(brandName) {
    return bikeData.brands[brandName] || null;
}

function getColorVariant(colorId) {
    return bikeData.colorVariants[colorId] || null;
}

function getBrandLogo(brandName) {
    return `/assets/brand-logos/${brandName.toLowerCase()}-logo.svg`;
}

function getCategoryIcon(brandName) {
    return `/assets/category-icons/${brandName.toLowerCase()}-category-icon.svg`;
}

export class BikeCarousel {
  constructor() {
    // Elements
    this.bikeImage = document.getElementById("s1-bikeImage");
    this.title = document.getElementById("s1-title");
    this.description = document.getElementById("s1-description");
    this.prevBtn = document.getElementById("s1-prevBtn");
    this.nextBtn = document.getElementById("s1-nextBtn");
    this.seriesLink = document.getElementById("s1-seriesLink");

    // New logo and category elements
    this.brandLogo = document.getElementById("brand-logo");
    this.categoryIcon = document.getElementById("category-icon");
    this.categoryDisplayText = document.getElementById("category-display-text");

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

    // Initialize
    this.init();
  }

  async init() {
    try {
      // Load data first
      await loadBikeData();

      // Load initial brand data
      this.loadBrandData(this.currentBrand);

      // Add transition styles
      if (this.bikeImage) {
        this.bikeImage.className += ' transition-opacity duration-300 ease-in-out';
      }

      // Setup event listeners
      this.setupEventListeners();

      // Initialize view
      this.updateView(this.currentModelIndex, this.currentColorId);

    } catch (error) {
      console.error('Failed to initialize bike carousel:', error);
      this.showErrorState(error.message);
    }
  }

  showErrorState(message) {
    if (this.bikeImage) {
      this.bikeImage.src = bikeData.fallbackImage;
      this.bikeImage.alt = 'Error loading bike data';
    }
    if (this.title) {
      this.title.textContent = 'Error Loading Data';
    }
    if (this.description) {
      this.description.textContent = message || 'Failed to load bike information';
    }
  }

  loadBrandData(brandName) {
    const brandData = getBrandData(brandName);
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
    this.createVariantButtons();
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
    this.createVariantButtons();
    this.refreshVariantButtons();

    // Update view
    this.updateView(this.currentModelIndex, this.currentColorId);
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
    return new Promise((resolve) => {
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
      const buttonId = this.generateButtonId(model.name);
      this.updateVariantButtons(buttonId);

      // Update color buttons
      this.updateColorButtonsState(colorId);

      // Update series link
      this.updateSeriesLink(model);

      // Update category display
      this.updateCategoryDisplay();

      // Update logo and category section
      this.updateLogoAndCategory();

      // Fade in new image
      if (this.bikeImage) {
        this.bikeImage.style.opacity = "1";
      }

      this.isTransitioning = false;
    }, 300);
  }

  getModelImage(model, colorId) {
    return model.images[colorId] || model.images.black || bikeData.fallbackImage;
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

  createVariantButtons() {
    const variantTabsContainer = document.getElementById('variant-tabs');
    if (!variantTabsContainer) return;

    // Clear existing variant buttons
    variantTabsContainer.innerHTML = '';

    // Create variant buttons for each model in the current brand
    this.models.forEach((model, index) => {
      const variantButton = document.createElement('button');
      const buttonId = this.generateButtonId(model.name);

      variantButton.id = buttonId;
      variantButton.className = 'variant-btn px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 hover:text-black focus:outline-none';
      variantButton.textContent = model.name;
      variantButton.setAttribute('data-variant', index.toString());

      // Set initial active state for first model
      if (index === this.currentModelIndex) {
        variantButton.classList.add('font-semibold', 'border-black', 'text-black');
      } else {
        variantButton.classList.add('text-gray-400', 'border-transparent');
      }

      variantTabsContainer.appendChild(variantButton);
    });
  }

  generateButtonId(modelName) {
    // Generate a consistent button ID from model name
    return `s1-variant-${modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  }

  refreshVariantButtons() {
    // This will be called when brand changes to refresh button references
    this.variantButtons = document.querySelectorAll(".variant-btn");

    // Update the active variant button for the current model
    if (this.models.length > 0) {
      const currentModel = this.models[this.currentModelIndex];
      if (currentModel) {
        const buttonId = this.generateButtonId(currentModel.name);
        this.updateVariantButtons(buttonId);
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
      const colorVariant = getColorVariant(colorId);
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
      this.seriesLink.innerHTML = `
      <span class="inline-flex items-center gap-1">
        View Series page
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.3984 6.08398L20.1875 11.7559C20.2812 11.8496 20.3398 11.9629 20.3633 12.0957C20.3867 12.2285 20.3594 12.3574 20.2812 12.4824C20.25 12.5605 20.2109 12.623 20.1641 12.6699L14.4453 18.4824C14.3203 18.5918 14.1758 18.6465 14.0117 18.6465C13.8477 18.6465 13.7109 18.5918 13.6016 18.4824L13.3672 18.248C13.2578 18.123 13.2031 17.9785 13.2031 17.8145C13.2031 17.6504 13.2578 17.5137 13.3672 17.4043L17.6797 13.0215H5.89062C5.73438 13.0215 5.59766 12.9629 5.48047 12.8457C5.36328 12.7285 5.30469 12.584 5.30469 12.4121V12.084C5.30469 11.9277 5.36328 11.791 5.48047 11.6738C5.59766 11.5566 5.73438 11.498 5.89062 11.498H17.75L13.3438 7.18555C13.2344 7.07617 13.1758 6.93555 13.168 6.76367C13.1602 6.5918 13.2188 6.45117 13.3438 6.3418L13.5547 6.10742C13.6797 5.98242 13.8242 5.91992 13.9883 5.91992C14.1523 5.91992 14.2891 5.97461 14.3984 6.08398Z" fill="#326AD2"/>
</svg>
      </span>
    `;
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
    const colorVariant = getColorVariant(colorId);
    const colorNameElement = document.getElementById('current-color-name');

    if (colorNameElement && colorVariant) {
      colorNameElement.textContent = colorVariant.name;
    }
  }

  updateLogoAndCategory() {
    const currentModel = this.getCurrentModel();

    if (!currentModel) return;

    // Update brand logo
    if (this.brandLogo) {
      const logoUrl = getBrandLogo(this.currentBrand);
      this.brandLogo.src = logoUrl;
      this.brandLogo.alt = `${this.currentBrand} Logo`;
    }

    // Update category icon
    if (this.categoryIcon) {
      const iconUrl = getCategoryIcon(this.currentBrand);
      this.categoryIcon.src = iconUrl;
      this.categoryIcon.alt = `${currentModel.category} Icon`;
    }

    // Update category display text
    if (this.categoryDisplayText) {
      const brandData = getBrandData(this.currentBrand);
      const categoryText = `${brandData.name} ${currentModel.category}`;
      this.categoryDisplayText.textContent = categoryText;
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
      totalModels: this.models.length
    };
  }



  // Cleanup method
  destroy() {
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