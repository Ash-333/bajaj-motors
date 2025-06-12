// Blog API Service - Simulates API calls using fetch from JSON
export class BlogApiService {
  constructor() {
    this.apiUrl = '/data/blogs-api.json';
    this.blogData = null;
    this.isLoaded = false;
  }

  // Simulate API delay
  async simulateApiDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Load blog data (simulates initial API call)
  async loadBlogData() {
    if (this.isLoaded && this.blogData) {
      return this.blogData;
    }

    try {
      console.log('🔄 Fetching blog data from API...');
      
      // Simulate API loading delay
      await this.simulateApiDelay();
      
      const response = await fetch(this.apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.blogData = data;
      this.isLoaded = true;
      
      console.log('✅ Blog data loaded successfully');
      return data;
    } catch (error) {
      console.error('❌ Failed to load blog data:', error);
      throw new Error(`Failed to load blog data: ${error.message}`);
    }
  }

  // Get all blogs
  async getAllBlogs() {
    try {
      if (!this.blogData) {
        await this.loadBlogData();
      }
      
      return this.blogData.blogs.filter(blog => blog.status === 'published');
    } catch (error) {
      console.error('❌ Failed to get blogs:', error);
      throw error;
    }
  }

  // Get featured blogs
  async getFeaturedBlogs() {
    try {
      const blogs = await this.getAllBlogs();
      return blogs.filter(blog => blog.featured);
    } catch (error) {
      console.error('❌ Failed to get featured blogs:', error);
      throw error;
    }
  }

  // Get blogs by category
  async getBlogsByCategory(categoryId) {
    try {
      const blogs = await this.getAllBlogs();
      return blogs.filter(blog => blog.category.toLowerCase() === categoryId.toLowerCase());
    } catch (error) {
      console.error('❌ Failed to get blogs by category:', error);
      throw error;
    }
  }

  // Get blog by ID
  async getBlogById(blogId) {
    try {
      const blogs = await this.getAllBlogs();
      const blog = blogs.find(b => b.id === blogId);
      
      if (!blog) {
        throw new Error(`Blog with ID "${blogId}" not found`);
      }
      
      return blog;
    } catch (error) {
      console.error('❌ Failed to get blog by ID:', error);
      throw error;
    }
  }

  // Get recent blogs (latest 6)
  async getRecentBlogs(limit = 6) {
    try {
      const blogs = await this.getAllBlogs();
      return blogs
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, limit);
    } catch (error) {
      console.error('❌ Failed to get recent blogs:', error);
      throw error;
    }
  }

  // Get all categories
  async getCategories() {
    try {
      if (!this.blogData) {
        await this.loadBlogData();
      }
      
      return this.blogData.categories;
    } catch (error) {
      console.error('❌ Failed to get categories:', error);
      throw error;
    }
  }

  // Search blogs
  async searchBlogs(query) {
    try {
      const blogs = await this.getAllBlogs();
      const searchTerm = query.toLowerCase();
      
      return blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.excerpt.toLowerCase().includes(searchTerm) ||
        blog.content.toLowerCase().includes(searchTerm) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error('❌ Failed to search blogs:', error);
      throw error;
    }
  }

  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get category color
  getCategoryColor(categoryName) {
    const category = this.blogData?.categories.find(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || 'blue';
  }

  // Check if service is ready
  isReady() {
    return this.isLoaded && this.blogData !== null;
  }

  // Get service status
  getStatus() {
    return {
      isLoaded: this.isLoaded,
      hasData: this.blogData !== null,
      totalBlogs: this.blogData?.blogs?.length || 0
    };
  }
}

// Create singleton instance
export const blogApi = new BlogApiService();

// Utility functions for easy access
export const blogUtils = {
  // Get all blogs
  async getAllBlogs() {
    return await blogApi.getAllBlogs();
  },

  // Get featured blogs
  async getFeaturedBlogs() {
    return await blogApi.getFeaturedBlogs();
  },

  // Get recent blogs
  async getRecentBlogs(limit = 6) {
    return await blogApi.getRecentBlogs(limit);
  },

  // Get blog by ID
  async getBlogById(blogId) {
    return await blogApi.getBlogById(blogId);
  },

  // Get blogs by category
  async getBlogsByCategory(categoryId) {
    return await blogApi.getBlogsByCategory(categoryId);
  },

  // Search blogs
  async searchBlogs(query) {
    return await blogApi.searchBlogs(query);
  },

  // Get categories
  async getCategories() {
    return await blogApi.getCategories();
  },

  // Format date
  formatDate(dateString) {
    return blogApi.formatDate(dateString);
  },

  // Get category color
  getCategoryColor(categoryName) {
    return blogApi.getCategoryColor(categoryName);
  },

  // Check if service is ready
  isReady() {
    return blogApi.isReady();
  },

  // Get service status
  getStatus() {
    return blogApi.getStatus();
  }
};
