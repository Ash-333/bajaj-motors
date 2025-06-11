// Navbar Module
import {
    motorcycleData,
    addNewMotorcycle,
    getMotorcyclesByBrand,
    getCategoriesForBrand
} from './motorcycle-data.js';

export class NavbarManager {
    constructor() {
        this.currentCategory = 'All';
        this.currentBrand = 'PULSAR';
    }

    // Initialize the navbar
    initialize() {
        this.populateBrands();
        this.renderMotorcycles();
        this.setupEventListeners();

        // Filter category buttons for default brand after everything is set up
        setTimeout(() => {
            this.updateCategoryButtons();
        }, 100);
    }

    // Populate brands in sidebar
    populateBrands() {
        const brandList = document.getElementById('brand-list');
        if (!brandList) return;

        brandList.innerHTML = '';

        // Add individual brands (no "All Brands" option)
        motorcycleData.brands.forEach(brand => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" class="brand-item brand-filter block px-3 py-2 text-sm text-gray-700 rounded-md transition-colors duration-200 ${this.currentBrand === brand ? 'active' : ''}" data-brand="${brand}">
                    ${brand}
                </a>
            `;
            brandList.appendChild(li);
        });

        // Add click event listeners to brand filters
        document.querySelectorAll('.brand-filter').forEach(brandLink => {
            brandLink.addEventListener('click', (e) => {
                e.preventDefault();
                const brand = e.target.getAttribute('data-brand');
                this.filterByBrand(brand);
            });
        });
    }

    // Toggle dropdown
    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId + '-dropdown');
        const arrow = document.getElementById(dropdownId + '-arrow');

        if (!dropdown || !arrow) return;

        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            dropdown.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
        } else {
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-content, .media-dropdown-content').forEach(dd => {
                dd.classList.remove('show');
                dd.classList.add('hidden');
            });
            document.querySelectorAll('.dropdown svg').forEach(arr => arr.style.transform = 'rotate(0deg)');

            dropdown.classList.remove('hidden');
            dropdown.classList.add('show');
            arrow.style.transform = 'rotate(180deg)';
        }
    }

    // Filter motorcycles by brand
    filterByBrand(brand) {
        this.currentBrand = brand;
        this.currentCategory = 'All'; // Reset category when changing brand

        // Update active brand
        document.querySelectorAll('.brand-filter').forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-brand="${brand}"]`).classList.add('active');

        // Update category buttons based on brand
        this.updateCategoryButtons();
        this.renderMotorcycles();
    }

    // Filter motorcycles by category
    filterCategory(category, buttonElement) {
        this.currentCategory = category;

        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        if (buttonElement) {
            buttonElement.classList.add('active');
        }

        this.renderMotorcycles();
    }

    // Update category buttons based on selected brand
    updateCategoryButtons() {
        try {
            const categoryButtons = document.querySelectorAll('.category-btn');

            // Show only relevant categories for the selected brand
            const brandCategories = getCategoriesForBrand(this.currentBrand);

            categoryButtons.forEach(btn => {
                const category = btn.textContent.trim();
                // Always show "All" button, and show categories that exist for this brand
                if (category === 'All' || brandCategories.includes(category)) {
                    btn.style.display = 'block';
                } else {
                    btn.style.display = 'none';
                }
            });

            // Set "All" as the default active category when switching brands
            this.currentCategory = 'All';
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));

            // Find and activate the "All" button
            const allButton = Array.from(document.querySelectorAll('.category-btn')).find(btn =>
                btn.textContent.trim() === 'All'
            );
            if (allButton) {
                allButton.classList.add('active');
            }
        } catch (error) {
            console.error('Error in updateCategoryButtons:', error);
        }
    }

    // Render motorcycles based on current category and brand
    renderMotorcycles() {
        const grid = document.getElementById('motorcycle-grid');
        if (!grid) return;

        grid.innerHTML = '';

        // Filter by brand first (always a specific brand, no "All")
        const motorcyclesToShow = getMotorcyclesByBrand(this.currentBrand);

        // Then filter by category
        if (this.currentCategory === 'All') {
            // Show all categories for the selected brand
            Object.keys(motorcyclesToShow).forEach(category => {
                if (motorcyclesToShow[category].length > 0) {
                    this.renderCategorySection(category, motorcyclesToShow[category]);
                }
            });
        } else {
            // Show specific category for the selected brand
            if (motorcyclesToShow[this.currentCategory] && motorcyclesToShow[this.currentCategory].length > 0) {
                this.renderCategorySection(this.currentCategory, motorcyclesToShow[this.currentCategory]);
            }
        }
    }

    // Render a category section
    renderCategorySection(categoryName, motorcycles) {
        const grid = document.getElementById('motorcycle-grid');
        if (!grid) return;
        
        const section = document.createElement('div');
        section.innerHTML = `
            <div class="mb-6">
                <div class="flex items-center space-x-2 mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">${categoryName}</h3>
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
                <div class="grid grid-cols-4 gap-6">
                    ${motorcycles.map(bike => `
                        <div class="motorcycle-card bg-white p-4 text-center cursor-pointer hover:bg-gray-50">
                            <img src="${bike.image}" alt="${bike.name}" class="w-full h-20 object-cover mb-3">
                            <h4 class="text-sm font-medium text-gray-800">${bike.name}</h4>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        grid.appendChild(section);
    }



    // Setup event listeners
    setupEventListeners() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(event.target)) {
                    const dropdownContent = dropdown.querySelector('.dropdown-content, .media-dropdown-content');
                    const arrow = dropdown.querySelector('svg');
                    if (dropdownContent) {
                        dropdownContent.classList.remove('show');
                        dropdownContent.classList.add('hidden');
                        if (arrow) arrow.style.transform = 'rotate(0deg)';
                    }
                }
            });
        });

        // Setup category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.textContent.trim();
                this.filterCategory(category, e.target);
            });
        });
    }

    // Add new motorcycle (public method)
    addMotorcycle(category, motorcycle) {
        addNewMotorcycle(category, motorcycle);
        
        // Re-render if we're currently showing this category
        if (this.currentCategory === 'All' || this.currentCategory === category) {
            this.renderMotorcycles();
        }
    }

    // Get current category
    getCurrentCategory() {
        return this.currentCategory;
    }

    // Set current category
    setCurrentCategory(category) {
        this.currentCategory = category;
        this.renderMotorcycles();
    }

    // Get current brand
    getCurrentBrand() {
        return this.currentBrand;
    }

    // Set current brand
    setCurrentBrand(brand) {
        this.currentBrand = brand;
        this.updateCategoryButtons();
        this.renderMotorcycles();
    }
}

// Global function for dropdown toggle (to maintain compatibility with HTML onclick)
window.toggleDropdown = function(dropdownId) {
    if (window.navbarManager) {
        window.navbarManager.toggleDropdown(dropdownId);
    }
};

// Global function for category filter (to maintain compatibility with HTML onclick)
window.filterCategory = function(category, event) {
    if (window.navbarManager) {
        const button = event ? event.target : null;
        window.navbarManager.filterCategory(category, button);
    }
};
