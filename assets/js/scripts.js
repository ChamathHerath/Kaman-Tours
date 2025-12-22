// ===============================================
// KAMAN TOURS - JAVASCRIPT FUNCTIONALITY
// ===============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kaman Tours Website Loaded Successfully!');
    
    // Mobile Navigation Toggle (if needed in future)
    initMobileNavigation();
    
    // Smooth Scrolling for anchor links
    initSmoothScrolling();
    
    // Form Validation
    initFormValidation();
    
    // Active Navigation Highlighting
    highlightActiveNav();

    // Hero Slider
    initHeroSlider();

    // Header Scroll Effect
    addHeaderScrollEffect();

    // Navigation Scroll Spy
    initNavScrollSpy();
});

// ===== MOBILE NAVIGATION =====
function initMobileNavigation() {
    // This function can be expanded for mobile menu toggle
    const nav = document.querySelector('nav');
    
    // Add responsive behavior if needed
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Desktop view
            nav.style.display = 'block';
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll if it's an anchor on the same page
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');
            
            // Basic validation
            let isValid = true;
            
            if (name && name.value.trim() === '') {
                alert('Please enter your name');
                isValid = false;
                return;
            }
            
            if (email && !validateEmail(email.value)) {
                alert('Please enter a valid email address');
                isValid = false;
                return;
            }
            
            if (message && message.value.trim() === '') {
                alert('Please enter a message');
                isValid = false;
                return;
            }
            
            if (isValid) {
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                form.reset();
            }
        });
    });
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== HIGHLIGHT ACTIVE NAVIGATION =====
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== HERO SLIDER =====
function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dotsContainer = slider.querySelector('.hero-dots');
    const prevBtn = slider.querySelector('.hero-nav.prev');
    const nextBtn = slider.querySelector('.hero-nav.next');

    if (!slides.length || !dotsContainer) return;

    let current = 0;
    let interval;
    const intervalMs = 7000;

    const dots = slides.map((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hero-dot';
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => goTo(idx));
        dotsContainer.appendChild(dot);
        return dot;
    });

    function setActive(idx) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function goTo(idx) {
        setActive(idx);
        restart();
    }

    function next() {
        goTo(current + 1);
    }

    function prev() {
        goTo(current - 1);
    }

    function restart() {
        clearInterval(interval);
        interval = setInterval(next, intervalMs);
    }

    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    setActive(0);
    interval = setInterval(next, intervalMs);
}

// /* Add a 'scrolled' class to header for depth after scrolling */
function addHeaderScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;

    const update = () => {
        if (window.scrollY > 8) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* Scroll-spy: highlight nav anchors (#section) based on scroll position */
function initNavScrollSpy() {
    const links = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    if (!links.length) return;

    const targets = links
        .map(a => {
            const sel = a.getAttribute('href');
            try { return document.querySelector(sel); } catch { return null; }
        })
        .filter(Boolean);

    if (!targets.length) return;

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const offset = 90; // approximate header height
            const fromTop = window.scrollY + offset;

            let currentId = null;
            for (const section of targets) {
                if (section.offsetTop <= fromTop) currentId = section.id;
            }

            links.forEach(a => {
                const match = a.getAttribute('href') === `#${currentId}`;
                a.classList.toggle('active', match);
                if (match) a.setAttribute('aria-current', 'page');
                else a.removeAttribute('aria-current');
            });

            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ===== SCROLL TO TOP BUTTON (Optional Enhancement) =====
function addScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.classList.add('scroll-to-top');
    scrollBtn.style.display = 'none';
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LAZY LOADING IMAGES (Optional Enhancement) =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== UTILITY FUNCTIONS =====

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// Console welcome message
console.log('%c Welcome to Kaman Tours! ', 'background: #1E88E5; color: white; font-size: 16px; padding: 10px;');
console.log('%c Explore Sri Lanka with us! ', 'background: #43A047; color: white; font-size: 14px; padding: 5px;');
