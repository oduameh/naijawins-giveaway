/**
 * NaijaWins - Giveaway Landing Page JavaScript
 * Handles form submission, FAQ interactions, and dynamic elements
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    
    const CONFIG = {
        // Google Sheets via Apps Script
        formEndpoint: 'https://script.google.com/macros/s/AKfycbyMrZJzxW0ipDIHEqa8YgVoH2mdZfkY9UEuoTKNP6AN5-oto77_mmdZefMq72qUCQTrlQ/exec',
        
        // Redirect after successful submission
        successRedirect: 'success.html',
        
        // Enable/disable email validation on frontend
        validateEmail: true,
        
        // Simulated entry count (starts here, increments randomly)
        baseEntryCount: 2847,
        
        // Days until draw (countdown)
        drawDayOfWeek: 0 // 0 = Sunday
    };

    // ============================================
    // DOM Elements
    // ============================================
    
    const elements = {
        form: document.getElementById('giveaway-form'),
        submitBtn: document.getElementById('submit-btn'),
        emailInput: document.getElementById('email'),
        nameInput: document.getElementById('name'),
        termsCheckbox: document.getElementById('terms'),
        newsletterCheckbox: document.getElementById('newsletter'),
        entriesCount: document.getElementById('entries-count'),
        countdownDays: document.getElementById('countdown-days'),
        faqItems: document.querySelectorAll('.faq-item')
    };

    // ============================================
    // Toast Notification System
    // ============================================
    
    function showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Show toast
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ============================================
    // Email Validation
    // ============================================
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ============================================
    // Form Submission
    // ============================================
    
    async function handleFormSubmit(event) {
        event.preventDefault();

        const email = elements.emailInput?.value.trim();
        const name = elements.nameInput?.value.trim() || '';
        const termsAccepted = elements.termsCheckbox?.checked;
        const newsletter = elements.newsletterCheckbox?.checked || false;

        // Validation
        if (!email) {
            showToast('Please enter your email address', 'error');
            elements.emailInput?.focus();
            return;
        }

        if (CONFIG.validateEmail && !isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            elements.emailInput?.focus();
            return;
        }

        if (!termsAccepted) {
            showToast('Please agree to the Terms and Privacy Policy', 'error');
            return;
        }

        // Set loading state
        if (elements.submitBtn) {
            elements.submitBtn.classList.add('loading');
            elements.submitBtn.disabled = true;
        }

        try {
            // Prepare form data
            const formData = {
                email: email,
                name: name,
                newsletter: newsletter,
                timestamp: new Date().toISOString(),
                source: window.location.href,
                referrer: document.referrer || 'direct'
            };

            // Check if using a real endpoint or demo mode
            if (CONFIG.formEndpoint.includes('YOUR_FORM_ID') || 
                CONFIG.formEndpoint.includes('YOUR_SCRIPT_ID')) {
                // Demo mode - simulate success
                console.log('Demo mode - Form data:', formData);
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Store in localStorage for demo
                const entries = JSON.parse(localStorage.getItem('giveaway_entries') || '[]');
                entries.push(formData);
                localStorage.setItem('giveaway_entries', JSON.stringify(entries));
                
                // Redirect to success page
                window.location.href = CONFIG.successRedirect;
                return;
            }

            // Real submission
            const response = await fetch(CONFIG.formEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Store entry confirmation
                localStorage.setItem('giveaway_entered', 'true');
                localStorage.setItem('giveaway_email', email);
                
                // Redirect to success page
                window.location.href = CONFIG.successRedirect;
            } else {
                throw new Error('Submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Something went wrong. Please try again.', 'error');
            
            if (elements.submitBtn) {
                elements.submitBtn.classList.remove('loading');
                elements.submitBtn.disabled = false;
            }
        }
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    
    function initFAQ() {
        elements.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    // Close other items
                    elements.faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('open')) {
                            otherItem.classList.remove('open');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('open');
                });
            }
        });
    }

    // ============================================
    // Dynamic Entry Counter
    // ============================================
    
    function initEntryCounter() {
        if (!elements.entriesCount) return;

        // Get stored count or use base
        let count = parseInt(localStorage.getItem('entry_count')) || CONFIG.baseEntryCount;
        
        // Increment by random amount (simulating new entries)
        const randomIncrement = Math.floor(Math.random() * 15) + 5;
        count += randomIncrement;
        
        // Store new count
        localStorage.setItem('entry_count', count.toString());
        
        // Animate counter
        animateCounter(elements.entriesCount, count);
        
        // Periodically increment (every 30-60 seconds)
        setInterval(() => {
            count += Math.floor(Math.random() * 3) + 1;
            localStorage.setItem('entry_count', count.toString());
            elements.entriesCount.textContent = count.toLocaleString();
        }, Math.random() * 30000 + 30000);
    }

    function animateCounter(element, target) {
        const duration = 1500;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ============================================
    // Countdown Timer
    // ============================================
    
    function initCountdown() {
        if (!elements.countdownDays) return;

        function updateCountdown() {
            const now = new Date();
            const dayOfWeek = now.getDay();
            
            // Calculate days until Sunday (draw day)
            let daysUntilDraw = (CONFIG.drawDayOfWeek - dayOfWeek + 7) % 7;
            if (daysUntilDraw === 0) {
                // If it's Sunday, show 7 (next Sunday)
                const currentHour = now.getHours();
                if (currentHour >= 18) {
                    daysUntilDraw = 7;
                }
            }
            
            elements.countdownDays.textContent = daysUntilDraw || 7;
        }

        updateCountdown();
        // Update every hour
        setInterval(updateCountdown, 3600000);
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // Page Load Animations
    // ============================================
    
    function initAnimations() {
        // Add staggered fade-in to elements
        const animatedElements = document.querySelectorAll('.step-card, .winner-card, .trust-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // ============================================
    // Check for Returning Visitors
    // ============================================
    
    function checkReturningVisitor() {
        const hasEntered = localStorage.getItem('giveaway_entered');
        const enteredEmail = localStorage.getItem('giveaway_email');
        
        if (hasEntered && enteredEmail && elements.form) {
            // Show message for returning visitors
            const message = document.createElement('div');
            message.className = 'returning-visitor-notice';
            message.innerHTML = `
                <p style="background: rgba(0, 168, 89, 0.1); color: var(--color-primary); 
                   padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; 
                   font-size: 0.875rem; text-align: center;">
                    ✅ You've already entered with <strong>${enteredEmail}</strong>. 
                    Good luck in the draw!
                </p>
            `;
            elements.form.parentNode.insertBefore(message, elements.form);
        }
    }

    // ============================================
    // UTM Parameter Tracking
    // ============================================
    
    function trackUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = {};
        
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                utmParams[param] = value;
            }
        });

        if (Object.keys(utmParams).length > 0) {
            sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
        }
    }

    // ============================================
    // Initialize Everything
    // ============================================
    
    function init() {
        // Form submission
        if (elements.form) {
            elements.form.addEventListener('submit', handleFormSubmit);
        }

        // Initialize components
        initFAQ();
        initEntryCounter();
        initCountdown();
        initSmoothScroll();
        initAnimations();
        checkReturningVisitor();
        trackUTMParams();

        // Log page view (for debugging)
        console.log('NaijaWins Giveaway Page Loaded');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

