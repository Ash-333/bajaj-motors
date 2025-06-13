// Blogs Page - Simple and direct approach like bike section
let blogData = null;

// Load blog data from JSON file - simple and direct
async function loadBlogData() {
  if (!blogData) {
    try {
      const response = await fetch('./data/blogs-api.json');
      blogData = await response.json();
    } catch (error) {
      console.error('Error loading blog data:', error);
      blogData = { blogs: [] };
    }
  }
  return blogData;
}

// Simple utility functions
function getAllBlogs() {
  return blogData.blogs.filter(blog => blog.status === 'published');
}



function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

class BlogsPage {
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
      console.error('Failed to initialize blogs page:', error);
      this.showError();
    }
  }

  loadBlogs() {
    try {
      // Show loading state
      this.showLoadingState();

      // Get all published blogs
      const blogs = getAllBlogs();

      if (blogs.length === 0) {
        this.showEmptyState();
        return;
      }

      // Clear existing content
      this.blogGrid.innerHTML = '';

      // Create blog cards
      blogs.forEach(blog => {
        const blogCard = this.createBlogCard(blog);
        this.blogGrid.appendChild(blogCard);
      });

    } catch (error) {
      console.error('Failed to load blogs:', error);
      this.showError();
    }
  }

  createBlogCard(blog) {
    const div = document.createElement('div');
    div.className = 'group cursor-pointer';

    const formattedDate = formatDate(blog.publishDate);

    div.innerHTML = `
      <div class="space-y-3">
        <p class="text-xs text-gray-600 font-medium">${formattedDate}</p>
        <div class="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <img
            src="${blog.image}"
            alt="${blog.title}"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div class="space-y-2">
          <h3 class="font-semibold text-lg leading-snug group-hover:text-blue-600 transition-colors">
            ${blog.title}
          </h3>
          <p class="text-sm text-gray-600 line-clamp-2">
            ${blog.excerpt}
          </p>
          <a
            href="single-blog.html?id=${blog.id}"
            class="text-blue-600 text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            learn more →
          </a>
        </div>
      </div>
    `;

    // Add click event for the entire card
    div.addEventListener('click', (e) => {
      // Don't navigate if clicking on the link directly
      if (e.target.tagName !== 'A') {
        window.location.href = `single-blog.html?id=${blog.id}`;
      }
    });

    return div;
  }

  showLoadingState() {
    if (this.blogGrid) {
      this.blogGrid.innerHTML = `
        <div class="col-span-full flex items-center justify-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading blogs...</p>
          </div>
        </div>
      `;
    }
  }

  showError() {
    if (this.blogGrid) {
      this.blogGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
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
        <div class="col-span-full text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Blogs Found</h3>
          <p class="text-gray-600">No blogs are currently available.</p>
        </div>
      `;
    }
  }
}

// Initialize blogs page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BlogsPage();
});
