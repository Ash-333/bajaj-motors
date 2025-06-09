// Motorcycle Data Module
export const motorcycleData = {
    brands: ['PULSAR', 'DOMINAR', 'AVENGERS', 'DISCOVER', 'PLATINA'],
    motorcycles: {
        // PULSAR Categories
        Classic: [
            { name: 'PULSAR 220F ABS', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR 150 TD', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR 150', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR 125', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' }
        ],
        NS: [
            { name: 'PULSAR NS400Z', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR NS 200 ABS FI', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR NS 200 ABS', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR NS 200', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR NS 160 ABS', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'NS160 FI DUAL ABS BS6', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR NS 125 BS6', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR NS 125 FI BS6', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' }
        ],
        N: [
            { name: 'PULSAR N250', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' },
            { name: 'PULSAR N160', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop', brand: 'PULSAR' }
        ],
        // DOMINAR Categories
        Adventure: [
            { name: 'DOMINAR 400', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=150&h=100&fit=crop', brand: 'DOMINAR' },
            { name: 'DOMINAR 250', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=150&h=100&fit=crop', brand: 'DOMINAR' }
        ],
        // AVENGERS Categories
        Cruiser: [
            { name: 'AVENGER CRUISE 220', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=150&h=100&fit=crop', brand: 'AVENGERS' },
            { name: 'AVENGER STREET 220', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=150&h=100&fit=crop', brand: 'AVENGERS' },
            { name: 'AVENGER STREET 160', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=150&h=100&fit=crop', brand: 'AVENGERS' }
        ],
        // DISCOVER Categories
        Commuter: [
            { name: 'DISCOVER 125', image: 'https://images.unsplash.com/photo-1605531179818-de32686e5e2e?w=150&h=100&fit=crop', brand: 'DISCOVER' },
            { name: 'DISCOVER 110', image: 'https://images.unsplash.com/photo-1605531179818-de32686e5e2e?w=150&h=100&fit=crop', brand: 'DISCOVER' },
            { name: 'DISCOVER 100', image: 'https://images.unsplash.com/photo-1605531179818-de32686e5e2e?w=150&h=100&fit=crop', brand: 'DISCOVER' }
        ],
        // PLATINA Categories
        Economy: [
            { name: 'PLATINA 110 H-GEAR', image: 'https://images.unsplash.com/photo-1605531179818-de32686e5e2e?w=150&h=100&fit=crop', brand: 'PLATINA' },
            { name: 'PLATINA 100 ES', image: 'https://images.unsplash.com/photo-1605531179818-de32686e5e2e?w=150&h=100&fit=crop', brand: 'PLATINA' },
            { name: 'PLATINA 100', image: 'https://images.unsplash.com/photo-1605531179818-de32686e5e2e?w=150&h=100&fit=crop', brand: 'PLATINA' }
        ]
    }
};

// Media Center Data
export const mediaCenterData = {
    categories: ['Press Releases', 'News & Updates', 'Videos', 'Photo Gallery', 'Downloads'],
    content: {
        'Press Releases': [
            { title: 'Bajaj Auto Q3 Results 2024', date: '2024-01-15', type: 'PDF' },
            { title: 'New Product Launch Announcement', date: '2024-01-10', type: 'PDF' },
            { title: 'Partnership with Global Brands', date: '2024-01-05', type: 'PDF' }
        ],
        'News & Updates': [
            { title: 'Bajaj Wins Industry Award 2024', date: '2024-01-20', type: 'Article' },
            { title: 'Expansion into New Markets', date: '2024-01-18', type: 'Article' },
            { title: 'Sustainability Initiatives', date: '2024-01-12', type: 'Article' }
        ],
        'Videos': [
            { title: 'PULSAR Series Commercial', date: '2024-01-25', type: 'Video' },
            { title: 'Behind the Scenes - Manufacturing', date: '2024-01-22', type: 'Video' },
            { title: 'Customer Testimonials', date: '2024-01-15', type: 'Video' }
        ],
        'Photo Gallery': [
            { title: 'Auto Expo 2024 Gallery', date: '2024-01-30', type: 'Gallery' },
            { title: 'Product Photoshoot', date: '2024-01-28', type: 'Gallery' },
            { title: 'Events & Launches', date: '2024-01-20', type: 'Gallery' }
        ],
        'Downloads': [
            { title: 'Product Brochures', date: '2024-01-01', type: 'ZIP' },
            { title: 'Technical Specifications', date: '2024-01-01', type: 'PDF' },
            { title: 'Wallpapers & Images', date: '2024-01-01', type: 'ZIP' }
        ]
    }
};

// Function to add new motorcycle
export function addNewMotorcycle(category, motorcycle) {
    if (!motorcycleData.motorcycles[category]) {
        motorcycleData.motorcycles[category] = [];
    }
    motorcycleData.motorcycles[category].push(motorcycle);
}

// Function to get motorcycles by category
export function getMotorcyclesByCategory(category) {
    return motorcycleData.motorcycles[category] || [];
}

// Function to get all categories
export function getAllCategories() {
    return Object.keys(motorcycleData.motorcycles);
}

// Function to get all brands
export function getAllBrands() {
    return motorcycleData.brands;
}

// Function to get motorcycles by brand
export function getMotorcyclesByBrand(brand) {
    const result = {};
    Object.keys(motorcycleData.motorcycles).forEach(category => {
        const brandMotorcycles = motorcycleData.motorcycles[category].filter(bike => bike.brand === brand);
        if (brandMotorcycles.length > 0) {
            result[category] = brandMotorcycles;
        }
    });
    return result;
}

// Function to get categories for a specific brand
export function getCategoriesForBrand(brand) {
    const categories = [];
    Object.keys(motorcycleData.motorcycles).forEach(category => {
        const hasBrandMotorcycles = motorcycleData.motorcycles[category].some(bike => bike.brand === brand);
        if (hasBrandMotorcycles) {
            categories.push(category);
        }
    });
    return categories;
}

// Function to get media center content by category
export function getMediaContentByCategory(category) {
    return mediaCenterData.content[category] || [];
}

// Function to get all media categories
export function getAllMediaCategories() {
    return mediaCenterData.categories;
}
