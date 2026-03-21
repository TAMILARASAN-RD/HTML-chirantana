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
                    appContainer.classList.add("reveal-ready");
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
                appContainer.classList.add("reveal-ready");
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
        "You have a product",
        "You have ambition",
        "You have campaigns running",
        "But something is not connecting",
        "It is not visibility you lack",
        "It is narrative clarity",
        "Welcome to Chirantana",
        "In Sanskrit, Chirantana means eternal. Timeless. Everlasting",
        "Campaigns come and go",
        "Trends rise and fall",
        "Algorithms change",
        "Stories remain",
        "We do not create content for the moment",
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

                    const totalRange = 0.98; // Lines fill almost the entire scroll track
                    const step = totalRange / narrativeLines.length;
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

                        // Transform curve (Scale)
                        if (Math.abs(dist) < 1.0 * step) {
                            scale = 0.85 + (0.3 * (1 - Math.abs(dist) / step));
                        }

                        if (dist < 0) {
                            y = Math.min(350, Math.max(0, 350 * Math.abs(dist) / step));
                        } else {
                            y = -Math.min(350, Math.max(0, 350 * Math.abs(dist) / step));
                        }

                        // PIN the last line: no fade, no slide, no scale down once reached to keep it bright and centered
                        if (i === narrativeLines.length - 1 && dist > 0) {
                            opacity = 1;
                            scale = 1.15;
                            y = 0;
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

                    // CTA Appears exactly as last lines finish for a truly seamless exit
                    const ctaStart = 0.92; // Delayed slightly so last text is fully readable
                    const ctaEnd = 1.0;
                    if (progress > ctaStart && narrativeCta) {
                        const ctaProgress = Math.min((progress - ctaStart) / (ctaEnd - ctaStart), 1);
                        narrativeCta.style.opacity = ctaProgress.toString();
                        narrativeCta.style.pointerEvents = "auto";
                        narrativeCta.style.transform = `translateY(${(1 - ctaProgress) * 10}px) scale(${0.95 + 0.05 * ctaProgress})`;
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
                    target.classList.remove('opacity-0', 'translate-y-12', 'translate-y-10', 'translate-y-8', 'translate-y-6', 'translate-y-4');
                } else if (target.classList.contains('observe-fade-in-up-stagger')) {
                    target.classList.remove('opacity-0', 'translate-y-12', 'translate-y-10', 'translate-y-8', 'translate-y-6', 'translate-y-4');
                } else if (target.classList.contains('observe-fade-in-right')) {
                    target.classList.remove('opacity-0', 'translate-x-12', 'translate-x-8');
                } else if (target.classList.contains('observe-scale-in')) {
                    target.classList.remove('opacity-0', 'scale-90', 'scale-95');
                } else if (target.classList.contains('observe-split-text')) {
                    const text = target.getAttribute('data-text') || target.innerText;
                    target.innerHTML = '';
                    target.classList.remove('opacity-0');

                    const words = text.trim().split(/\s+/);
                    const allChars = [];

                    words.forEach((word, wIdx) => {
                        const wordSpan = document.createElement("span");
                        wordSpan.style.display = 'inline-block';
                        wordSpan.style.whiteSpace = 'nowrap';

                        word.split('').forEach(char => {
                            const charDiv = document.createElement("div");
                            charDiv.style.position = 'relative';
                            charDiv.style.display = 'inline-block';
                            charDiv.style.opacity = '0';
                            charDiv.style.transform = target.classList.contains('slide-right') ? 'translateX(15px)' : 'translateY(15px)';
                            charDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            charDiv.innerText = char;
                            wordSpan.appendChild(charDiv);
                            allChars.push(charDiv);
                        });

                        target.appendChild(wordSpan);

                        // Add space after word (except last)
                        if (wIdx < words.length - 1) {
                            const space = document.createTextNode(' ');
                            target.appendChild(space);
                        }
                    });

                    allChars.forEach((charDiv, i) => {
                        setTimeout(() => {
                            charDiv.style.opacity = '1';
                            charDiv.style.transform = target.classList.contains('slide-right') ? 'translateX(0px)' : 'translateY(0px)';
                        }, i * 8);
                    });
                }

                obs.unobserve(target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.observe-fade-in-left, .observe-fade-in-left-stagger, .observe-fade-in-up, .observe-fade-in-up-stagger, .observe-fade-in-right, .observe-scale-in, .observe-split-text').forEach(el => {
        // Pre-store text for split/typing animations
        if (el.classList.contains('observe-split-text')) {
            el.setAttribute('data-text', el.innerText);
            el.innerHTML = '&nbsp;';
            el.classList.add('opacity-0');
        }
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

    // ======== Testimonial Vertical Reveal Logic ========
    const revealCards = document.querySelectorAll('.testimonial-reveal-card');
    const dragHandle = document.getElementById('testimonial-drag-handle');
    const totalCards = revealCards.length;
    let testimonialIndex = 0;
    let testimonialTimer;
    let isDragging = false;
    const stripeContainer = document.querySelector('.testimonials-stripe-container .w-5');

    function updateTestimonials(index) {
        revealCards.forEach((card, i) => {
            card.classList.remove('active-card', 'prev-card');
            if (i === index) {
                card.classList.add('active-card');
            } else if (i === (index - 1 + totalCards) % totalCards) {
                card.classList.add('prev-card');
            }
        });

        // Update drag handle position on the vertical stripe
        if (dragHandle && !isDragging) {
            const percentage = (index / (totalCards - 1)) * 100;
            dragHandle.style.top = `${percentage}%`;
        }

        // Trigger Lucide icon refresh
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function handleDrag(e) {
        if (!isDragging || !stripeContainer) return;
        
        const rect = stripeContainer.getBoundingClientRect();
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const y = clientY - rect.top;
        let percentage = (y / rect.height) * 100;
        
        // Constrain percentage between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Directly move for real-time feedback
        dragHandle.style.transition = 'none';
        dragHandle.style.top = `${percentage}%`;

        // Scrutinize Snap Points
        const newIndex = Math.round((percentage / 100) * (totalCards - 1));
        if (newIndex !== testimonialIndex) {
            testimonialIndex = newIndex;
            updateTestimonials(testimonialIndex);
        }
    }

    if (dragHandle) {
        const startDrag = (e) => {
            e.preventDefault(); // Prevent browser drag behavior
            isDragging = true;
            stopTestimonialRotation();
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            // Snapping behavior
            dragHandle.style.transition = 'top 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            const percentage = (testimonialIndex / (totalCards - 1)) * 100;
            dragHandle.style.top = `${percentage}%`;
            
            startTestimonialRotation();

        };

        dragHandle.addEventListener('mousedown', startDrag);
        dragHandle.addEventListener('touchstart', startDrag, { passive: false });
        
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('touchmove', handleDrag, { passive: false });
        
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
    }

    function startTestimonialRotation() {
        stopTestimonialRotation();
        testimonialTimer = setInterval(() => {
            testimonialIndex = (testimonialIndex + 1) % totalCards;
            updateTestimonials(testimonialIndex);
        }, 3000); 
    }

    function stopTestimonialRotation() {
        if (testimonialTimer) {
            clearInterval(testimonialTimer);
        }
    }

    // Direct jump on dot points click
    document.querySelectorAll('.dot-indicator').forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            testimonialIndex = index;
            updateTestimonials(testimonialIndex);
            
            // Re-start timer if not dragging
            if (!isDragging) {
                startTestimonialRotation();
            }
        });
    });

    if (revealCards.length > 0) {
        // Initial state
        updateTestimonials(0);
        startTestimonialRotation();


        
        // Ensure star icons are created initially
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // 12. Custom Cursor with minor delay
    const cursorEl = document.getElementById('custom-cursor');
    if (cursorEl) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let isActive = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isActive) {
                cursorEl.classList.add('cursor-active');
                isActive = true;
                cursorX = mouseX;
                cursorY = mouseY;
            }
        });

        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            // Trailing delay factor
            cursorX += dx * 0.15;
            cursorY += dy * 0.15;

            cursorEl.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        // Interaction States
        const addCursorEvents = () => {
            const targets = document.querySelectorAll('a, button, .cursor-pointer, input, textarea, [role="button"]');
            targets.forEach(target => {
                target.removeEventListener('mouseenter', () => cursorEl.classList.add('cursor-hover'));
                target.removeEventListener('mouseleave', () => cursorEl.classList.remove('cursor-hover'));
                target.addEventListener('mouseenter', () => cursorEl.classList.add('cursor-hover'));
                target.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor-hover'));
            });
        };

        addCursorEvents();
        // Watch for new elements
        new MutationObserver(addCursorEvents).observe(document.body, { childList: true, subtree: true });

        document.addEventListener('mouseleave', () => {
            cursorEl.classList.remove('cursor-active');
            isActive = false;
        });
    }

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
