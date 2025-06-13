// Single Blog Page - Simple and direct approach like bike section
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
function getBlogById(blogId) {
  return blogData.blogs.find(blog => blog.id === blogId && blog.status === 'published');
}

function getRelatedBlogs(currentBlogId, limit = 3) {
  return blogData.blogs
    .filter(blog => blog.id !== currentBlogId && blog.status === 'published')
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, limit);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

class SingleBlogPage {
  constructor() {
    this.blogContainer = document.getElementById('blog-container');
    this.breadcrumb = document.getElementById('breadcrumb');
    this.relatedBlogs = document.getElementById('related-blogs');
    this.currentBlogId = this.getBlogIdFromUrl();
    this.init();
  }

  getBlogIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  async init() {
    try {
      if (!this.currentBlogId) {
        this.showError('No blog specified');
        return;
      }

      // Load data first
      await loadBlogData();
      
      // Get the blog
      const blog = getBlogById(this.currentBlogId);
      
      if (!blog) {
        this.showError('Blog not found');
        return;
      }

      // Render the blog
      this.renderBlog(blog);
      
      // Render related blogs
      this.renderRelatedBlogs();
      
    } catch (error) {
      console.error('Failed to initialize single blog page:', error);
      this.showError('Failed to load blog');
    }
  }

  renderBlog(blog) {
    // Update page title
    document.title = `${blog.title} - Bajaj Motors`;
    
    // Update breadcrumb
    if (this.breadcrumb) {
      this.breadcrumb.innerHTML = `
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <a href="index.html" class="hover:text-blue-600">Home</a>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <a href="blogs.html" class="hover:text-blue-600">Blogs</a>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-gray-400">${blog.title}</span>
        </div>
      `;
    }

    // Render blog content
    if (this.blogContainer) {
      const formattedDate = formatDate(blog.publishDate);
      
      this.blogContainer.innerHTML = `
        <article class="max-w-4xl mx-auto">
          <!-- Blog Header -->
          <header class="mb-8">
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              ${blog.title}
            </h1>
            
            ${blog.subtitle ? `
              <p class="text-xl text-gray-600 mb-6">${blog.subtitle}</p>
            ` : ''}
            
            <div class="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>By ${blog.author}</span>
              <span>•</span>
              <time datetime="${blog.publishDate}">${formattedDate}</time>
            </div>
          </header>

          <!-- Featured Image -->
          <div class="mb-8">
            <img
              src="${blog.image}"
              alt="${blog.title}"
              class="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>

          <!-- Blog Content -->
          <div class="prose prose-lg max-w-none">
            <div class="blog-content">
              ${blog.content}
            </div>
          </div>

            </div>
          </footer>
        </article>
      `;
    }
  }

  renderRelatedBlogs() {
    if (!this.relatedBlogs) return;
    
    const relatedBlogs = getRelatedBlogs(this.currentBlogId, 3);
    
    if (relatedBlogs.length === 0) {
      this.relatedBlogs.style.display = 'none';
      return;
    }

    this.relatedBlogs.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${relatedBlogs.map(blog => `
            <article class="group cursor-pointer" onclick="window.location.href='single-blog.html?id=${blog.id}'">
              <div class="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-4">
                <img
                  src="${blog.image}"
                  alt="${blog.title}"
                  class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="space-y-2">
                <p class="text-xs text-gray-600">${formatDate(blog.publishDate)}</p>
                <h3 class="font-semibold text-lg leading-snug group-hover:text-blue-600 transition-colors">
                  ${blog.title}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2">${blog.excerpt}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  showError(message) {
    if (this.blogContainer) {
      this.blogContainer.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-600 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${message}</h3>
          <p class="text-gray-600 mb-4">The blog you're looking for could not be found.</p>
          <a href="blogs.html" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View All Blogs
          </a>
        </div>
      `;
    }
  }
}

// Initialize single blog page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SingleBlogPage();
});
