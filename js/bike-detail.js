// Bike Detail Page JavaScript
class BikeDetailPage {
  constructor() {
    this.bikeData = null;
    this.currentBike = null;
    this.currentColor = 'black';
    this.currentTab = 'performance';

    // DOM elements
    this.heroImage = document.getElementById('hero-bike-image');
    this.bikeTitle = document.getElementById('bike-title');
    this.bikeDescription = document.getElementById('bike-description');
    this.colorSelector = document.getElementById('color-selector');
    this.keyFeatures = document.getElementById('key-features');

    // Tab elements
    this.specTabs = document.querySelectorAll('.spec-tab-compact');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.performanceSpecs = document.getElementById('performance-specs');
    this.designSpecs = document.getElementById('design-specs');
    this.techSpecs = document.getElementById('tech-specs');
    this.safetySpecs = document.getElementById('safety-specs');
    this.specBikeImage = document.getElementById('spec-bike-image');

    // 360° Viewer
    this.viewer360Container = document.getElementById('bike-360-viewer');
    this.fallbackContainer = document.getElementById('fallback-container');
    this.fallbackBikeImage = document.getElementById('fallback-bike-image');
    this.viewer360 = null;
    this.bikePriceElement = document.getElementById('bike-price');
  }

  async init() {
    try {
      // Get bike ID from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const bikeId = urlParams.get('bike');
      
      if (!bikeId) {
        this.showError('No bike specified');
        return;
      }

      // Load bike data
      await this.loadBikeData();
      
      // Get specific bike data
      this.currentBike = this.bikeData.bikes[bikeId];
      
      if (!this.currentBike) {
        this.showError('Bike not found');
        return;
      }

      // Initialize the page
      this.renderBikeDetails();
      this.setupEventListeners();
      
    } catch (error) {
      console.error('Failed to initialize bike detail page:', error);
      this.showError('Failed to load bike details');
    }
  }

  async loadBikeData() {
    try {
      const response = await fetch('./data/bike-details.json');
      if (!response.ok) {
        throw new Error('Failed to fetch bike data');
      }
      this.bikeData = await response.json();
    } catch (error) {
      console.error('Error loading bike data:', error);
      throw error;
    }
  }

  renderBikeDetails() {
    // Update page title
    document.title = `${this.currentBike.name} - Bajaj Motors`;
    
    // Render hero image
    this.updateHeroImage();
    this.updateSpecBikeImage();
    
    // Render basic info
    this.bikeTitle.textContent = this.currentBike.name;
    this.bikeDescription.textContent = this.currentBike.description;
    
    // Render color selector
    this.renderColorSelector();
    
    // Render key features
    this.renderKeyFeatures();
    
    // Render specifications
    this.renderTabbedSpecifications();

    // Initialize 360° viewer
    this.init360Viewer();

    // Update pricing information
    this.updatePricing();
  }

  updateHeroImage() {
    // For hero image, always use color-specific image
    const imageUrl = this.currentBike.colors[this.currentColor]?.image ||
                     this.currentBike.images[this.currentColor] ||
                     this.currentBike.heroImage;

    this.heroImage.src = imageUrl;
    this.heroImage.alt = `${this.currentBike.name} - ${this.currentColor}`;
  }

  updateSpecBikeImage() {
    let imageUrl;

    // For spec image, use tab-specific image if available, otherwise use color-specific
    if (this.currentBike.tabImages && this.currentBike.tabImages[this.currentTab]) {
      imageUrl = this.currentBike.tabImages[this.currentTab];
    } else {
      imageUrl = this.currentBike.colors[this.currentColor]?.image ||
                 this.currentBike.images[this.currentColor] ||
                 this.currentBike.heroImage;
    }

    if (this.specBikeImage) {
      this.specBikeImage.src = imageUrl;
      this.specBikeImage.alt = `${this.currentBike.name} - ${this.currentTab}`;
    }
  }

  renderColorSelector() {
    this.colorSelector.innerHTML = '';
    
    this.currentBike.availableColors.forEach(colorKey => {
      const colorData = this.currentBike.colors[colorKey];
      if (!colorData) return;
      
      const colorButton = document.createElement('button');
      colorButton.className = `w-8 h-8 rounded-full border-2 transition-all duration-200 ${
        this.currentColor === colorKey 
          ? 'border-gray-800 scale-110' 
          : 'border-gray-300 hover:border-gray-500'
      }`;
      colorButton.style.backgroundColor = colorData.code;
      colorButton.title = colorData.name;
      colorButton.setAttribute('data-color', colorKey);
      
      this.colorSelector.appendChild(colorButton);
    });
  }

  renderKeyFeatures() {
    this.keyFeatures.innerHTML = '';
    
    this.currentBike.keyFeatures.forEach(feature => {
      const featureCard = document.createElement('div');
      featureCard.className = 'bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200';
      featureCard.innerHTML = `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p class="text-gray-700 font-medium">${feature}</p>
        </div>
      `;
      
      this.keyFeatures.appendChild(featureCard);
    });
  }

  renderTabbedSpecifications() {
    // Define specification mapping for each tab
    const specMapping = {
      performance: {
        title: 'Performance',
        sections: ['engine', 'transmission', 'performance']
      },
      design: {
        title: 'Design',
        sections: ['dimensions', 'chassis']
      },
      tech: {
        title: 'Technology',
        sections: ['features']
      },
      safety: {
        title: 'Safety',
        sections: ['chassis'] // Will filter for safety-related specs
      }
    };

    // Render each tab's content
    Object.entries(specMapping).forEach(([tabKey, tabConfig]) => {
      const container = document.getElementById(`${tabKey}-specs`);
      if (!container) return;

      container.innerHTML = '';

      tabConfig.sections.forEach(sectionKey => {
        const section = this.currentBike.specifications[sectionKey];
        if (!section) return;

        // For safety tab, filter chassis specs to safety-related only
        let specs = section.specs;
        if (tabKey === 'safety' && sectionKey === 'chassis') {
          specs = this.filterSafetySpecs(section.specs);
        }

        if (Object.keys(specs).length === 0) return;

        const specSection = this.createSpecSection(section.title, specs);
        container.appendChild(specSection);
      });
    });
  }

