// Utility Functions
const utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollToElement: (element, offset = 80) => {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Loading Screen Manager
class LoadingManager {
    constructor() {
        this.loader = document.getElementById('loader');
        this.init();
    }

    init() {
        // Hide loader after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoader();
            }, 1500);
        });

        // Fallback: hide loader after 3 seconds
        setTimeout(() => {
            this.hideLoader();
        }, 3000);
    }

    hideLoader() {
        if (this.loader) {
            this.loader.style.opacity = '0';
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 500);
        }
    }
}

// Navigation Manager
class NavigationManager {
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
        this.handleActiveLink();
        
        // Use throttled scroll handler for better performance
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleScroll();
            this.handleActiveLink();
        }, 16));
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
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    utils.scrollToElement(targetSection);
                }
            });
        });
    }

    handleActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.animatedElements = document.querySelectorAll('[class*="animate-"]');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.createObserver();
        this.handleHeroAnimations();
        this.handleParallaxEffect();
        
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleParallaxEffect();
        }, 16));
    }
    
    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        this.animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
            observer.observe(element);
        });
    }

    handleHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const destinationCards = document.querySelectorAll('.hero-destinations .destination-card');

        // Animate hero content
        setTimeout(() => {
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
        }, 500);

        // Animate destination cards
        destinationCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 1000 + (index * 200));
        });
    }

    handleParallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background, .hero-particles');
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('hero-particles') ? 0.3 : 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}

// Interactive Elements Manager
class InteractiveManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.handleButtonAnimations();
        this.handleCardHovers();
        this.handleFormSubmissions();
        this.createRippleEffect();
    }
    
    handleButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    handleCardHovers() {
        const cards = document.querySelectorAll('.tour-card, .blog-card, .destination-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
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
                    this.showNotification('Thank you for subscribing! 🎉', 'success');
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
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            ${type === 'success' ? 
                'background: linear-gradient(135deg, #10b981 0%, #059669 100%);' : 
                'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);'
            }
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
        }, 4000);
    }

    createRippleEffect() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// Testimonials Slider Manager
class TestimonialsManager {
    constructor() {
        this.slider = document.getElementById('testimonials-slider');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentSlide = 0;
        this.autoPlayInterval = null;

        if (!this.slider || !this.slides.length || !this.dots.length || !this.prevBtn || !this.nextBtn) {
            console.error('Testimonials slider elementlari topilmadi yoki yetarli emas.');
            return;
        }

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlider();
        this.startAutoPlay();
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.prevSlide();
            this.startAutoPlay();
        });

        this.nextBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.nextSlide();
            this.startAutoPlay();
        });

        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoPlay();
                this.goToSlide(index);
                this.startAutoPlay();
            });
        });

        // Pause auto-play on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.updateSlider();
        }
    }

    updateSlider() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

         this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.slides.length - 1;
    }

    startAutoPlay() {
        this.stopAutoPlay(); 
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); 
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsManager();
});


// Scroll Reveal Manager
class ScrollRevealManager {
    constructor() {
        this.elements = document.querySelectorAll('.destination-item, .tour-card, .blog-card');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.createObserver();
    }
    
    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Performance Manager
class PerformanceManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeAnimations();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
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
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
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

    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }
    }
}

// Custom Cursor Manager
class CursorManager {
    constructor() {
        this.cursor = null;
        this.init();
    }
    
    init() {
        // Only add custom cursor on desktop devices
        if (window.innerWidth > 1024) {
            this.createCursor();
            this.setupEventListeners();
        }
    }
    
    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            opacity: 0;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(this.cursor);
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            if (this.cursor) {
                this.cursor.style.left = e.clientX - 10 + 'px';
                this.cursor.style.top = e.clientY - 10 + 'px';
                this.cursor.style.opacity = '0.7';
            }
        });
        
        document.addEventListener('mouseleave', () => {
            if (this.cursor) {
                this.cursor.style.opacity = '0';
            }
        });
        
        // Interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .card, input');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.cursor) {
                    this.cursor.style.transform = 'scale(1.5)';
                    this.cursor.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                if (this.cursor) {
                    this.cursor.style.transform = 'scale(1)';
                    this.cursor.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
                }
            });
        });
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.setupThemeToggle();
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
    
    setupThemeToggle() {
        // Add theme toggle button if needed
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }
}

// Main Application
class TVLApp {
    constructor() {
        this.managers = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeManagers();
            });
        } else {
            this.initializeManagers();
        }
    }
    
    initializeManagers() {
        try {
            // Initialize all managers
            this.managers.loading = new LoadingManager();
            this.managers.navigation = new NavigationManager();
            this.managers.animation = new AnimationManager();
            this.managers.interactive = new InteractiveManager();
            this.managers.testimonials = new TestimonialsManager();
            this.managers.scrollReveal = new ScrollRevealManager();
            this.managers.performance = new PerformanceManager();
            this.managers.cursor = new CursorManager();
            this.managers.theme = new ThemeManager();
            
            // Add global event listeners
            this.setupGlobalEvents();
            
            console.log('TVL App initialized successfully! 🚀');
        } catch (error) {
            console.error('Error initializing TVL App:', error);
        }
    }
    
    setupGlobalEvents() {
        // Handle window resize
        window.addEventListener('resize', utils.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations when tab is not visible
                this.pauseAnimations();
            } else {
                // Resume animations when tab becomes visible
                this.resumeAnimations();
            }
        });
        
        // Add smooth scrolling for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    utils.scrollToElement(target);
                }
            });
        });
    }
    
    handleResize() {
        // Reinitialize cursor on desktop/mobile switch
        if (this.managers.cursor) {
            if (window.innerWidth <= 1024 && this.managers.cursor.cursor) {
                this.managers.cursor.cursor.remove();
                this.managers.cursor.cursor = null;
            } else if (window.innerWidth > 1024 && !this.managers.cursor.cursor) {
                this.managers.cursor.init();
            }
        }
    }
    
    pauseAnimations() {
        document.querySelectorAll('[class*="animate-"]').forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }
    
    resumeAnimations() {
        document.querySelectorAll('[class*="animate-"]').forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
}

// Add CSS for ripple effect and notifications
const additionalCSS = `
@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.notification {
    font-family: 'Inter', sans-serif;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.notification-icon {
    font-size: 1.2rem;
    font-weight: bold;
}

.custom-cursor {
    pointer-events: none !important;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Focus styles for better accessibility */
.btn:focus-visible,
.nav-link:focus-visible,
input:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
    border-radius: 4px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .btn-primary {
        background: #000;
        border: 2px solid #fff;
    }
    
    .section-title {
        color: #000;
    }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize the application
const app = new TVLApp();
