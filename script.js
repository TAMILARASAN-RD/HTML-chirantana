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

                    // CTA Appears exactly as last lines finish for a truly seamless exit
                    const ctaStart = 0.88; 
                    const ctaEnd = 1.0;   
                    if (progress > ctaStart && narrativeCta) {
                        const ctaProgress = Math.min((progress - ctaStart) / (ctaEnd - ctaStart), 1);
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

    // ======== Testimonial Slider Logic (Infinite Circular Drag) ========
    const track = document.getElementById('testimonial-track');
    
    if (track) {
        const originalCards = Array.from(track.querySelectorAll('.testimonial-card'));
        const totalOriginals = originalCards.length;
        
        // Clone for infinite effect (2 at start, 2 at end)
        function createClone(card) {
            const clone = card.cloneNode(true);
            // Reset any elements that might have already been animated
            clone.querySelectorAll('.observe-split-text').forEach(el => {
                const originalText = el.getAttribute('data-text') || el.innerText;
                el.innerHTML = originalText; // Restore original text for the observer to process
                el.setAttribute('data-text', originalText);
                el.classList.add('opacity-0');
            });
            return clone;
        }

        const clonesStart = originalCards.slice(-2).map(c => createClone(c));
        const clonesEnd = originalCards.slice(0, 2).map(c => createClone(c));
        
        clonesStart.reverse().forEach(clone => {
            track.insertBefore(clone, track.firstChild);
            clone.querySelectorAll('.observe-split-text').forEach(el => {
                observer.observe(el);
            });
        });
        clonesEnd.forEach(clone => {
            track.appendChild(clone);
            clone.querySelectorAll('.observe-split-text').forEach(el => {
                observer.observe(el);
            });
        });

        const intervalTime = 5000;
        let isDragging = false;
        let startX, scrollLeft;
        let autoPlayTimer;

        // Positioning for the first real card
        const cardGap = 24; 
        const getCardWidth = () => originalCards[0].offsetWidth + cardGap;
        
        const initSlider = () => {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = getCardWidth() * 2;
        };
        
        window.addEventListener('load', initSlider);
        window.addEventListener('resize', initSlider);

        // Infinite Boundary Check
        function checkBounds() {
            const width = getCardWidth();
            const currentScroll = track.scrollLeft;
            
            if (currentScroll >= width * (totalOriginals + 2)) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = width * 2;
            } else if (currentScroll <= width * 0.5) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = width * totalOriginals;
            }
        }

        // Snapping logic
        function snapToCard() {
            const width = getCardWidth();
            const index = Math.round(track.scrollLeft / width);
            track.style.scrollBehavior = 'smooth';
            track.scrollLeft = index * width;
            
            // Re-sync after animation
            setTimeout(checkBounds, 600);
        }

        // Mouse Dragging
        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            track.classList.add('grabbing');
            track.style.scrollBehavior = 'auto'; // Immediate response during drag
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            clearInterval(autoPlayTimer);
        });

        const handleStop = () => {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('grabbing');
            snapToCard();
            startAutoPlay();
        };

        track.addEventListener('mouseleave', handleStop);
        track.addEventListener('mouseup', handleStop);

        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5; // Drag sensitivity
            track.scrollLeft = scrollLeft - walk;
        });

        // Autoplay
        function startAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                checkBounds();
                setTimeout(() => {
                    track.style.scrollBehavior = 'smooth';
                    track.scrollLeft += getCardWidth();
                    // Optional: re-check after smooth scroll to handle end transition
                    setTimeout(checkBounds, 600);
                }, 50);
            }, intervalTime);
        }

        startAutoPlay();
        
        // Touch support
        track.addEventListener('touchstart', (e) => {
            clearInterval(autoPlayTimer);
            isDragging = true;
            startX = e.touches[0].pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            track.style.scrollBehavior = 'auto';
        }, {passive: true});

        track.addEventListener('touchend', handleStop);

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            track.scrollLeft = scrollLeft - walk;
        }, {passive: true});
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
