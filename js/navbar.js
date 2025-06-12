// Navbar Module - Fetch data from JSON file
let navbarData = null;

// Load navbar data from JSON file
async function loadNavbarData() {
    if (!navbarData) {
        try {
            const response = await fetch('./data/navbar-bikes.json');
            navbarData = await response.json();
        } catch (error) {
            console.error('Error loading navbar data:', error);
            // Fallback empty structure
            navbarData = { brands: {}, fallbackImage: '' };
        }
    }
    return navbarData;
}

// Utility functions for navbar
function getAllBrands() {
    return Object.keys(navbarData.brands);
}

function getCategoriesForBrand(brand) {
    return navbarData.brands[brand]?.categories || [];
}

function getMotorcyclesByBrand(brand) {
    const brandData = navbarData.brands[brand];
    if (!brandData) return {};

    const result = {};
    brandData.categories.forEach(category => {
        const bikes = brandData.bikes[category];
        if (bikes && bikes.length > 0) {
            result[category] = bikes.map(bike => ({
                name: bike.name,
                image: bike.image,
                brand: brand
            }));
        }
    });
    return result;
}

export class NavbarManager {
    constructor() {
        this.currentCategory = 'All';
        this.currentBrand = 'PULSAR';
        this.isMobileMenuOpen = false;
        this.isMobileBrandDetailOpen = false;
    }

    // Initialize the navbar - simple sync, data loads when needed
    initialize() {
        this.setupEventListeners();
        this.setupMobileEventListeners();

        // Load data and populate UI
        this.loadAndPopulate();
    }

    // Load data and populate UI elements
    async loadAndPopulate() {
        await loadNavbarData();

        this.populateBrands();
        this.populateMobileBrands();
        this.populateMobileBikesBrands();
        this.renderMotorcycles();

        // Filter category buttons for default brand after everything is set up
        setTimeout(() => {
            this.updateCategoryButtons();
        }, 100);
    }

