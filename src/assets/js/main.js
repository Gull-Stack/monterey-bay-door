// Rotating hero background images
(function() {
    const heroImages = [
        '/assets/images/hero/hero-commercial-building-1920w.jpg',
        '/assets/images/hospitality/hotel-corridor-hero-1920w.jpg',
        '/assets/images/access-control/keycard-access-system-hero-1920w.jpg',
        '/assets/images/buildings/college-campus-hero-1920w.jpg',
        '/assets/images/service/technician-installation-hero-1920w.jpg'
    ];
    const hero = document.querySelector('.hero:not(.hero-compact)');
    if (hero && hero.closest('[data-page="home"]') || (hero && window.location.pathname === '/')) {
        const randomImg = heroImages[Math.floor(Math.random() * heroImages.length)];
        hero.style.backgroundImage = 'linear-gradient(rgba(5, 30, 33, 0.7), rgba(5, 30, 33, 0.7)), url("' + randomImg + '")';
    }
})();

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add active class to current nav item
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))) {
            link.classList.add('active');
        }
    });
});

// Form enhancement
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            // Add loading state to submit buttons
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent || submitBtn.value;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Re-enable after 3 seconds (in case of error)
                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
});