// Simplified Blog Section - Direct approach like bike section
let blogData = null;

// Load blog data from JSON file - simple and direct
async function loadBlogData() {
  if (!blogData) {
    try {
      const response = await fetch('/data/blogs-api.json');
      blogData = await response.json();
    } catch (error) {
      console.error('Error loading blog data:', error);
      blogData = { blogs: [] };
    }
  }
  return blogData;
}

// Simple utility functions
function getRecentBlogs(limit = 4) {
  return blogData.blogs
    .filter(blog => blog.status === 'published')
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, limit);
}

function getFeaturedBlog() {
  return blogData.blogs.find(blog => blog.featured && blog.status === 'published') || null;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

class BlogSection {
  constructor() {
    this.blogGrid = document.getElementById('blog-grid');
    this.init();
  }

  async init() {
    try {
      // Load data first
      await loadBlogData();

      // Load blogs
      this.loadBlogs();
    } catch (error) {
      console.error('Failed to initialize blog section:', error);
      this.showError();
    }
  }

  loadBlogs() {
    try {
      // Show loading state
      this.showLoadingState();

      // Get recent blogs (4 latest - 1 featured + 3 bottom)
      const blogs = getRecentBlogs(4);

      if (blogs.length === 0) {
        this.showEmptyState();
        return;
      }

      // Clear existing content
      this.blogGrid.innerHTML = '';

      // Create blog layout
      this.createBlogLayout(blogs);

    } catch (error) {
      console.error('Failed to load blogs:', error);
      this.showError();
    }
  }

  createBlogLayout(blogs) {
    // Get featured blog (first one or specifically marked as featured)
    const featuredBlog = blogs.find(blog => blog.featured) || blogs[0];
    const otherBlogs = blogs.filter(blog => blog.id !== featuredBlog.id).slice(0, 3);

    // Create left side - featured blog text
    const featuredTextElement = this.createFeaturedTextElement(featuredBlog);
    this.blogGrid.appendChild(featuredTextElement);

    // Create right side - featured blog image
    const featuredImageElement = this.createFeaturedImageElement(featuredBlog);
    this.blogGrid.appendChild(featuredImageElement);

    // Create bottom row container
    const bottomRowContainer = document.createElement('div');
    bottomRowContainer.className = 'lg:col-span-10';
    bottomRowContainer.style.gridColumn = '1 / -1'; // Span all columns

    const bottomGrid = document.createElement('div');
    bottomGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 mt-6';

    // Add three blogs to bottom row
    otherBlogs.forEach(blog => {
      const blogElement = this.createBottomBlogElement(blog);
      bottomGrid.appendChild(blogElement);
    });

    bottomRowContainer.appendChild(bottomGrid);
    this.blogGrid.appendChild(bottomRowContainer);
  }

  createFeaturedTextElement(blog) {
    const div = document.createElement('div');
    div.className = 'group cursor-pointer featured-text-column';
    div.style.gridColumn = '1 / span 4'; // Takes 4 out of 10 grid columns (40%)

    const formattedDate = formatDate(blog.publishDate);

    div.innerHTML = `
      <article class="overflow-hidden transition-all duration-300 h-full font-roboto">
        <div class="p-6 lg:p-8">
          <div class="mb-4">
            <span class="text-sm text-gray-500 font-medium">${formattedDate}</span>
          </div>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
            ${blog.title}
          </h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            ${blog.excerpt}
          </p>
          <button class="inline-flex items-center bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors group">
            <span>LEARN MORE</span>
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </article>
    `;

    // Add click event
    div.addEventListener('click', () => {
      this.navigateToBlog(blog.id);
    });

    return div;
  }

  createFeaturedImageElement(blog) {
    const div = document.createElement('div');
    div.className = 'group cursor-pointer featured-image-column';
    div.style.gridColumn = '5 / span 6'; // Takes 6 out of 10 grid columns (60%)

    div.innerHTML = `
      <div class="relative h-80 lg:h-96 overflow-hidden rounded-xl transition-all duration-300">
        <img
          src="${blog.image}"
          alt="${blog.title}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>
    `;

    // Add click event
    div.addEventListener('click', () => {
      this.navigateToBlog(blog.id);
    });

    return div;
  }

  createBottomBlogElement(blog) {
    const article = document.createElement('article');
    article.className = 'group cursor-pointer';

    article.innerHTML = `
      <div class="relative h-52 overflow-hidden rounded-lg   shadow-md hover:shadow-lg transition-all duration-300 mb-4">
        <img
          src="${blog.image}"
          alt="${blog.title}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div class="text-center">
        <h4 class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          ${blog.title}
        </h4>
      </div>
    `;

    // Add click event
    article.addEventListener('click', () => {
      this.navigateToBlog(blog.id);
    });

    return article;
  }



  navigateToBlog(blogId) {
    // Navigate to single blog page with blog ID
    window.location.href = `single-blog.html?id=${blogId}`;
  }

  showLoadingState() {
    if (this.blogGrid) {
      this.blogGrid.innerHTML = `
        <div class="lg:col-span-10 flex items-center justify-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading latest stories...</p>
          </div>
        </div>
      `;
    }
  }

  showError() {
    if (this.blogGrid) {
      this.blogGrid.innerHTML = `
        <div class="lg:col-span-10 text-center py-12">
          <div class="text-red-600 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed to Load Blogs</h3>
          <p class="text-gray-600 mb-4">There was an error loading the blog content.</p>
          <button onclick="location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      `;
    }
  }

  showEmptyState() {
    if (this.blogGrid) {
      this.blogGrid.innerHTML = `
        <div class="lg:col-span-10 text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Blogs Available</h3>
          <p class="text-gray-600">Check back later for the latest news and stories.</p>
        </div>
      `;
    }
  }
}

// Initialize blog section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BlogSection();
});
