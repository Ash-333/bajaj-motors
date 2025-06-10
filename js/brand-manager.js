// Brand Manager for Dynamic Brand Switching
import { bikeDataUtils } from './bike-api.js';

export class BrandManager {
  constructor(carousel) {
    this.carousel = carousel;
    this.currentBrand = 'PULSAR';
    this.isTransitioning = false;
  }

  async init() {
    this.setupBrandTabs();
    this.setupEventListeners();
    await this.loadBrand(this.currentBrand);
  }

  setupBrandTabs() {
    const brandTabs = document.querySelectorAll('.s1-tab');

    brandTabs.forEach(tab => {
      const brandName = tab.getAttribute('data-brand') || tab.textContent.trim();

      // Set active state for current brand
      if (brandName === this.currentBrand) {
        this.setActiveTab(tab);
      } else {
        this.setInactiveTab(tab);
      }
    });
  }

  setupEventListeners() {
    const brandTabs = document.querySelectorAll('.s1-tab');

    brandTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        // Try data-brand attribute first, then fall back to text content
        const brandName = tab.getAttribute('data-brand') || tab.textContent.trim();
        this.switchToBrand(brandName);
      });

      // Add keyboard navigation
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const brandName = tab.getAttribute('data-brand') || tab.textContent.trim();
          this.switchToBrand(brandName);
        }
      });
    });
  }

  async switchToBrand(brandName) {
    if (this.isTransitioning || brandName === this.currentBrand) return;

    const brandData = bikeDataUtils.getBrandData(brandName);
    if (!brandData) {
      console.warn(`Brand ${brandName} not found`);
      return;
    }

    this.isTransitioning = true;

    try {
      // Update current brand first
      this.currentBrand = brandName;

      // Update active tab
      this.updateActiveTabs(brandName);

      // Load brand data
      await this.loadBrand(brandName);

      // Update carousel's brand state
      this.carousel.currentBrand = brandName;

      // Update carousel with new brand data
      this.carousel.updateBrandData(brandData);

    } catch (error) {
      console.error('Error switching brand:', error);
    } finally {
      this.isTransitioning = false;
    }
  }

  updateActiveTabs(activeBrandName) {
    const brandTabs = document.querySelectorAll('.s1-tab');

    brandTabs.forEach(tab => {
      const brandName = tab.getAttribute('data-brand') || tab.textContent.trim();

      if (brandName === activeBrandName) {
        this.setActiveTab(tab);
      } else {
        this.setInactiveTab(tab);
      }
    });
  }

  setActiveTab(tab) {
    // Remove all styling classes first
    tab.className = 's1-tab';
    // Add active styling to match the design
    tab.className += ' text-lg lg:text-xl font-semibold text-gray-800 border-b-2 border-black pb-2 transition-all duration-300 focus:outline-none';
  }

  setInactiveTab(tab) {
    // Remove all styling classes first
    tab.className = 's1-tab';
    // Add inactive styling to match the design
    tab.className += ' text-lg lg:text-xl font-semibold text-gray-400 border-b-2 border-transparent pb-2 hover:text-gray-600 transition-all duration-300 focus:outline-none';
  }

  async loadBrand(brandName) {
    const brandData = bikeDataUtils.getBrandData(brandName);
    if (!brandData) return;

    // Update background text
    this.updateBackgroundText(brandData.backgroundText);

    // Update brand description if needed
    this.updateBrandDescription();

    // Update logo and category display
    this.updateBrandLogoAndCategory(brandName);

    // Generate variant buttons for this brand
    this.generateVariantButtons(brandData.models);

    // Preload images for this brand
    await this.preloadBrandImages(brandData.models);
  }

  updateBackgroundText(text) {
    const backgroundTextElement = document.getElementById('background-brand-text');
    if (backgroundTextElement) {
      backgroundTextElement.textContent = text;
    }
  }

  updateBrandDescription() {
    // This could be used to update a brand description section if it exists
    // Currently not implemented in the UI
  }

  updateBrandLogoAndCategory(brandName) {
    // Update brand logo
    const brandLogo = document.getElementById('brand-logo');
    if (brandLogo) {
      const logoUrl = bikeDataUtils.getBrandLogo(brandName);
      brandLogo.src = logoUrl;
      brandLogo.alt = `${brandName} Logo`;
    }

    // Update category icon
    const categoryIcon = document.getElementById('category-icon');
    if (categoryIcon) {
      const iconUrl = bikeDataUtils.getCategoryIcon(brandName);
      categoryIcon.src = iconUrl;
      categoryIcon.alt = `${brandName} Category Icon`;
    }

    // Update category display text (will be updated by carousel when model changes)
    // Initial text can be set to brand name
    const categoryDisplayText = document.getElementById('category-display-text');
    if (categoryDisplayText) {
      const brandDisplayText = bikeDataUtils.getBrandDisplayText(brandName);
      categoryDisplayText.textContent = `${brandDisplayText} Series`;
    }
  }

  generateVariantButtons(models) {
    const variantContainer = document.getElementById('variant-tabs');
    if (!variantContainer) {
      console.error('Variant container not found');
      return;
    }

    // Clear existing buttons
    variantContainer.innerHTML = '';

    // Create new buttons for each model (horizontal layout, positioned right)
    models.forEach((model, index) => {
      const button = document.createElement('button');
      button.id = model.buttonId;
      button.className = `variant-btn text-sm lg:text-base font-medium transition-all duration-300
                         border-b-2 pb-2 hover:text-gray-600 focus:outline-none`;
      button.setAttribute('data-variant', index.toString());
      button.textContent = model.name;

      // Set active state for first model
      if (index === 0) {
        button.classList.add('font-semibold', 'border-black', 'text-black');
      } else {
        button.classList.add('text-gray-400', 'border-transparent');
      }

      variantContainer.appendChild(button);
    });

    // Update carousel's variant button references
    if (this.carousel) {
      this.carousel.refreshVariantButtons();
    }
  }

  async preloadBrandImages(models) {
    const preloadPromises = [];

    models.forEach(model => {
      model.availableColors.forEach(colorId => {
        const imageUrl = model.images[colorId];
        if (imageUrl) {
          const promise = new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = () => {
              console.warn(`Failed to load image: ${imageUrl}`);
              resolve(); // Don't reject, just warn
            };
            img.src = imageUrl;
          });
          preloadPromises.push(promise);
        }
      });
    });

    try {
      await Promise.all(preloadPromises);
      // Images preloaded successfully
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }

  // Loading state methods removed - no longer needed

  getCurrentBrand() {
    return this.currentBrand;
  }

  getBrandData(brandName = this.currentBrand) {
    return bikeDataUtils.getBrandData(brandName);
  }

  getAllBrands() {
    return bikeDataUtils.getAllBrands();
  }

  isValidBrand(brandName) {
    return bikeDataUtils.getBrandData(brandName) !== null;
  }

  getStatus() {
    return {
      currentBrand: this.currentBrand,
      isTransitioning: this.isTransitioning,
      availableBrands: this.getAllBrands()
    };
  }
}
