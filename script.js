// ==================== GLOBAL VARIABLES ====================
let map = null;
let markers = [];
let activeNutritionFilters = new Set();
let activeEstablishmentFilters = new Set();

// Restaurant data - UPDATED WITH PROPER FIELDS
const allRestaurants = [
    {
        id: 1, 
        name: 'Green Leaf Cafe', 
        lat: 40.7128, 
        lng: -74.0060,
        categories: ['vegan', 'vegetarian', 'gluten-free'],
        establishment: 'cafe',
        description: 'Organic plant-based cuisine with gluten-free options',
        address: '123 Green Street, NYC', 
        rating: 4.8,
        price: '$$',
        distance: '0.8 miles',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2, 
        name: 'Protein Powerhouse', 
        lat: 40.7188, 
        lng: -74.0090,
        categories: ['high-protein', 'keto', 'low-carb'],
        establishment: 'restaurant',
        description: 'High-protein meals for athletes and fitness enthusiasts',
        address: '456 Protein Ave, NYC', 
        rating: 4.6,
        price: '$$$',
        distance: '1.2 miles',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3, 
        name: 'Gluten Free Haven', 
        lat: 40.7058, 
        lng: -74.0080,
        categories: ['gluten-free', 'nut-free', 'vegetarian'],
        establishment: 'cafe',
        description: '100% gluten-free bakery and cafe',
        address: '789 Gluten Free Blvd, NYC', 
        rating: 4.9,
        price: '$$',
        distance: '0.5 miles',
        image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 4, 
        name: 'Keto Kitchen', 
        lat: 40.7228, 
        lng: -74.0030,
        categories: ['keto', 'low-carb', 'high-protein'],
        establishment: 'restaurant',
        description: 'Delicious keto-friendly meals and snacks',
        address: '101 Keto Lane, NYC', 
        rating: 4.7,
        price: '$$',
        distance: '1.5 miles',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 5, 
        name: 'Vegan Delights', 
        lat: 40.7168, 
        lng: -74.0130,
        categories: ['vegan', 'nut-free', 'lactose-free'],
        establishment: 'restaurant',
        description: 'Creative vegan dishes using locally sourced ingredients',
        address: '202 Vegan Way, NYC', 
        rating: 4.8,
        price: '$$$',
        distance: '2.0 miles',
        image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 6, 
        name: 'Hotel Healthy Bites', 
        lat: 40.7088, 
        lng: -74.0020,
        categories: ['low-carb', 'high-protein', 'gluten-free'],
        establishment: 'hotel',
        description: 'Nutritionist-designed meals for health-conscious travelers',
        address: '303 Health St, NYC', 
        rating: 4.5,
        price: '$$$$',
        distance: '0.3 miles',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 7, 
        name: 'Brunch & Greens', 
        lat: 40.7108, 
        lng: -74.0110,
        categories: ['vegetarian', 'lactose-free', 'gluten-free'],
        establishment: 'brunch',
        description: 'Weekend brunch with healthy vegetarian options',
        address: '404 Brunch Ave, NYC', 
        rating: 4.3,
        price: '$$',
        distance: '1.0 miles',
        image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 8, 
        name: 'Canteen Fit', 
        lat: 40.7158, 
        lng: -74.0010,
        categories: ['high-protein', 'keto', 'low-carb'],
        establishment: 'canteen',
        description: 'Healthy meal options for students and professionals',
        address: '505 Campus Rd, NYC', 
        rating: 4.0,
        price: '$',
        distance: '0.6 miles',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
];

// Category colors for map markers
const categoryColors = {
    'vegan': '#4CAF50',
    'vegetarian': '#8BC34A',
    'gluten-free': '#FF9800',
    'keto': '#9C27B0',
    'high-protein': '#2196F3',
    'low-carb': '#FF5722',
    'dairy-free': '#00BCD4',
    'lactose-free': '#00BCD4',
    'nut-free': '#FF9800',
    'default': '#053717'
};

// Establishment icons
const establishmentIcons = {
    'restaurant': 'fa-utensils',
    'brunch': 'fa-coffee',
    'canteen': 'fa-school',
    'hotel': 'fa-hotel',
    'bar': 'fa-glass-cheers',
    'cafe': 'fa-mug-hot',
    'fast-food': 'fa-hamburger',
    'fine-dining': 'fa-star'
};

// Establishment labels
const establishmentLabels = {
    'restaurant': 'Restaurant',
    'brunch': 'Brunch',
    'canteen': 'Canteen',
    'hotel': 'Hotel',
    'bar': 'Bar',
    'cafe': 'Café',
    'fast-food': 'Fast Food',
    'fine-dining': 'Fine Dining'
};

// ==================== MAP FUNCTIONS ====================

function initMap() {
    const mapElement = document.getElementById('restaurant-map');
    if (!mapElement) return;

    // Clear existing map
    if (mapElement._leaflet_id && map) {
        map.remove();
    }

    // Set dimensions
    mapElement.style.width = '100%';
    mapElement.style.height = '450px';
    mapElement.style.minHeight = '450px';

    // Create map WITH default controls but positioned properly
    map = L.map('restaurant-map', {
        zoomControl: true, // Use default zoom control
        attributionControl: false, // Disable attribution
        scrollWheelZoom: false,
        doubleClickZoom: true,
        dragging: true,
        boxZoom: true,
        keyboard: false,
        maxZoom: 19,
        minZoom: 1
    }).setView([40.7128, -74.0060], 13);

    // Add tile layer WITHOUT attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '' // Empty attribution
    }).addTo(map);

    // Use JavaScript to reposition zoom control after map is created
    setTimeout(() => {
        const zoomControl = document.querySelector('.leaflet-control-zoom');
        if (zoomControl) {
            zoomControl.style.top = '80px'; // Position below navbar
            zoomControl.style.left = '15px';
            zoomControl.style.right = 'auto';
            zoomControl.style.bottom = 'auto';
        }
        
        // Remove any existing attribution
        const attribution = document.querySelector('.leaflet-control-attribution');
        if (attribution) {
            attribution.remove();
        }
    }, 100);

    // Initial markers
    updateMapMarkers();

    // Fix map size
    setTimeout(() => {
        if (map) map.invalidateSize(true);
    }, 200);
}

