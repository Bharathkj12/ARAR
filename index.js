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



    // ---- Electric Cables Canvas ----
    (function initElectricCables() {
        const canvas = document.getElementById('logoDroplets');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const CFG = {
            count: 6,                 // Number of cables
            thickness: 18,            // Base cable thickness
            pulseSpeed: 1000,         // Pixels per second electricity travels
            pulseLength: 250,         // Length of the electricity pulse
            cableBase: [30, 30, 30],  // Dark grey base color
            cableHighlight: [90, 90, 90], // Light grey 3D curve highlight
            elecCore: [220, 240, 255],// Bright icy blue/white core
            elecGlow: [40, 140, 255]  // Electric neon blue glow
        };

        function resize() {
            const s = canvas.parentElement;
            canvas.width = s.offsetWidth;
            canvas.height = s.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Utility: standard seeded-like random
        function rand(min, max) { return Math.random() * (max - min) + min; }
        function rgba(rgb, a) {
            return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.min(1, Math.max(0, a))})`;
        }

        // Generate curved cable paths (array of x, y points)
        // They will fall diagonally roughly from top-right to bottom-left 
        // behind the logo, simulating heavy industrial power cables.
        const cables = [];

        function generateCables() {
            cables.length = 0;
            const w = canvas.width;
            const h = canvas.height;
            const maxDim = Math.max(w, h);

            for (let i = 0; i < CFG.count; i++) {
                // start positions scattered along top and right edge
                const startX = rand(-w * 0.2, w * 1.2);
                const startY = -200 - rand(0, h * 0.5);

                // End positions scattered along bottom and left edge
                const endX = startX - rand(w * 0.5, w * 1.5);
                const endY = h + 200 + rand(0, h * 0.5);

                // Create a bezier curve between start and end
                const cp1x = startX + rand(-400, 400);
                const cp1y = startY + (endY - startY) * rand(0.2, 0.4);

                const cp2x = endX + rand(-400, 400);
                const cp2y = startY + (endY - startY) * rand(0.6, 0.8);

                // Sample the curve into a polyline of points
                const pts = [];
                const steps = 60; // Resolution of the cable curve
                let totalLen = 0;

                for (let t = 0; t <= steps; t++) {
                    const pct = t / steps;
                    const u = 1 - pct;
                    const x = u * u * u * startX + 3 * u * u * pct * cp1x + 3 * u * pct * pct * cp2x + pct * pct * pct * endX;
                    const y = u * u * u * startY + 3 * u * u * pct * cp1y + 3 * u * pct * pct * cp2y + pct * pct * pct * endY;

                    if (t > 0) {
                        const dx = x - pts[t - 1].x;
                        const dy = y - pts[t - 1].y;
                        totalLen += Math.sqrt(dx * dx + dy * dy);
                    }
                    pts.push({ x, y, len: totalLen });
                }

                // Add to array with independent electricity pulse trackers
                cables.push({
                    pts,
                    totalLen,
                    thickness: rand(CFG.thickness * 0.6, CFG.thickness * 1.4),
                    // Current pulse offset along the cable length
                    pulseDist: rand(0, totalLen),
                    // Specific pulse speed to vary them
                    speed: CFG.pulseSpeed * rand(0.7, 1.3),
                    // 3D shadow offset perspective
                    depth: rand(0.4, 1)
                });
            }
        }

        generateCables();
        // Re-gen if window reshapes entirely
        let lastW = canvas.width;
        window.addEventListener('resize', () => {
            if (Math.abs(canvas.width - lastW) > 100) {
                generateCables();
                lastW = canvas.width;
            }
        });

        let last = null;
        function draw(ts) {
            if (!last) last = ts;
            const dt = (ts - last) / 1000;
            last = ts;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw each cable
            cables.forEach(c => {
                // Update pulse
                c.pulseDist += c.speed * dt;
                if (c.pulseDist - CFG.pulseLength > c.totalLen) {
                    c.pulseDist = -CFG.pulseLength; // Reset to top
                }

                const pts = c.pts;

                // 1. Draw solid 3D Cable Base (shadowed tube)
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Draw drop shadow
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y + 15 * c.depth);
                for (let i = 1; i < pts.length; i++) {
                    ctx.lineTo(pts[i].x, pts[i].y + 15 * c.depth);
                }
                ctx.strokeStyle = 'rgba(0,0,0,0.6)';
                ctx.lineWidth = c.thickness;
                ctx.filter = `blur(${5 * c.depth}px)`;
                ctx.stroke();
                ctx.filter = 'none';

                // Physical cable base (dark)
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
                ctx.strokeStyle = rgba(CFG.cableBase, 1);
                ctx.lineWidth = c.thickness;
                ctx.stroke();

                // 3D Highlight curve (inset slightly and lighter)
                ctx.beginPath();
                // offset normal to give 3D tube effect
                ctx.moveTo(pts[0].x - 2, pts[0].y - 2);
                for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x - 2, pts[i].y - 2);
                ctx.strokeStyle = rgba(CFG.cableHighlight, 0.4);
                ctx.lineWidth = c.thickness * 0.4;
                ctx.stroke();

                // 2. Draw the Electricity Pulse OVER the cable
                // We find the sub-path of the pulse based on pulseDist
                const pStart = c.pulseDist - CFG.pulseLength;
                const pEnd = c.pulseDist;

                // Only draw if pulse is currently within cable bounds
                if (pEnd > 0 && pStart < c.totalLen) {

                    const pulsePts = [];
                    for (let i = 0; i < pts.length; i++) {
                        const p = pts[i];
                        if (p.len >= pStart && p.len <= pEnd) {
                            pulsePts.push(p);
                        }
                    }

                    if (pulsePts.length > 1) {
                        ctx.globalCompositeOperation = 'lighter';

                        // Wide red glow
                        ctx.beginPath();
                        ctx.moveTo(pulsePts[0].x, pulsePts[0].y);
                        for (let i = 1; i < pulsePts.length; i++) ctx.lineTo(pulsePts[i].x, pulsePts[i].y);
                        ctx.strokeStyle = rgba(CFG.elecGlow, 0.6);
                        ctx.lineWidth = c.thickness * 2.5;
                        ctx.filter = 'blur(12px)';
                        ctx.stroke();

                        // Inner red glow
                        ctx.strokeStyle = rgba(CFG.elecGlow, 0.9);
                        ctx.lineWidth = c.thickness * 1.2;
                        ctx.filter = 'blur(4px)';
                        ctx.stroke();

                        // Core white electric spark
                        ctx.strokeStyle = rgba(CFG.elecCore, 1);
                        ctx.lineWidth = c.thickness * 0.6;
                        ctx.filter = 'none';
                        // Add some jitter to the white core to make it look "crackling"
                        ctx.beginPath();
                        ctx.moveTo(pulsePts[0].x, pulsePts[0].y);
                        for (let i = 1; i < pulsePts.length; i++) {
                            // High-frequency noise jitter perpendicular to path
                            const jitter = rand(-2, 2);
                            ctx.lineTo(pulsePts[i].x + jitter, pulsePts[i].y + jitter);
                        }
                        ctx.stroke();

                        ctx.globalCompositeOperation = 'source-over';
                    }
                }
            });

            requestAnimationFrame(draw);
        }

        requestAnimationFrame(draw);
    })();

});

