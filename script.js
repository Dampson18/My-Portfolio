document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate offset for fixed header if needed, or simply scroll to view
                const offset = 70; // Adjust this value if you have a fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const nav = document.getElementById('main-nav');
                const hamburger = document.getElementById('hamburger-menu');
                if (nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    hamburger.classList.remove('open');
                    // No need to explicitly set display: 'none' here
                }
            }
        });
    });

    // --- Mobile Navigation Toggle ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    hamburgerMenu.addEventListener('click', () => {
        if (mainNav.classList.contains('nav-open')) {
            mainNav.classList.remove('nav-open');
            hamburgerMenu.classList.remove('open');
            // Remove the direct style.display = 'none'; line
        } else {
            // No need to set display: 'flex'; here, CSS will handle it via transform
            mainNav.classList.add('nav-open');
            hamburgerMenu.classList.add('open');
        }
    });

    // Handle initial state and resize for mobile nav
    // The CSS handles the `display` property for desktop vs mobile initially.
    // The JS toggles the `nav-open` class for the slide effect.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('nav-open');
            hamburgerMenu.classList.remove('open');
            // Ensure no lingering display: none if resized from mobile while nav was open
            mainNav.style.display = ''; 
        }
    });

    // --- Scroll-to-Top Button Functionality ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

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

    // --- Fade-in on Scroll Animation (Intersection Observer) ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');

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

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const leftButton = document.querySelector('.carousel-button.left');
    const rightButton = document.querySelector('.carousel-button.right');
    let currentIndex = 0;

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
    //      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    //      updateCarousel();
    // }, 5000); // Change slide every 5 seconds

    // Initialize carousel position
    updateCarousel();

    // --- EmailJS Integration for Contact Form ---
// Initialize EmailJS with your Public API Key
emailjs.init("KBzrXsKlJPofF9Q9Y"); // IMPORTANT: Replace with your actual Public API Key from EmailJS

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const serviceID = "service_xwbbdjs";   // IMPORTANT: Replace with your actual Service ID from EmailJS
        const templateID = "template_ktkt0fq"; // IMPORTANT: Replace with your actual Template ID from EmailJS

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
        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
                alert('Your message has been sent successfully!');
                contactForm.reset(); // Clear all form fields after successful submission
            }, (error) => {
                console.error('Failed to send message:', error);
                alert('Oops! Something went wrong. Please try again later.');
            });
    });
} else {
    // This error will show in the console if the form with ID 'contactForm' isn't found in your HTML
    console.error("Contact form with ID 'contactForm' not found.");
}