function updateMapMarkers() {
    if (!map) return;

    // Clear old markers
    markers.forEach(marker => {
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    markers = [];

    // Get filtered restaurants
    const filtered = filterRestaurants();

    // Add markers
    filtered.forEach(restaurant => {
        const color = categoryColors[restaurant.categories[0]] || categoryColors.default;
        
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color:${color}; width:20px; height:20px; border-radius:50%; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([restaurant.lat, restaurant.lng], {
            icon: markerIcon,
            title: restaurant.name
        }).addTo(map);

        const popupContent = `
            <div style="padding:10px; max-width:250px;">
                <h4 style="margin:0 0 5px; color:#053717;">${restaurant.name}</h4>
                <p style="margin:0 0 8px; color:#666; font-size:14px;">${restaurant.description}</p>
                <p style="margin:0 0 10px; color:#888; font-size:12px;">${restaurant.address}</p>
                <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">
                    ${restaurant.categories.map(cat => 
                        `<span style="background:#e0f2e9; color:#053717; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:600;">${cat.replace('-', ' ')}</span>`
                    ).join('')}
                </div>
                <div style="display:flex; align-items:center; gap:5px;">
                    <span style="color:#FF9800; font-size:14px;">★ ${restaurant.rating}</span>
                    <span style="font-size:12px; color:#888;">rating</span>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);
    });

    // Fit bounds if markers exist
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    } else {
        map.setView([40.7128, -74.0060], 13);
    }
}

// ==================== FILTERING FUNCTIONS ====================

function filterRestaurants() {
    let filtered = allRestaurants;

    // Filter by nutrition categories
    if (activeNutritionFilters.size > 0) {
        filtered = filtered.filter(restaurant =>
            restaurant.categories.some(cat => activeNutritionFilters.has(cat))
        );
    }

    // Filter by establishment
    if (activeEstablishmentFilters.size > 0) {
        filtered = filtered.filter(restaurant =>
            activeEstablishmentFilters.has(restaurant.establishment)
        );
    }

    return filtered;
}

function updateRestaurantCards() {
    const container = document.getElementById('restaurant-list');
    if (!container) return;

    const filtered = filterRestaurants();
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size:3rem; margin-bottom:20px; color:#ccc;"></i>
                <h3 style="color:#053717; margin-bottom:10px;">No restaurants found</h3>
                <p style="color:#666;">Try selecting different categories</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(restaurant => `
        <div class="restaurant-card-vertical" data-id="${restaurant.id}">
            <div class="restaurant-image" style="background-image:url('${restaurant.image}')">
                <div class="restaurant-rating">
                    <i class="fas fa-star"></i> ${restaurant.rating}
                </div>
                <div class="restaurant-establishment-tag">
                    <i class="fas ${establishmentIcons[restaurant.establishment] || 'fa-utensils'}"></i> 
                    ${establishmentLabels[restaurant.establishment] || restaurant.establishment}
                </div>
            </div>
            <div class="restaurant-info">
                <h4>${restaurant.name}</h4>
                <div class="restaurant-tags">
                    ${restaurant.categories.map(cat => 
                        `<span class="restaurant-tag ${cat.replace('-', '')}">${cat.replace('-', ' ')}</span>`
                    ).join('')}
                </div>
                <div class="restaurant-description">
                    ${restaurant.description}
                </div>
                <div class="restaurant-details">
                    <div class="restaurant-address">
                        <i class="fas fa-map-marker-alt"></i> ${restaurant.address}
                    </div>
                    <div class="restaurant-distance">
                        <i class="fas fa-walking"></i> ${restaurant.distance} away
                    </div>
                    <div class="restaurant-price">
                        <i class="fas fa-dollar-sign"></i> ${restaurant.price}
                    </div>
                </div>
                <button class="view-details-btn" onclick="showRestaurantDetails(${restaurant.id})">
                    <i class="fas fa-info-circle"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
}

function updateDisplay() {
    updateMapMarkers();
    updateRestaurantCards();
    updateResultsCount();
}

function updateResultsCount() {
    const filtered = filterRestaurants();
    const resultsElement = document.getElementById('results-number');
    if (resultsElement) {
        resultsElement.textContent = filtered.length;
    }
}

// ==================== FILTER EVENT HANDLERS ====================

function setupFilters() {
    // Nutrition filters
    const nutritionFilters = document.querySelectorAll('#nutrition-category-list .filter-item');
    nutritionFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.dataset.category;
            
            if (activeNutritionFilters.has(category)) {
                activeNutritionFilters.delete(category);
                this.classList.remove('active');
            } else {
                activeNutritionFilters.add(category);
                this.classList.add('active');
            }
            
            updateDisplay();
        });
    });
    
    // Establishment filters
    const establishmentFilters = document.querySelectorAll('#establishment-category-list .filter-item');
    establishmentFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const establishment = this.dataset.establishment;
            
            if (activeEstablishmentFilters.has(establishment)) {
                activeEstablishmentFilters.delete(establishment);
                this.classList.remove('active');
            } else {
                activeEstablishmentFilters.add(establishment);
                this.classList.add('active');
            }
            
            updateDisplay();
        });
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            nutritionFilters.forEach(filter => filter.classList.remove('active'));
            establishmentFilters.forEach(filter => filter.classList.remove('active'));
            
            activeNutritionFilters.clear();
            activeEstablishmentFilters.clear();
            
            updateDisplay();
        });
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortRestaurants(this.value);
        });
    }
}