    // Populate brands in sidebar - Simplified and faster
    populateBrands() {
        const brandList = document.getElementById('brand-list');
        if (!brandList) return;

        brandList.innerHTML = '';
        const brands = getAllBrands();

        // Create brand list items
        brands.forEach(brand => {
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

    // Populate mobile brands - Simplified
    populateMobileBrands() {
        const mobileBrands = document.getElementById('mobile-brands');
        if (!mobileBrands) return;

        mobileBrands.innerHTML = '';
        const brands = getAllBrands();

        brands.forEach(brand => {
            const brandItem = document.createElement('div');
            brandItem.className = 'mobile-brand-item';
            brandItem.innerHTML = `
                <span class="text-lg font-medium text-gray-900">${brand}</span>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            `;

            brandItem.addEventListener('click', () => {
                this.showMobileBrandDetail(brand);
            });

            mobileBrands.appendChild(brandItem);
        });
    }

    // Populate mobile bikes brands (for header dropdown) - Simplified
    populateMobileBikesBrands() {
        const mobileBikesBrands = document.getElementById('mobile-bikes-brands');
        if (!mobileBikesBrands) return;

        mobileBikesBrands.innerHTML = '';
        const brands = getAllBrands();

        brands.forEach(brand => {
            const brandItem = document.createElement('div');
            brandItem.className = 'mobile-brand-item';
            brandItem.innerHTML = `
                <span class="text-lg font-medium text-gray-900">${brand}</span>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            `;

            brandItem.addEventListener('click', () => {
                this.showMobileBikesBrandDetail(brand);
            });

            mobileBikesBrands.appendChild(brandItem);
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

    // Filter motorcycles by brand - Simple and direct
    filterByBrand(brand) {
        this.currentBrand = brand;
        this.currentCategory = 'All'; // Reset category when changing brand

        // Update active brand
        document.querySelectorAll('.brand-filter').forEach(link => link.classList.remove('active'));
        const brandElement = document.querySelector(`[data-brand="${brand}"]`);
        if (brandElement) {
            brandElement.classList.add('active');
        }

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

    // Update category buttons based on selected brand - Simplified and faster
    updateCategoryButtons() {
        try {
            const categoryButtons = document.querySelectorAll('.category-btn');

            // Get categories for current brand (much faster lookup)
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
            const allButton = Array.from(categoryButtons).find(btn =>
                btn.textContent.trim() === 'All'
            );
            if (allButton) {
                allButton.classList.add('active');
            }
        } catch (error) {
            console.error('Error in updateCategoryButtons:', error);
            // Fallback: show all buttons if there's an error
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.style.display = 'block';
            });
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

    // Set current brand - Simple
    setCurrentBrand(brand) {
        this.currentBrand = brand;
        this.updateCategoryButtons();
        this.renderMotorcycles();
    }

    // Setup mobile event listeners
    setupMobileEventListeners() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mobileDetailClose = document.getElementById('mobile-detail-close');
        const mobileBackBtn = document.getElementById('mobile-back-btn');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMotorcyclesBtn = document.getElementById('mobile-motorcycles-btn');
        const mobileMediaBtn = document.getElementById('mobile-media-btn');
        const mobileMotorcyclesBack = document.getElementById('mobile-motorcycles-back');
        const mobileMediaBack = document.getElementById('mobile-media-back');
        const mobileBikesBtn = document.getElementById('mobile-bikes-btn');
        const mobileBikesClose = document.getElementById('mobile-bikes-close');
        const mobileBikesDetailClose = document.getElementById('mobile-bikes-detail-close');
        const mobileBikesBackBtn = document.getElementById('mobile-bikes-back-btn');

        // Mobile menu toggle
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Mobile bikes dropdown toggle
        if (mobileBikesBtn) {
            mobileBikesBtn.addEventListener('click', () => {
                this.toggleMobileBikesDropdown();
            });
        }

        // Close mobile menu
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close mobile detail
        if (mobileDetailClose) {
            mobileDetailClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Back to brand list
        if (mobileBackBtn) {
            mobileBackBtn.addEventListener('click', () => {
                this.hideMobileBrandDetail();
            });
        }

        // Motorcycles submenu toggle
        if (mobileMotorcyclesBtn) {
            mobileMotorcyclesBtn.addEventListener('click', () => {
                this.toggleMobileMotorcyclesMenu();
            });
        }

        // Media center submenu toggle
        if (mobileMediaBtn) {
            mobileMediaBtn.addEventListener('click', () => {
                this.toggleMobileMediaMenu();
            });
        }

        // Back buttons
        if (mobileMotorcyclesBack) {
            mobileMotorcyclesBack.addEventListener('click', () => {
                this.hideMobileMotorcyclesMenu();
            });
        }

        if (mobileMediaBack) {
            mobileMediaBack.addEventListener('click', () => {
                this.hideMobileMediaMenu();
            });
        }

        // Mobile bikes close buttons
        if (mobileBikesClose) {
            mobileBikesClose.addEventListener('click', () => {
                this.hideMobileBikesDropdown();
            });
        }

        if (mobileBikesDetailClose) {
            mobileBikesDetailClose.addEventListener('click', () => {
                this.hideMobileBikesDropdown();
            });
        }

        if (mobileBikesBackBtn) {
            mobileBikesBackBtn.addEventListener('click', () => {
                this.hideMobileBikesBrandDetail();
            });
        }

        // Close on overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', (e) => {
                if (e.target === mobileOverlay) {
                    this.closeMobileMenu();
                }
            });
        }


    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const overlay = document.getElementById('mobile-menu-overlay');
        if (overlay) {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            if (this.isMobileMenuOpen) {
                overlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            } else {
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        }
    }

    // Close mobile menu
    closeMobileMenu() {
        const overlay = document.getElementById('mobile-menu-overlay');
        if (overlay) {
            this.isMobileMenuOpen = false;
            this.isMobileBrandDetailOpen = false;
            overlay.classList.remove('show');
            document.body.style.overflow = '';
            this.hideMobileBrandDetail();
            this.hideMobileMotorcyclesMenu();
            this.hideMobileMediaMenu();
        }
    }

    // Toggle motorcycles submenu
    toggleMobileMotorcyclesMenu() {
        const mainMenu = document.getElementById('mobile-main-menu');
        const motorcyclesMenu = document.getElementById('mobile-motorcycles-menu');

        if (mainMenu && motorcyclesMenu) {
            if (motorcyclesMenu.classList.contains('hidden')) {
                // Show motorcycles menu
                mainMenu.classList.add('hidden');
                motorcyclesMenu.classList.remove('hidden');
            } else {
                // Hide motorcycles menu
                motorcyclesMenu.classList.add('hidden');
                mainMenu.classList.remove('hidden');
            }
        }
    }

    // Hide mobile motorcycles menu
    hideMobileMotorcyclesMenu() {
        const mainMenu = document.getElementById('mobile-main-menu');
        const motorcyclesMenu = document.getElementById('mobile-motorcycles-menu');

        if (mainMenu && motorcyclesMenu) {
            motorcyclesMenu.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        }
    }

    // Toggle media center submenu
    toggleMobileMediaMenu() {
        const mainMenu = document.getElementById('mobile-main-menu');
        const mediaMenu = document.getElementById('mobile-media-menu');

        if (mainMenu && mediaMenu) {
            if (mediaMenu.classList.contains('hidden')) {
                // Show media menu
                mainMenu.classList.add('hidden');
                mediaMenu.classList.remove('hidden');
            } else {
                // Hide media menu
                mediaMenu.classList.add('hidden');
                mainMenu.classList.remove('hidden');
            }
        }
    }

    // Hide mobile media menu
    hideMobileMediaMenu() {
        const mainMenu = document.getElementById('mobile-main-menu');
        const mediaMenu = document.getElementById('mobile-media-menu');

        if (mainMenu && mediaMenu) {
            mediaMenu.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        }
    }

    // Show mobile brand detail
    showMobileBrandDetail(brand) {
        this.currentBrand = brand;
        this.isMobileBrandDetailOpen = true;

        const motorcyclesMenu = document.getElementById('mobile-motorcycles-menu');
        const brandDetail = document.getElementById('mobile-brand-detail');
        const brandTitle = document.getElementById('mobile-brand-title');

        if (motorcyclesMenu) motorcyclesMenu.classList.add('hidden');
        if (brandDetail) brandDetail.classList.remove('hidden');
        if (brandTitle) brandTitle.textContent = `BIKES/${brand}`;

        this.populateMobileCategoryTabs();
        this.renderMobileMotorcycles();
    }

    // Hide mobile brand detail
    hideMobileBrandDetail() {
        this.isMobileBrandDetailOpen = false;

        const motorcyclesMenu = document.getElementById('mobile-motorcycles-menu');
        const brandDetail = document.getElementById('mobile-brand-detail');

        if (motorcyclesMenu) motorcyclesMenu.classList.remove('hidden');
        if (brandDetail) brandDetail.classList.add('hidden');
    }

    // Populate mobile category tabs
    populateMobileCategoryTabs() {
        const categoryTabs = document.getElementById('mobile-category-tabs');
        if (!categoryTabs) return;

        categoryTabs.innerHTML = '';

        const brandCategories = getCategoriesForBrand(this.currentBrand);
        const allCategories = ['All', ...brandCategories];

        allCategories.forEach(category => {
            const tab = document.createElement('button');
            tab.className = `mobile-category-tab ${category === this.currentCategory ? 'active' : ''}`;
            tab.textContent = category;
            tab.addEventListener('click', (e) => {
                this.filterMobileCategory(category, e.target);
            });
            categoryTabs.appendChild(tab);
        });
    }

    // Filter mobile category
    filterMobileCategory(category, targetElement) {
        this.currentCategory = category;

        // Update active tab
        document.querySelectorAll('.mobile-category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        if (targetElement) {
            targetElement.classList.add('active');
        }

        this.renderMobileMotorcycles();
    }

    // Render mobile motorcycles
    renderMobileMotorcycles() {
        const mobileList = document.getElementById('mobile-motorcycle-list');
        if (!mobileList) return;

        mobileList.innerHTML = '';

        const motorcyclesToShow = getMotorcyclesByBrand(this.currentBrand);

        if (this.currentCategory === 'All') {
            // Show all categories
            Object.keys(motorcyclesToShow).forEach(category => {
                if (motorcyclesToShow[category].length > 0) {
                    this.renderMobileCategorySection(category, motorcyclesToShow[category]);
                }
            });
        } else {
            // Show specific category
            if (motorcyclesToShow[this.currentCategory] && motorcyclesToShow[this.currentCategory].length > 0) {
                this.renderMobileCategorySection(this.currentCategory, motorcyclesToShow[this.currentCategory]);
            }
        }
    }

    // Render mobile category section
    renderMobileCategorySection(categoryName, motorcycles) {
        const mobileList = document.getElementById('mobile-motorcycle-list');
        if (!mobileList) return;

        // Category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'mb-4';
        categoryHeader.innerHTML = `
            <h4 class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">${categoryName}</h4>
        `;
        mobileList.appendChild(categoryHeader);

        // Motorcycles
        motorcycles.forEach(motorcycle => {
            const item = document.createElement('div');
            item.className = 'mobile-motorcycle-item';
            item.innerHTML = `
                <img src="${motorcycle.image}" alt="${motorcycle.name}" />
                <span class="text-base font-medium text-gray-900">${motorcycle.name}</span>
            `;
            mobileList.appendChild(item);
        });
    }

    // Toggle mobile bikes dropdown
    toggleMobileBikesDropdown() {
        const dropdown = document.getElementById('mobile-bikes-dropdown');
        const arrow = document.getElementById('mobile-bikes-arrow');

        if (dropdown && arrow) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                arrow.classList.remove('rotate');
                document.body.style.overflow = '';
            } else {
                dropdown.classList.add('show');
                arrow.classList.add('rotate');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    // Hide mobile bikes dropdown
    hideMobileBikesDropdown() {
        const dropdown = document.getElementById('mobile-bikes-dropdown');
        const arrow = document.getElementById('mobile-bikes-arrow');

        if (dropdown && arrow) {
            dropdown.classList.remove('show');
            arrow.classList.remove('rotate');
            document.body.style.overflow = '';
        }

        // Also hide brand detail if open
        this.hideMobileBikesBrandDetail();
    }

    // Show mobile bikes brand detail
    showMobileBikesBrandDetail(brand) {
        this.currentBrand = brand;

        const bikesMain = document.getElementById('mobile-bikes-main');
        const brandDetail = document.getElementById('mobile-bikes-brand-detail');
        const brandTitle = document.getElementById('mobile-bikes-brand-title');

        if (bikesMain) bikesMain.classList.add('hidden');
        if (brandDetail) brandDetail.classList.remove('hidden');
        if (brandTitle) brandTitle.textContent = `BIKES/${brand}`;

        this.populateMobileBikesCategoryTabs();
        this.renderMobileBikesMotorcycles();
    }

    // Hide mobile bikes brand detail
    hideMobileBikesBrandDetail() {
        const bikesMain = document.getElementById('mobile-bikes-main');
        const brandDetail = document.getElementById('mobile-bikes-brand-detail');

        if (bikesMain) bikesMain.classList.remove('hidden');
        if (brandDetail) brandDetail.classList.add('hidden');
    }

    // Populate mobile bikes category tabs
    populateMobileBikesCategoryTabs() {
        const categoryTabs = document.getElementById('mobile-bikes-category-tabs');
        if (!categoryTabs) return;

        categoryTabs.innerHTML = '';

        const brandCategories = getCategoriesForBrand(this.currentBrand);
        const allCategories = ['All', ...brandCategories];

        allCategories.forEach(category => {
            const tab = document.createElement('button');
            tab.className = `mobile-category-tab ${category === this.currentCategory ? 'active' : ''}`;
            tab.textContent = category;
            tab.addEventListener('click', (e) => {
                this.filterMobileBikesCategory(category, e.target);
            });
            categoryTabs.appendChild(tab);
        });
    }

    // Filter mobile bikes category
    filterMobileBikesCategory(category, targetElement) {
        this.currentCategory = category;

        // Update active tab
        document.querySelectorAll('#mobile-bikes-category-tabs .mobile-category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        if (targetElement) {
            targetElement.classList.add('active');
        }

        this.renderMobileBikesMotorcycles();
    }

    // Render mobile bikes motorcycles
    renderMobileBikesMotorcycles() {
        const mobileList = document.getElementById('mobile-bikes-motorcycle-list');
        if (!mobileList) return;

        mobileList.innerHTML = '';

        const motorcyclesToShow = getMotorcyclesByBrand(this.currentBrand);

        if (this.currentCategory === 'All') {
            // Show all categories
            Object.keys(motorcyclesToShow).forEach(category => {
                if (motorcyclesToShow[category].length > 0) {
                    this.renderMobileBikesCategorySection(category, motorcyclesToShow[category]);
                }
            });
        } else {
            // Show specific category
            if (motorcyclesToShow[this.currentCategory] && motorcyclesToShow[this.currentCategory].length > 0) {
                this.renderMobileBikesCategorySection(this.currentCategory, motorcyclesToShow[this.currentCategory]);
            }
        }
    }

    // Render mobile bikes category section
    renderMobileBikesCategorySection(categoryName, motorcycles) {
        const mobileList = document.getElementById('mobile-bikes-motorcycle-list');
        if (!mobileList) return;

        // Category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'mb-4';
        categoryHeader.innerHTML = `
            <h4 class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">${categoryName}</h4>
        `;
        mobileList.appendChild(categoryHeader);

        // Motorcycles
        motorcycles.forEach(motorcycle => {
            const item = document.createElement('div');
            item.className = 'mobile-motorcycle-item';
            item.innerHTML = `
                <img src="${motorcycle.image}" alt="${motorcycle.name}" />
                <span class="text-base font-medium text-gray-900">${motorcycle.name}</span>
            `;
            mobileList.appendChild(item);
        });
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
