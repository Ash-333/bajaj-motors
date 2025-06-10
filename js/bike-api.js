// Bike API Service - Dynamic Data Management System
export class BikeApiService {
  constructor() {
    this.apiUrl = '/data/bikes-api.json';
    this.bikeData = null;
    this.isLoaded = false;
    this.loadingPromise = null;
  }

  // Load bike data from JSON API
  async loadBikeData() {
    if (this.isLoaded && this.bikeData) {
      return this.bikeData;
    }

    // If already loading, return the existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this._fetchBikeData();
    return this.loadingPromise;
  }

  // Private method to fetch data
  async _fetchBikeData() {
    try {
      const response = await fetch(this.apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate data structure
      this._validateDataStructure(data);
      
      this.bikeData = data;
      this.isLoaded = true;
      
      return data;
    } catch (error) {
      console.error('Failed to load bike data:', error);
      throw new Error(`Failed to load bike data: ${error.message}`);
    }
  }

  // Validate the loaded JSON data structure
  _validateDataStructure(data) {
    const requiredFields = ['autoScrollConfig', 'colorVariants', 'brands'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate brands structure
    if (typeof data.brands !== 'object' || Object.keys(data.brands).length === 0) {
      throw new Error('Invalid brands data structure');
    }

    // Validate each brand has required fields
    for (const [brandName, brandData] of Object.entries(data.brands)) {
      if (!brandData.models || !Array.isArray(brandData.models)) {
        throw new Error(`Brand ${brandName} missing models array`);
      }
    }
  }

  // Get all brand names
  getAllBrands() {
    if (!this.bikeData) {
      throw new Error('Bike data not loaded. Call loadBikeData() first.');
    }
    return Object.keys(this.bikeData.brands);
  }

  // Get brand data by name
  getBrandData(brandName) {
    if (!this.bikeData) {
      throw new Error('Bike data not loaded. Call loadBikeData() first.');
    }
    return this.bikeData.brands[brandName] || null;
  }

  // Get all models for a brand
  getBrandModels(brandName) {
    const brand = this.getBrandData(brandName);
    return brand ? brand.models : [];
  }

  // Get model by ID
  getModelById(modelId) {
    if (!this.bikeData) {
      throw new Error('Bike data not loaded. Call loadBikeData() first.');
    }

    for (const brandName of this.getAllBrands()) {
      const models = this.getBrandModels(brandName);
      const model = models.find(m => m.id === modelId);
      if (model) return model;
    }
    return null;
  }

  // Get available colors for a model
  getModelColors(modelId) {
    const model = this.getModelById(modelId);
    if (!model) return [];

    return model.availableColors.map(colorId => {
      const colorVariant = this.bikeData.colorVariants.find(c => c.id === colorId);
      return colorVariant || null;
    }).filter(Boolean);
  }

  // Get image URL for model and color
  getModelImage(modelId, colorId = 'black') {
    const model = this.getModelById(modelId);
    if (!model) return null;

    return model.images[colorId] || model.images.black || model.fallbackImage;
  }

  // Validate if color is available for model
  isColorAvailable(modelId, colorId) {
    const model = this.getModelById(modelId);
    return model ? model.availableColors.includes(colorId) : false;
  }

  // Get categories for a brand
  getBrandCategories(brandName) {
    const brand = this.getBrandData(brandName);
    return brand ? brand.categories : [];
  }

  // Get models by category within a brand
  getModelsByCategory(brandName, category) {
    const models = this.getBrandModels(brandName);
    return models.filter(model => model.category === category);
  }

  // Get auto-scroll configuration
  getAutoScrollConfig() {
    if (!this.bikeData) {
      throw new Error('Bike data not loaded. Call loadBikeData() first.');
    }
    return { ...this.bikeData.autoScrollConfig };
  }

  // Get color variant by ID
  getColorVariant(colorId) {
    if (!this.bikeData) {
      throw new Error('Bike data not loaded. Call loadBikeData() first.');
    }
    return this.bikeData.colorVariants.find(c => c.id === colorId) || null;
  }

  // Get all color variants
  getAllColorVariants() {
    if (!this.bikeData) {
      throw new Error('Bike data not loaded. Call loadBikeData() first.');
    }
    return [...this.bikeData.colorVariants];
  }

  // Check if data is loaded
  isDataLoaded() {
    return this.isLoaded && this.bikeData !== null;
  }

  // Get loading status
  getLoadingStatus() {
    return {
      isLoaded: this.isLoaded,
      hasData: this.bikeData !== null,
      isLoading: this.loadingPromise !== null && !this.isLoaded
    };
  }
}

// Create singleton instance
export const bikeApiService = new BikeApiService();

// Utility functions that match the original bike-data.js interface
export const bikeDataUtils = {
  // Load data first (must be called before using other methods)
  async initialize() {
    return await bikeApiService.loadBikeData();
  },

  // Get all brand names
  getAllBrands() {
    return bikeApiService.getAllBrands();
  },

  // Get brand data by name
  getBrandData(brandName) {
    return bikeApiService.getBrandData(brandName);
  },

  // Get all models for a brand
  getBrandModels(brandName) {
    return bikeApiService.getBrandModels(brandName);
  },

  // Get model by ID
  getModelById(modelId) {
    return bikeApiService.getModelById(modelId);
  },

  // Get available colors for a model
  getModelColors(modelId) {
    return bikeApiService.getModelColors(modelId);
  },

  // Get image URL for model and color
  getModelImage(modelId, colorId = 'black') {
    return bikeApiService.getModelImage(modelId, colorId);
  },

  // Validate if color is available for model
  isColorAvailable(modelId, colorId) {
    return bikeApiService.isColorAvailable(modelId, colorId);
  },

  // Get categories for a brand
  getBrandCategories(brandName) {
    return bikeApiService.getBrandCategories(brandName);
  },

  // Get models by category within a brand
  getModelsByCategory(brandName, category) {
    return bikeApiService.getModelsByCategory(brandName, category);
  },

  // Get auto-scroll configuration
  getAutoScrollConfig() {
    return bikeApiService.getAutoScrollConfig();
  },

  // Get color variant by ID
  getColorVariant(colorId) {
    return bikeApiService.getColorVariant(colorId);
  },

  // Get all color variants
  getAllColorVariants() {
    return bikeApiService.getAllColorVariants();
  },

  // Check if data is loaded
  isDataLoaded() {
    return bikeApiService.isDataLoaded();
  }
};
