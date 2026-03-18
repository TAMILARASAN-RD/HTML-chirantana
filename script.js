// Main JavaScript file to handle interactions, state, and animations
document.addEventListener("DOMContentLoaded", () => {
    // 1. Loading Sequence
    const loadingSequence = document.getElementById("loading-sequence");
    const cameraContainer = document.getElementById("camera-container");
    const loadingFlash = document.getElementById("loading-flash");
    const appContainer = document.getElementById("app");

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    if (loadingSequence) {
        setTimeout(() => {
            // Shutter animation with huge haptic vibration
            cameraContainer.classList.add("animate-camera-shutter");

            setTimeout(() => {
                // Trigger flash fill that covers screen
                loadingFlash.style.opacity = "1";
                loadingFlash.classList.add("animate-flash-fill");

                setTimeout(() => {
                    // Hide camera once screen is fully flashed
                    cameraContainer.style.opacity = "0";
                    loadingSequence.style.backgroundColor = "transparent";
                }, 300);

                setTimeout(() => {
                    // Reveal app as flash fades out
                    loadingSequence.style.display = "none";
                    appContainer.classList.remove("opacity-0");
                    document.body.style.overflow = '';
                }, 1200);
            }, 150);
        }, 100);
    } else {
        // If there's no loading sequence (like on sub-pages), unlock scroll immediately
        document.body.style.overflow = '';
        if (appContainer) {
            
            // tiny delay to ensure CSS transition triggers properly on non-home pages
            setTimeout(() => {
               appContainer.classList.remove("opacity-0");
            }, 50);
        }
    }

    // 2. Navbar Scroll
    const navbar = document.getElementById("navbar");
    // Ensure navbar is always dark
    if (navbar) {
        navbar.classList.add("bg-brand-black/90", "backdrop-blur-md", "py-4", "shadow-sm", "shadow-white/5");
        navbar.classList.remove("bg-transparent", "py-6");
        
        window.addEventListener("scroll", () => {
            // Keep it simple, just enforce the dark state if needed, but it shouldn't revert
        });
    }

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenuClose = document.getElementById("mobile-menu-close");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (mobileMenuBtn && mobileMenu) {
        const openMobileMenu = () => {
            mobileMenu.classList.remove("opacity-0", "pointer-events-none");
        };

        const closeMobileMenu = () => {
            mobileMenu.classList.add("opacity-0", "pointer-events-none");
        };

        mobileMenuBtn.addEventListener("click", openMobileMenu);
        mobileMenuClose.addEventListener("click", closeMobileMenu);
        mobileLinks.forEach(link => link.addEventListener("click", closeMobileMenu));
    }

    // 4. IntroNarrative Scroll Animation
    const narrativeSection = document.getElementById("about");
    const narrativeContainer = document.getElementById("narrative-container");
    const narrativeIndicators = document.getElementById("narrative-indicators");
    const narrativeCta = document.getElementById("narrative-cta");
    
    const narrativeLines = [
      "You have a product.",
      "You have ambition.",
      "You have campaigns running.",
      "But something is not connecting.",
      "It is not visibility you lack.",
      "It is narrative clarity.",
      "Welcome to Chirantana.",
      "In Sanskrit, Chirantana means eternal. Timeless. Everlasting.",
      "Campaigns come and go.",
      "Trends rise and fall.",
      "Algorithms change.",
      "Stories remain.",
      "We do not create content for the moment.",
      "We build stories that become identity."
    ];

    if (narrativeSection && narrativeContainer) {
        // Generate Lines
        narrativeLines.forEach((line, i) => {
            const isSpecial = line.includes("Chirantana") || line.includes("identity") || line.includes("Stories remain");
            
            const div = document.createElement("div");
            div.className = "narrative-line absolute inset-0 flex items-center justify-center p-4 text-center pointer-events-none opacity-0 translate-y-[350px] scale-90 will-change-transform";
            div.innerHTML = `<p class="text-3xl md:text-5xl lg:text-7xl font-serif leading-tight ${isSpecial ? 'text-brand-red italic' : 'text-white'}">${line}</p>`;
            narrativeContainer.appendChild(div);

            if (narrativeIndicators) {
                const ind = document.createElement("div");
                ind.className = "narrative-indicator w-1 h-1 rounded-full bg-white/10 will-change-transform";
                narrativeIndicators.appendChild(ind);
            }
        });

        const linesDOM = document.querySelectorAll(".narrative-line");
        const indicatorsDOM = document.querySelectorAll(".narrative-indicator");

        let ticking = false;
        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = narrativeSection.getBoundingClientRect();
                    // scroll progress between 0 and 1
                    // Improved calculation for sticky section progress
                    const totalScrollable = rect.height - window.innerHeight;
                    const currentScroll = -rect.top;
                    const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
                    
                    const step = 1 / narrativeLines.length;
                    const activeIndex = Math.min(Math.floor(progress / step), narrativeLines.length - 1);
                    
                    linesDOM.forEach((line, i) => {
                        const center = (i + 0.5) * step;
                        let opacity = 0;
                        let scale = 0.85;
                        let y = 350;

                        const dist = progress - center;

                        // Opacity curve
                        if (Math.abs(dist) < 1.0 * step) {
                            opacity = 1 - Math.abs(dist) / (1.0 * step);
                        }

                        // Transform curve
                        if (Math.abs(dist) < 1.0 * step) {
                            scale = 0.85 + (0.3 * (1 - Math.abs(dist) / step));
                        }

                        if (dist < 0) {
                            y = Math.min(350, Math.max(0, 350 * Math.abs(dist) / step));
                        } else {
                            y = -Math.min(350, Math.max(0, 350 * Math.abs(dist) / step));
                        }

                        line.style.opacity = Math.max(0, opacity);
                        line.style.transform = `translateY(${y}px) scale(${scale})`;

                        // Indicator
                        if (indicatorsDOM[i]) {
                            const isActive = (i === activeIndex);
                            indicatorsDOM[i].style.height = isActive ? '24px' : '4px';
                            indicatorsDOM[i].style.backgroundColor = isActive ? 'rgba(237,33,39,1)' : 'rgba(255,255,255,0.1)';
                            indicatorsDOM[i].style.borderRadius = isActive ? '2px' : '50%';
                            indicatorsDOM[i].style.transition = 'all 0.3s ease';
                        }
                    });

                    // CTA Appears earlier and marks the end of narrative logic
                    const ctaThreshold = 0.92; 
                    if (progress > ctaThreshold && narrativeCta) {
                        const ctaProgress = (progress - ctaThreshold) / (1 - ctaThreshold);
                        narrativeCta.style.opacity = ctaProgress.toString();
                        narrativeCta.style.pointerEvents = "auto";
                        narrativeCta.style.transform = `translateY(${(1 - ctaProgress) * 20}px) scale(${0.9 + 0.1 * ctaProgress})`;
                    } else if (narrativeCta) {
                        narrativeCta.style.opacity = "0";
                        narrativeCta.style.pointerEvents = "none";
                        narrativeCta.style.transform = "translateY(20px) scale(0.9)";
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 5. Intersection Observer for Fade-ins
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                if (target.classList.contains('observe-fade-in-left')) {
                    target.classList.remove('opacity-0', '-translate-x-12', 'translate-x-8');
                } else if (target.classList.contains('observe-fade-in-left-stagger')) {
                    target.classList.remove('opacity-0', '-translate-x-4', 'translate-x-8');
                } else if (target.classList.contains('observe-fade-in-up')) {
                    target.classList.remove('opacity-0', 'translate-y-8');
                } else if (target.classList.contains('observe-fade-in-up-stagger')) {
                    target.classList.remove('opacity-0', 'translate-y-10');
                } else if (target.classList.contains('observe-scale-in')) {
                    target.classList.remove('opacity-0', 'scale-90', 'scale-95');
                }
                
                obs.unobserve(target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.observe-fade-in-left, .observe-fade-in-left-stagger, .observe-fade-in-up, .observe-fade-in-up-stagger, .observe-scale-in').forEach(el => {
        observer.observe(el);
    });

    // ======== Portfolio Filtering Logic ========
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            // Toggle active state on buttons
            filterButtons.forEach(b => {
                b.classList.remove('border-brand-red', 'text-brand-black');
                b.classList.add('border-transparent', 'text-black/40');
            });
            btn.classList.add('border-brand-red', 'text-brand-black');
            btn.classList.remove('border-transparent', 'text-black/40');

            // Filter items calculation
            portfolioItems.forEach(item => {
                // simple hiding - could be improved with animate out/in
                if (category === 'All' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => { item.style.display = 'none'; }, 300); // Wait for transition
                }
            });
        });
    });

    // ======== FAQ Accordion Logic ========
    const faqButtons = document.querySelectorAll('.faq-btn');
    
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');
            
            // Close all others
            faqButtons.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    const otherContent = otherBtn.nextElementSibling;
                    const otherIcon = otherBtn.querySelector('.faq-icon');
                    
                    otherContent.style.height = '0px';
                    otherContent.style.opacity = '0';
                    setTimeout(() => {
                        if (otherBtn.getAttribute('aria-expanded') === 'false') { // Double check
                            otherIcon.setAttribute('data-lucide', 'plus');
                            otherIcon.classList.remove('text-brand-red');
                            otherIcon.classList.add('text-black/50');
                            lucide.createIcons();
                        }
                    }, 300);
                }
            });

            // Toggle current
            if (isExpanded) {
                btn.setAttribute('aria-expanded', 'false');
                content.style.height = '0px';
                content.style.opacity = '0';
                setTimeout(() => {
                    icon.setAttribute('data-lucide', 'plus');
                    icon.classList.remove('text-brand-red');
                    icon.classList.add('text-black/50');
                    lucide.createIcons();
                }, 300);
            } else {
                btn.setAttribute('aria-expanded', 'true');
                // Temporarily set height to auto to get scrollHeight
                content.style.height = 'auto';
                const height = content.scrollHeight + 'px';
                content.style.height = '0px'; // Reset instantly
                // Force layout reflow
                content.offsetHeight;
                
                content.style.height = height;
                content.style.opacity = '1';
                
                icon.setAttribute('data-lucide', 'minus');
                icon.classList.add('text-brand-red');
                icon.classList.remove('text-black/50');
                lucide.createIcons();

                // reset auto height after transition
                setTimeout(() => {
                    if (btn.getAttribute('aria-expanded') === 'true') {
                        content.style.height = 'auto';
                    }
                }, 300);
            }
        });
    });

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
