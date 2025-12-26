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

    // Initialize the Vehicles slider (autoplay + controls + dots).
    initVehiclesSlider();

    // Tag page early so vehicle-specific behavior is active before initializing sliders
    tagPageContext();

    // Initialize inline media sliders on vehicle pages
    initMediaSliders();

    // Enhance CTA buttons with ripple
    initButtonRipple();
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
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const isVehicles = path.includes('/vehicles/');
        const isMatch =
            href === currentPage ||
            path.endsWith(href) ||
            // mark Vehicles link active across vehicles section
            (isVehicles && (href.startsWith('vehicles') || href === 'index.html'));

        link.classList.toggle('active', Boolean(isMatch));
        if (isMatch) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
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

// ===== VEHICLES SLIDER =====
function initVehiclesSlider() {
    const slider = document.querySelector('.vehicles-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.vehicles-slide'));
    const dotsContainer = slider.querySelector('.vehicles-dots');
    const prevBtn = slider.querySelector('.vehicles-nav.prev');
    const nextBtn = slider.querySelector('.vehicles-nav.next');
    if (!slides.length || !dotsContainer) return;

    let current = 0;
    let interval;
    const intervalMs = 6000;
    const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)') || { matches: false };

    const dots = slides.map((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'vehicles-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Show vehicle ${idx + 1}`);
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
        dots[current].setAttribute('aria-selected', 'true');
        dots.forEach((d, i) => i !== current && d.removeAttribute('aria-selected'));
    }

    function goTo(idx) { setActive(idx); restart(); }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
        if (prefersReduce.matches) return; // no autoplay
        clearInterval(interval);
        interval = setInterval(next, intervalMs);
    }
    function stop() { clearInterval(interval); }
    function restart() { stop(); start(); }

    // Controls
    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    // Pause on hover/focus
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    // Keyboard arrows
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    // Touch swipe
    let startX = 0, swiping = false;
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX; swiping = true; stop();
    }, { passive: true });
    slider.addEventListener('touchmove', (e) => {
        if (!swiping) return;
        const dx = e.touches[0].clientX - startX;
        if (Math.abs(dx) > 40) { swiping = false; dx < 0 ? next() : prev(); }
    }, { passive: true });
    slider.addEventListener('touchend', () => { swiping = false; start(); });

    // Visibility pause
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();
    });

    setActive(0);
    start();
}

// ===== MEDIA SLIDERS (INLINE ON VEHICLE PAGES) =====
function initMediaSliders() {
    const sliders = document.querySelectorAll('.media-slider');
    if (!sliders.length) return;

    // adapt all vehicle detail pages
    const isAdaptivePage = () => document.body.classList.contains('page-vehicle');

    sliders.forEach(slider => {
        const slides = Array.from(slider.querySelectorAll('.media-slide'));
        const dotsContainer = slider.querySelector('.media-dots');
        const prevBtn = slider.querySelector('.media-nav.prev');
        const nextBtn = slider.querySelector('.media-nav.next');
        if (!slides.length || !dotsContainer) return;

        let current = 0;
        let interval;
        const intervalMs = 5000;
        const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)') || { matches: false };

        const dots = slides.map((_, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'media-dot';
            dot.setAttribute('aria-label', `Show image ${idx + 1}`);
            dot.addEventListener('click', () => goTo(idx));
            dotsContainer.appendChild(dot);
            return dot;
        });

        // All vehicles: set slider height to match current image aspect ratio (no cropping)
        const updateAdaptiveSliderSize = () => {
            if (!isAdaptivePage()) return;
            const active = slides[current];
            const img = active?.querySelector('img');
            if (!img) return;

            const apply = () => {
                if (!img.naturalWidth || !img.naturalHeight) return;
                const w = slider.clientWidth || img.clientWidth || 0;
                if (!w) return;
                slider.style.height = Math.round(w * (img.naturalHeight / img.naturalWidth)) + 'px';
            };
            if (img.complete) apply();
            else img.addEventListener('load', apply, { once: true });
        };

        function setActive(idx) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (idx + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
            updateAdaptiveSliderSize();
        }

        function goTo(idx) { setActive(idx); restart(); }
        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function start() {
            if (prefersReduce.matches) return;
            clearInterval(interval);
            interval = setInterval(next, intervalMs);
        }
        function stop() { clearInterval(interval); }
        function restart() { stop(); start(); }

        prevBtn?.addEventListener('click', prev);
        nextBtn?.addEventListener('click', next);
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        slider.addEventListener('focusin', stop);
        slider.addEventListener('focusout', start);
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        });

        window.addEventListener('resize', updateAdaptiveSliderSize);

        setActive(0);
        start();
        updateAdaptiveSliderSize();
    });
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

function tagPageContext() {
    const path = window.location.pathname || '';
    const body = document.body;

    // general tag for all vehicle detail pages
    if (/\/vehicles\/.+\.html$/.test(path)) {
        body.classList.add('page-vehicle');
    }

    // keep specific tags (existing + add cars/jeep)
    if (path.endsWith('/vehicles/van.html') || path.endsWith('van.html')) {
        body.classList.add('page-van');
    }
    if (path.endsWith('/vehicles/bus.html') || path.endsWith('bus.html')) {
        body.classList.add('page-bus');
    }
    if (path.endsWith('/vehicles/cars.html') || path.endsWith('cars.html')) {
        body.classList.add('page-cars');
    }
    if (path.endsWith('/vehicles/jeep.html') || path.endsWith('jeep.html')) {
        body.classList.add('page-jeep');
    }
}

// ===== BUTTON RIPPLE EFFECT =====
function initButtonRipple() {
	const buttons = document.querySelectorAll('.btn-cta');
	if (!buttons.length) return;

	buttons.forEach(btn => {
		btn.addEventListener('click', (e) => {
			const rect = btn.getBoundingClientRect();
			const size = Math.max(rect.width, rect.height);
			const x = e.clientX - rect.left - size / 2;
			const y = e.clientY - rect.top - size / 2;

			const ripple = document.createElement('span');
			ripple.className = 'ripple';
			ripple.style.width = `${size}px`;
			ripple.style.height = `${size}px`;
			ripple.style.left = `${x}px`;
			ripple.style.top = `${y}px`;
			btn.appendChild(ripple);

			ripple.addEventListener('animationend', () => ripple.remove());
		});
	});
}
