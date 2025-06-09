# Bajaj Motor Website

A dynamic website for Bajaj motorcycles featuring an interactive navigation system and carousel.

## 📁 Project Structure

```
/
├── index.html                 # Main website page
├── test-functionality.html    # Testing page for functionality
├── README.md                  # This file
├── css/                       # Stylesheets
│   └── styles.css            # Main CSS file
├── js/                        # JavaScript modules
│   ├── main.js               # Main application entry point
│   ├── carousel.js           # Carousel functionality
│   ├── navbar.js             # Navigation functionality
│   ├── motorcycle-data.js    # Data for motorcycles and media
│   └── script.js             # Legacy script (standalone)
├── assets/                    # Static assets
│   └── logo.png              # Logo and other images
└── data/                      # Data files
    └── (future JSON/XML files)
```

## 🚀 Features

- **Dynamic Navigation**: Interactive dropdown menus with brand filtering
- **Carousel System**: Auto-playing image carousel with manual controls
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **Modular Architecture**: ES6 modules for clean code organization

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom styles with animations
- **JavaScript ES6**: Modern JavaScript with modules
- **Tailwind CSS**: Utility-first CSS framework

## 📋 File Organization

### CSS Files (`/css/`)
- `styles.css`: Contains all custom styles, animations, and component-specific CSS

### JavaScript Files (`/js/`)
- `main.js`: Application entry point, initializes all modules
- `carousel.js`: Handles carousel functionality and slide management
- `navbar.js`: Manages navigation dropdowns and filtering
- `motorcycle-data.js`: Contains all motorcycle and media center data
- `script.js`: Legacy standalone script (for backward compatibility)

### Assets (`/assets/`)
- Place all images, fonts, and other static assets here
- Currently contains: logo.png

### Data (`/data/`)
- Reserved for future JSON, XML, or other data files
- Currently empty but ready for expansion

## 🔧 Development

To work with this project:

1. Open `index.html` in a web browser
2. Use `test-functionality.html` to test individual components
3. All JavaScript uses ES6 modules - serve from a local server for development
4. CSS is organized with clear sections for different components

## 📝 Notes

- All external images currently use Unsplash URLs
- The project uses ES6 modules, so it needs to be served from a web server (not file://)
- Tailwind CSS is loaded from CDN
- All file paths are relative and properly organized
