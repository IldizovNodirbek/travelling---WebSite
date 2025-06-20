// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize Swiper for testimonials
const testimonialsSwiper = new Swiper('.testimonials-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});

// Navbar functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScroll();
        
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    handleMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
    }
    
    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Hero section animations
class HeroAnimations {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.destinationCards = document.querySelectorAll('.destination-card');
        
        this.init();
    }
    
    init() {
        this.animateDestinationCards();
        this.handleParallax();
        
        window.addEventListener('scroll', () => this.handleParallax());
    }
    
    animateDestinationCards() {
        this.destinationCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px) scale(1)';
            });
        });
    }
    
    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}

// Interactive elements
class InteractiveElements {
    constructor() {
        this.init();
    }
    
    init() {
        this.handleButtonAnimations();
        this.handleCardHovers();
        this.handleFormSubmissions();
        this.handleCounterAnimations();
    }
    
    handleButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    handleCardHovers() {
        const cards = document.querySelectorAll('.tour-card, .blog-card, .destination-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });
    }
    
    handleFormSubmissions() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                
                if (this.validateEmail(email)) {
                    this.showNotification('Thank you for subscribing!', 'success');
                    e.target.reset();
                } else {
                    this.showNotification('Please enter a valid email address.', 'error');
                }
            });
        }
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    handleCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in');
        this.init();
    }
    
    init() {
        this.observeElements();
    }
    
    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    preloadCriticalResources() {
        const criticalImages = [
            'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
            'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
            'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Search functionality
class SearchFunctionality {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchResults = document.querySelector('.search-results');
        this.destinations = [
            { name: 'Rome', country: 'Italy', price: 299 },
            { name: 'New York', country: 'USA', price: 399 },
            { name: 'Paris', country: 'France', price: 249 },
            { name: 'Barcelona', country: 'Spain', price: 199 },
            { name: 'San Francisco', country: 'USA', price: 349 }
        ];
        
        if (this.searchInput) {
            this.init();
        }
    }
    
    init() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }
    
    handleSearch(query) {
        if (query.length < 2) {
            this.hideResults();
            return;
        }
        
        const results = this.destinations.filter(dest => 
            dest.name.toLowerCase().includes(query.toLowerCase()) ||
            dest.country.toLowerCase().includes(query.toLowerCase())
        );
        
        this.displayResults(results);
    }
    
    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="no-results">No destinations found</div>';
        } else {
            this.searchResults.innerHTML = results.map(dest => `
                <div class="search-result-item">
                    <h4>${dest.name}</h4>
                    <p>${dest.country}</p>
                    <span class="price">$${dest.price}</span>
                </div>
            `).join('');
        }
        
        this.showResults();
    }
    
    showResults() {
        this.searchResults.style.display = 'block';
    }
    
    hideResults() {
        this.searchResults.style.display = 'none';
    }
}

// Theme switcher
class ThemeSwitcher {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        if (this.themeToggle) {
            this.init();
        }
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (this.themeToggle) {
            this.themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
        }
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new HeroAnimations();
    new InteractiveElements();
    new ScrollAnimations();
    new PerformanceOptimizer();
    new SearchFunctionality();
    new ThemeSwitcher();
    
    // Add loading animation removal
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    }
    
    // Add custom cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: #6366f1;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.5';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Add interactive hover effects for buttons and links
    const interactiveElements = document.querySelectorAll('button, a, .card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = '#8b5cf6';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = '#6366f1';
        });
    });
});

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add smooth reveal animations for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionVisible = 150;
        
        if (sectionTop < window.innerHeight - sectionVisible) {
            section.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealSections);
revealSections(); // Initial call

// Add dynamic background colors based on scroll position
const updateBackgroundColor = () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const hue = Math.floor(scrollPercent * 60) + 240; // From blue to purple
    document.documentElement.style.setProperty('--dynamic-bg', `hsl(${hue}, 70%, 95%)`);
};

window.addEventListener('scroll', updateBackgroundColor);