function sortRestaurants(sortBy) {
    const container = document.getElementById('restaurant-list');
    if (!container) return;
    
    const cards = Array.from(container.querySelectorAll('.restaurant-card-vertical'));
    
    cards.sort((a, b) => {
        const aId = parseInt(a.dataset.id);
        const bId = parseInt(b.dataset.id);
        const aRestaurant = allRestaurants.find(r => r.id === aId);
        const bRestaurant = allRestaurants.find(r => r.id === bId);
        
        if (!aRestaurant || !bRestaurant) return 0;
        
        switch(sortBy) {
            case 'rating':
                return bRestaurant.rating - aRestaurant.rating;
            case 'distance':
                const aDist = parseFloat(aRestaurant.distance);
                const bDist = parseFloat(bRestaurant.distance);
                return aDist - bDist;
            case 'price':
                const priceOrder = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
                return (priceOrder[aRestaurant.price] || 0) - (priceOrder[bRestaurant.price] || 0);
            case 'name':
            default:
                return aRestaurant.name.localeCompare(bRestaurant.name);
        }
    });
    
    // Re-append cards in sorted order
    cards.forEach(card => container.appendChild(card));
}

// ==================== UTILITY FUNCTIONS ====================

function showRestaurantDetails(id) {
    const restaurant = allRestaurants.find(r => r.id === id);
    if (restaurant) {
        alert(`Details for ${restaurant.name}:\n\n` +
              `${restaurant.description}\n\n` +
              `Address: ${restaurant.address}\n` +
              `Rating: ${restaurant.rating}/5\n` +
              `Distance: ${restaurant.distance}\n` +
              `Price: ${restaurant.price}\n` +
              `Categories: ${restaurant.categories.map(c => c.replace('-', ' ')).join(', ')}\n` +
              `Establishment: ${establishmentLabels[restaurant.establishment]}`);
    }
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

function setupForms() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you! We\'ll notify you when our app launches.');
            this.reset();
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
}

// ==================== MAP RESPONSIVE HANDLING ====================

function setupMapResponsive() {
    window.addEventListener('resize', () => {
        if (map) {
            setTimeout(() => {
                map.invalidateSize(true);
            }, 200);
        }
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (map) {
                map.invalidateSize(true);
            }
        }, 500);
    });
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing The Nutritions app...');
    
    // Setup basic functionality
    setupMobileMenu();
    setupForms();
    setupFilters();
    
    // Initialize map and display
    initMap();
    updateDisplay();
    
    // Setup responsive map
    setupMapResponsive();
    
    // Initialize with some filters active for demo
    setTimeout(() => {
        // Activate a few filters for demo
        document.querySelector('[data-category="vegan"]').classList.add('active');
        document.querySelector('[data-category="vegetarian"]').classList.add('active');
        activeNutritionFilters.add('vegan');
        activeNutritionFilters.add('vegetarian');
        updateDisplay();
    }, 1000);
});