  filterSafetySpecs(specs) {
    const safetyKeys = ['Front Brake', 'Rear Brake', 'ABS', 'Front Suspension', 'Rear Suspension'];
    const filteredSpecs = {};

    Object.entries(specs).forEach(([key, value]) => {
      if (safetyKeys.some(safetyKey => key.includes(safetyKey))) {
        filteredSpecs[key] = value;
      }
    });

    return filteredSpecs;
  }

  createSpecSection(title, specs) {
    const specSection = document.createElement('div');
    specSection.className = 'space-y-2';

    let specsHTML = '';
    Object.entries(specs).forEach(([key, value]) => {
      specsHTML += `
        <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
          <span class="text-sm text-gray-600">${key}</span>
          <span class="text-sm font-medium text-gray-900">${value}</span>
        </div>
      `;
    });

    specSection.innerHTML = specsHTML;

    return specSection;
  }

  init360Viewer() {
    // Check if 360° viewer images are available for this bike
    if (!this.currentBike.viewer360Images || this.currentBike.viewer360Images.length === 0) {
      // Show fallback container if 360° viewer images are not available
      this.viewer360Container.classList.add('hidden');
      if (this.fallbackContainer) {
        this.fallbackContainer.classList.remove('hidden');
        if (this.fallbackBikeImage) {
          this.fallbackBikeImage.src = this.currentBike.heroImage;
        }
      }
      return;
    }

    try {
      // Initialize 360° viewer with bike-specific images
      const viewerConfig = {
        images: this.currentBike.viewer360Images
      };

      this.viewer360 = new Bike360Viewer('bike-360-viewer', viewerConfig);

      // Hide fallback container
      if (this.fallbackContainer) {
        this.fallbackContainer.classList.add('hidden');
      }

      // Show main viewer container
      this.viewer360Container.classList.remove('hidden');

    } catch (error) {
      console.error('Failed to initialize 360° viewer:', error);
      // Fallback to static image
      this.viewer360Container.classList.add('hidden');
      if (this.fallbackContainer) {
        this.fallbackContainer.classList.remove('hidden');
        if (this.fallbackBikeImage) {
          this.fallbackBikeImage.src = this.currentBike.heroImage;
        }
      }
    }
  }

  setupEventListeners() {
    // Color selector event listeners
    this.colorSelector.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-color')) {
        this.currentColor = e.target.getAttribute('data-color');
        this.updateHeroImage();
        this.updateSpecBikeImage();
        this.renderColorSelector();
      }
    });

    // Tab switching event listeners
    this.specTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.getAttribute('data-tab');
        if (tabName) {
          this.switchTab(tabName);
        }
      });
    });


  }

  switchTab(tabName) {
    // Update current tab
    this.currentTab = tabName;

    // Update tab buttons
    this.specTabs.forEach(tab => {
      const isActive = tab.getAttribute('data-tab') === tabName;
      if (isActive) {
        tab.className = 'spec-tab-compact px-3 py-2 text-sm font-medium bg-gray-900 text-white transition-all duration-200';
      } else {
        tab.className = 'spec-tab-compact px-3 py-2 text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200';
      }
    });

    // Update tab content visibility
    this.tabContents.forEach(content => {
      const contentId = content.id.replace('-content', '');
      if (contentId === tabName) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });

    // Update images when tab changes
    this.updateImagesForTab(tabName);
  }

  updateImagesForTab(tabName) {
    // Only update the spec bike image with tab-specific image
    // Hero image stays with color-specific image
    this.updateSpecImageWithTransition();
  }

  updatePricing() {
    if (this.bikePriceElement && this.currentBike.price) {
      this.bikePriceElement.innerHTML = `
        <div class="text-2xl font-bold text-[#0F0F0F] mb-2">
          Starts at रु ${this.currentBike.price.toLocaleString()}
        </div>
        <div class="text-lg text-[#0F0F0F] opacity-90">
          Available at all authorized Bajaj
        </div>
        <div class="text-lg text-[#0F0F0F] opacity-90">
          showrooms across Nepal
        </div>
      `;
    }
  }

  updateSpecImageWithTransition() {
    // Add fade effect for smooth transition on spec bike image only
    if (this.specBikeImage) {
      this.specBikeImage.style.opacity = '0.5';
      setTimeout(() => {
        this.updateSpecBikeImage();
        this.specBikeImage.style.opacity = '1';
      }, 150);
    }
  }

  cleanup() {
    // Cleanup 360° viewer resources
    if (this.viewer360) {
      this.viewer360.destroy();
      this.viewer360 = null;
    }
  }

  showError(message) {
    this.cleanup();
    document.body.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Error</h1>
          <p class="text-xl text-gray-600 mb-8">${message}</p>
          <a href="index.html" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Back to Home
          </a>
        </div>
      </div>
    `;
  }
}

// Initialize the bike detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const bikeDetailPage = new BikeDetailPage();
  bikeDetailPage.init();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    bikeDetailPage.cleanup();
  });

  // Make it globally available for debugging
  window.bikeDetailPage = bikeDetailPage;
});

// Make it globally available for debugging
window.BikeDetailPage = BikeDetailPage;
