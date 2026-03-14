/* ============================================
   ARAR GROUP — Premium EPC Portal
   Interactive Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Sticky Navigation ----
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 80;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check on load


    // ---- Mobile Navigation ----
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = mobileNav.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    // ---- Chairman Hero Parallax ----
    const chairmanBg = document.querySelector('.chairman-bg');
    if (chairmanBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.getElementById('hero').offsetHeight;
            if (scrolled < heroHeight) {
                const speed = 0.25;
                chairmanBg.style.transform = `scale(1.05) translateY(${scrolled * speed}px)`;
            }
        }, { passive: true });
    }


    // ---- Scroll Animations (Intersection Observer) ----
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));


    // ---- Animated Counters ----
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
                counterObserver.disconnect();
            }
        });
    }, {
        threshold: 0.3
    });

    // Observe the stats section
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            function updateCounter(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out cubic)
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }


    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ---- Parallax Effect for Stats Background ----
    const statsBg = document.querySelector('.stats-bg');
    if (statsBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const statsRect = statsSection.getBoundingClientRect();
            if (statsRect.top < window.innerHeight && statsRect.bottom > 0) {
                const speed = 0.3;
                const yPos = -(scrolled * speed);
                statsBg.style.transform = `translateY(${yPos}px)`;
            }
        }, { passive: true });
    }


    // ---- Active Nav Link Highlighting ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--deep-red)';
            }
        });
    }, { passive: true });


    // (Hero preload removed — single chairman image loads with the page)

    // ---- About Section Scroll Gallery ----
    const aboutGallery = document.getElementById('aboutGallery');
    const gallerySlides = document.querySelectorAll('.about-gallery-slide');
    const galleryDots = document.querySelectorAll('.about-gallery-dot');
    let currentGallerySlide = 0;
    const totalGallerySlides = gallerySlides.length;
    let isInsideGallery = false;
    let galleryScrollCooldown = false;

    function goToGallerySlide(index) {
        gallerySlides.forEach(s => s.classList.remove('active'));
        galleryDots.forEach(d => d.classList.remove('active'));
        currentGallerySlide = index;
        gallerySlides[currentGallerySlide].classList.add('active');
        galleryDots[currentGallerySlide].classList.add('active');
    }

    if (aboutGallery && totalGallerySlides > 0) {
        // Track if cursor is inside the gallery
        aboutGallery.addEventListener('mouseenter', () => { isInsideGallery = true; });
        aboutGallery.addEventListener('mouseleave', () => { isInsideGallery = false; });

        // Scroll within box — intercept wheel events
        aboutGallery.addEventListener('wheel', (e) => {
            // Always prevent page scroll when cursor is inside the gallery
            e.preventDefault();
            e.stopPropagation();

            if (galleryScrollCooldown) return;
            galleryScrollCooldown = true;

            if (e.deltaY > 0) {
                const next = (currentGallerySlide + 1) % totalGallerySlides;
                goToGallerySlide(next);
            } else {
                const prev = (currentGallerySlide - 1 + totalGallerySlides) % totalGallerySlides;
                goToGallerySlide(prev);
            }

            setTimeout(() => { galleryScrollCooldown = false; }, 500);
        }, { passive: false });

        // Dot click navigation
        galleryDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const target = parseInt(dot.getAttribute('data-index'));
                if (target !== currentGallerySlide) {
                    goToGallerySlide(target);
                }
            });
        });

        // ---- RadiusOnScroll Effect ----
        const startRadius = 0;    // starts sharp / full-bleed
        const endRadius = 48;     // rounds to 48px
        const galleryTrack = document.getElementById('aboutGalleryTrack');

        function updateRadiusOnScroll() {
            const rect = aboutGallery.getBoundingClientRect();
            const windowH = window.innerHeight;

            // Start when bottom of element enters viewport, end when top reaches center
            const triggerStart = windowH;   // element bottom enters viewport
            const triggerEnd = windowH * 0.3; // element is well into view

            // Progress: 0 = just entering, 1 = fully in view
            const progress = Math.min(Math.max(
                (triggerStart - rect.top) / (triggerStart - triggerEnd),
                0), 1);

            const currentRadius = startRadius + (endRadius - startRadius) * progress;
            aboutGallery.style.borderRadius = currentRadius + 'px';

            requestAnimationFrame(updateRadiusOnScroll);
        }

        requestAnimationFrame(updateRadiusOnScroll);
    }



    // ---- Mouse Trail ----
    const trailDots = [];
    const numDots = 12;

    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'mouse-trail-dot';
        document.body.appendChild(dot);
        trailDots.push({
            element: dot,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trailDots.forEach((dot, index) => {
            const nextDot = trailDots[index + 1] || trailDots[0];
            dot.x = x;
            dot.y = y;

            const scale = 1 - (index / numDots);
            dot.element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            dot.element.style.opacity = scale * 0.6;

            x += (nextDot.x - x) * 0.35;
            y += (nextDot.y - y) * 0.35;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();

    // ---- Back to Top Button ----
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ---- Services Carousel Navigation ----
    const servicesGrid = document.getElementById('servicesGrid');
    const arrowLeft = document.getElementById('servicesArrowLeft');
    const arrowRight = document.getElementById('servicesArrowRight');

    if (servicesGrid && arrowLeft && arrowRight) {
        function getCardScrollAmount() {
            const card = servicesGrid.querySelector('.service-card');
            if (!card) return 300;
            const style = getComputedStyle(servicesGrid);
            const gap = parseInt(style.gap) || 28;
            return card.offsetWidth + gap;
        }

        function updateArrows() {
            const maxScroll = servicesGrid.scrollWidth - servicesGrid.clientWidth;
            arrowLeft.disabled = servicesGrid.scrollLeft <= 5;
            arrowRight.disabled = servicesGrid.scrollLeft >= maxScroll - 5;
        }

        arrowLeft.addEventListener('click', () => {
            servicesGrid.scrollBy({ left: -getCardScrollAmount(), behavior: 'smooth' });
        });

        arrowRight.addEventListener('click', () => {
            servicesGrid.scrollBy({ left: getCardScrollAmount(), behavior: 'smooth' });
        });

        servicesGrid.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }

});
