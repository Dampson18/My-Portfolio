//Loader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.5s ease-out';

    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500); // fade out smoothly
});



document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate offset for fixed header
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const offset = navbarHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const nav = document.getElementById('main-nav');
                const hamburger = document.getElementById('hamburger-menu');
                if (nav && hamburger && nav.classList.contains('nav-open')) { // Added checks for existence
                    nav.classList.remove('nav-open');
                    hamburger.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.setAttribute('aria-label', 'Open navigation');
                }
            } else {
                 console.warn(`Smooth scroll target not found: ${targetId}`);
            }
        });
    });

    // --- Fixed Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Mobile Navigation Toggle ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerMenu && mainNav) { // Added checks for existence
        hamburgerMenu.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('nav-open');
            hamburgerMenu.classList.toggle('open', isOpen);
            hamburgerMenu.setAttribute('aria-expanded', String(isOpen));
            hamburgerMenu.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} navigation`);
        });
        hamburgerMenu.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                hamburgerMenu.click();
            }
        });

        // Handle initial state and resize for mobile nav
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mainNav.classList.remove('nav-open');
                hamburgerMenu.classList.remove('open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
                hamburgerMenu.setAttribute('aria-label', 'Open navigation');
                mainNav.style.display = '';
            }
        });
    }

    // --- Persistent color theme ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        let savedTheme = 'dark';
        try { savedTheme = localStorage.getItem('kelvin-theme') || 'dark'; } catch (error) { /* Storage may be unavailable in private browsing. */ }
        document.body.dataset.theme = savedTheme;
        const updateThemeButton = () => {
            const isLight = document.body.dataset.theme === 'light';
            themeToggle.innerHTML = `<i class="fas fa-${isLight ? 'moon' : 'sun'}" aria-hidden="true"></i>`;
            themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
        };
        updateThemeButton();
        themeToggle.addEventListener('click', () => {
            document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
            try { localStorage.setItem('kelvin-theme', document.body.dataset.theme); } catch (error) { /* Theme still works for this page view. */ }
            updateThemeButton();
        });
    }

    // --- Project filtering and search (homepage and project archive) ---
    const projectCards = Array.from(document.querySelectorAll('.projects-grid .project-card'));
    const filterButtons = document.querySelectorAll('.filter-chip');
    const projectSearch = document.getElementById('project-search');
    const emptyProjects = document.getElementById('project-empty');
    const archiveCount = document.getElementById('archive-count');
    if (projectCards.length && filterButtons.length) {
        const featuredProjects = ['PFIS', 'Quiz App', 'NextEdge IT & Design (Business Site)', 'Biotech Diagnostic Services', 'Praise Media Team', 'Graphics'];
        const isArchivePage = document.body.classList.contains('projects-page');
        projectCards.forEach(card => {
            if (!card.dataset.category) {
                const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
                const category = /graphic/.test(title) ? 'design' : /website|market|biotech|home care|nextedge|media team/.test(title) ? 'web' : 'apps';
                card.dataset.category = category;
            }
            if (!card.dataset.featured) card.dataset.featured = String(featuredProjects.includes(card.querySelector('h3')?.textContent.trim()));
        });
        let activeFilter = 'all';
        const applyProjectFilters = () => {
            const searchTerm = (projectSearch?.value || '').trim().toLowerCase();
            let visibleCount = 0;
            projectCards.forEach(card => {
                const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
                const matchesSearch = !searchTerm || card.textContent.toLowerCase().includes(searchTerm);
                const matchesFeatured = isArchivePage || activeFilter !== 'all' || searchTerm || card.dataset.featured === 'true';
                const isVisible = matchesCategory && matchesSearch && matchesFeatured;
                card.hidden = !isVisible;
                if (isVisible) visibleCount += 1;
            });
            if (emptyProjects) emptyProjects.hidden = visibleCount !== 0;
            if (archiveCount) archiveCount.textContent = String(visibleCount);
        };
        filterButtons.forEach(button => button.addEventListener('click', () => {
            activeFilter = button.dataset.filter || 'all';
            filterButtons.forEach(filterButton => {
                const isActive = filterButton === button;
                filterButton.classList.toggle('is-active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });
            applyProjectFilters();
        }));
        projectSearch?.addEventListener('input', applyProjectFilters);
        applyProjectFilters();
    }

    document.querySelectorAll('.current-year').forEach(year => { year.textContent = String(new Date().getFullYear()); });

    // --- Scroll-to-Top Button Functionality ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) { // Added check for existence
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Fade-in on Scroll Animation (Intersection Observer) ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');

    if (fadeInSections.length > 0) { // Added check for existence
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the section must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, observerOptions);

        fadeInSections.forEach(section => {
            observer.observe(section);
        });
    } else {
        console.info("No elements with class 'fade-in-section' found for animation.");
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const leftButton = document.querySelector('.carousel-button.left');
    const rightButton = document.querySelector('.carousel-button.right');
    let currentIndex = 0;

    // Added checks for existence of all crucial carousel elements
    if (carousel && slides.length > 0 && leftButton && rightButton) {
        function updateCarousel() {
            const offset = -currentIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        }

        leftButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        rightButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        // Optional: Auto-slide
        // setInterval(() => {
        //     currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        //     updateCarousel();
        // }, 5000); // Change slide every 5 seconds

        // Initialize carousel position
        updateCarousel();
    }

    // --- EmailJS Integration for Contact Form ---
    // Initialize EmailJS when its external script is available.
    if (window.emailjs) window.emailjs.init("KBzrXsKlJPofF9Q9Y");

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const status = document.getElementById('contact-status');
            const submitButton = contactForm.querySelector('[type="submit"]');
            if (!window.emailjs) {
                if (status) status.textContent = 'The message service is unavailable right now. Please email me directly instead.';
                return;
            }

            const serviceID = "service_xwbbdjs";   // IMPORTANT: Replace with your actual Service ID from EmailJS
            const templateID = "template_nzfuakh"; // IMPORTANT: Replace with your actual Template ID from EmailJS

            // Get current date and time for the email
            const now = new Date();
            const submissionTime = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true // Use 12-hour format with AM/PM
            });

            // Collect all form data using FormData and add the submission time
            const formData = new FormData(this); // 'this' refers to the form element itself
            const templateParams = {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                submission_time: submissionTime // Add the generated submission time
            };

            // Send the email using emailjs.send with the custom parameters
            if (status) status.textContent = 'Sending your message…';
            if (submitButton) submitButton.disabled = true;
            window.emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    if (status) status.textContent = 'Thanks — your message has been sent successfully.';
                    contactForm.reset(); // Clear all form fields after successful submission
                }, (error) => {
                    console.error('Failed to send message:', error);
                    if (status) status.textContent = 'Something went wrong. Please try again or email me directly.';
                })
                .finally(() => { if (submitButton) submitButton.disabled = false; });
        });
    }

}); // THIS IS THE CRUCIAL MISSING CLOSING BRACE FOR DOMContentLoaded
