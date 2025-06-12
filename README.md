# Bajaj Motors Website

A modern, responsive website for Bajaj Motors featuring dynamic navigation, interactive carousels, auto-scroll functionality, and a clean design built with HTML5, CSS3, and JavaScript ES6 modules.

## 📁 Project Structure

```
/
├── index.html                 # Main website page
├── README.md                  # This file
├── css/                       # Stylesheets
│   └── styles.css            # Organized CSS with sections & components
├── js/                        # JavaScript modules
│   ├── main.js               # Main application entry point
│   ├── carousel.js           # Hero carousel functionality
│   ├── navbar.js             # Navigation functionality
│   ├── motorcycle-data.js    # Motorcycle and media center data
│   ├── bike-carousel.js      # Enhanced bike carousel component
│   ├── bike-api.js           # Bike data utilities and API
│   ├── bike-init.js          # Bike section initialization
│   ├── brand-manager.js      # Dynamic brand switching
│   ├── auto-scroll-manager.js # Auto-scroll functionality
│   ├── blog-api.js           # Blog data services
│   ├── blog-section.js       # Blog section component
│   └── expereience-carousel.js # Experience section carousel
├── assets/                    # Static assets
│   ├── logo.png              # Main Bajaj logo
│   ├── golcha-logo.png       # Golchha Group logo
│   ├── dream-section-img.png # Dream Bajaj section image
│   └── down-btn.png          # Down arrow button
└── data/                      # Data files
    ├── bikes-api.json        # Bike models and configuration
    ├── blogs-api.json        # Blog posts data
    └── experienceData.json   # Experience carousel data
```

## 🚀 Features

- **Responsive Header**: Fully responsive top bar and navigation
- **Dynamic Navigation**: Interactive dropdown menus with brand filtering
- **Hero Carousel**: Auto-playing image carousel with manual controls
- **Bike Showcase**: Interactive bike carousel with auto-scroll
- **Experience Section**: Dynamic experience carousel
- **Blog Section**: Blog posts with API integration
- **Mobile-First Design**: Optimized for all device sizes
- **Modular Architecture**: ES6 modules for clean code organization
- **Auto-Scroll Management**: Smart auto-scroll with user interaction detection

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Organized custom styles with animations and responsive design
- **JavaScript ES6**: Modern JavaScript with modules and async/await
- **Tailwind CSS**: Utility-first CSS framework (CDN)
- **Google Fonts**: Inter and Roboto font families

## 📋 File Organization

### CSS Files (`/css/`)
- `styles.css`: Organized CSS with clear sections:
  - Base & Utilities
  - Header & Navigation
  - Hero Section & Carousel
  - Bikes Section
  - Dream Bajaj Section
  - Mobile Navigation & Menus
  - Experience Section
  - Blog Section
  - Mobile Responsive Styles

### JavaScript Files (`/js/`)
- `main.js`: Application entry point, initializes navbar and carousel managers
- `carousel.js`: Hero section carousel functionality and slide management
- `navbar.js`: Navigation dropdowns, mobile menus, and brand filtering
- `motorcycle-data.js`: Static motorcycle and media center data
- `bike-carousel.js`: Enhanced bike showcase with dynamic data loading
- `bike-api.js`: Bike data utilities and API service layer
- `bike-init.js`: Bike section initialization and setup
- `brand-manager.js`: Dynamic brand switching and management
- `auto-scroll-manager.js`: Intelligent auto-scroll with pause/resume logic
- `blog-api.js`: Blog data services and API integration
- `blog-section.js`: Blog section component and rendering
- `expereience-carousel.js`: Experience section carousel with auto-scroll

### Assets (`/assets/`)
- `logo.png`: Main Bajaj Motors logo
- `golcha-logo.png`: Golchha Group branding logo
- `dream-section-img.png`: Dream Bajaj section background image
- `down-btn.png`: Navigation down arrow button

### Data (`/data/`)
- `bikes-api.json`: Comprehensive bike models, configurations, and auto-scroll settings
- `blogs-api.json`: Blog posts data and metadata
- `experienceData.json`: Experience carousel content and images

## 🏗️ Architecture

### Component Dependencies
- **Header**: `navbar.js` → `motorcycle-data.js`
- **Hero Carousel**: `carousel.js` (standalone)
- **Bike Showcase**: `bike-carousel.js` → `bike-api.js` → `brand-manager.js` → `auto-scroll-manager.js`
- **Experience Section**: `expereience-carousel.js` → `experienceData.json`
- **Blog Section**: `blog-section.js` → `blog-api.js` → `blogs-api.json`

### Navbar Files (Core Navigation)
Only 3 files run the navbar:
- `js/navbar.js` - Main navbar functionality
- `js/main.js` - Navbar initialization
- `js/motorcycle-data.js` - Navbar data provider

### Auto-Scroll System
The `auto-scroll-manager.js` provides:
- Automatic bike model cycling (6-second intervals)
- Smart pause on user interaction
- Resume after interaction delay
- Accessibility support (respects reduced motion)
- Performance optimization (pauses when tab hidden)

## 🔧 Development

To work with this project:

1. **Local Server Required**: Use a local server (not file://) due to ES6 modules
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

2. **File Structure**: All paths are relative and properly organized
3. **CSS Organization**: Styles are organized by sections and components
4. **Responsive Design**: Mobile-first approach with comprehensive breakpoints

## 📱 Responsive Features

- **Top Bar**: Fully responsive with progressive content hiding
- **Navigation**: Desktop dropdowns + mobile full-screen menus
- **Carousels**: Touch-friendly with optimized mobile controls
- **Breakpoints**:
  - Desktop: 1024px+
  - Tablet: 769px - 1024px
  - Mobile: 481px - 768px
  - Small Mobile: 361px - 480px
  - Extra Small: ≤360px

## 📝 Notes

- **External Images**: Uses Unsplash URLs for motorcycle images
- **ES6 Modules**: Requires web server for proper module loading
- **CDN Dependencies**: Tailwind CSS and Google Fonts loaded from CDN
- **Data-Driven**: Content populated from JSON files
- **Performance**: Optimized with image preloading and lazy loading
- **Accessibility**: Supports reduced motion preferences and keyboard navigation
