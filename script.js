document.addEventListener('DOMContentLoaded', () => {
    const cursorGlow = document.querySelector('.cursor-glow');
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let isMoving = false;
    let moveTimeout;

    function updateCursorGlow() {
        const ease = 0.15;
        glowX += (mouseX - glowX) * ease;
        glowY += (mouseY - glowY) * ease;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        
        requestAnimationFrame(updateCursorGlow);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorGlow.style.opacity = '1';
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            cursorGlow.style.opacity = '0';
        }, 2000);
    });

    const snowLayer = document.querySelector('.snow-layer');
    const createSnowflakes = () => {
        if (!snowLayer) return;
        const flakeCount = 80;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < flakeCount; i++) {
            const flake = document.createElement('span');
            flake.className = 'snowflake';
            const size = (Math.random() * 3) + 2;
            const duration = (Math.random() * 10) + 10;
            const delay = Math.random() * 10;
            const drift = (Math.random() - 0.5) * 60;
            const opacity = Math.random() * 0.6 + 0.3;
            const blur = Math.random() * 2;
            const scale = Math.random() * 0.6 + 0.7;

            flake.style.left = `${Math.random() * 100}%`;
            flake.style.setProperty('--size', `${size}px`);
            flake.style.setProperty('--duration', `${duration}s`);
            flake.style.setProperty('--delay', `${delay}s`);
            flake.style.setProperty('--drift', `${drift}px`);
            flake.style.setProperty('--opacity', opacity.toString());
            flake.style.setProperty('--blur', `${blur}px`);
            flake.style.setProperty('--scale', scale.toString());
            fragment.appendChild(flake);
        }
        snowLayer.appendChild(fragment);
    };

    createSnowflakes();

    const magneticButtons = Array.from(document.querySelectorAll('.magnetic-btn')).filter(button => !button.closest('.nav'));
    const maxTranslate = 16;
    const maxRotate = 4;
    const ease = 0.15;
    const epsilon = 0.1;

    magneticButtons.forEach(button => {
        let rafId;
        let targetX = 0;
        let targetY = 0;
        let targetRotate = 0;
        let currentX = 0;
        let currentY = 0;
        let currentRotate = 0;

        const applyTransform = () => {
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;
            currentRotate += (targetRotate - currentRotate) * ease;

            button.style.setProperty('--magnetic-translate-x', `${currentX}px`);
            button.style.setProperty('--magnetic-translate-y', `${currentY}px`);
            button.style.setProperty('--magnetic-rotation', `${currentRotate}deg`);

            const remainingDistance = Math.abs(currentX - targetX) + Math.abs(currentY - targetY) + Math.abs(currentRotate - targetRotate);
            if (remainingDistance > epsilon) {
                rafId = requestAnimationFrame(applyTransform);
            } else {
                rafId = null;
            }
        };

        const requestTransform = () => {
            if (!rafId) {
                rafId = requestAnimationFrame(applyTransform);
            }
        };

        const setTargetFromEvent = (event) => {
            const rect = button.getBoundingClientRect();
            const relativeX = event.clientX - rect.left;
            const relativeY = event.clientY - rect.top;
            const offsetX = (relativeX - rect.width / 2) / (rect.width / 2);
            const offsetY = (relativeY - rect.height / 2) / (rect.height / 2);

            targetX = Math.max(Math.min(offsetX * maxTranslate, maxTranslate), -maxTranslate);
            targetY = Math.max(Math.min(offsetY * maxTranslate, maxTranslate), -maxTranslate);
            targetRotate = (targetX / maxTranslate) * maxRotate;
            requestTransform();
        };

        const resetTransform = () => {
            targetX = 0;
            targetY = 0;
            targetRotate = 0;
            requestTransform();
        };

        button.addEventListener('mousemove', setTargetFromEvent);
        button.addEventListener('mouseleave', resetTransform);
        button.addEventListener('blur', resetTransform);
    });

    updateCursorGlow();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = index * 100;
                setTimeout(() => {
                    card.classList.add('visible');
                }, delay);
                observer.unobserve(card);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });

    const underlineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const underline = entry.target;
                underline.classList.add('animated');
                underlineObserver.unobserve(underline);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.underline-text').forEach(underline => {
        underlineObserver.observe(underline);
    });

    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const btnText = button.querySelector('.btn-text');
            const btnIcon = button.querySelector('.btn-icon');
            
            btnText.style.transform = 'translateX(-8px)';
            btnIcon.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            const btnText = button.querySelector('.btn-text');
            const btnIcon = button.querySelector('.btn-icon');
            
            btnText.style.transform = 'translateX(0)';
            btnIcon.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const product = button.dataset.product;
            const originalText = button.querySelector('.btn-text').textContent;
            
            button.querySelector('.btn-text').textContent = 'System Ready';
            button.style.cursor = 'wait';
            
            setTimeout(() => {
                button.querySelector('.btn-text').textContent = 'Downloading...';
            }, 500);
            
            setTimeout(() => {
                button.querySelector('.btn-text').textContent = originalText;
                button.style.cursor = 'pointer';
            }, 2000);
        });
    });

    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.letterSpacing = '0.07em';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.letterSpacing = '0.02em';
        });
    });

    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
    });

    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');

    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                faqObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    faqItems.forEach((item, index) => {
        item.style.setProperty('--faq-delay', `${index * 80}ms`);
        faqObserver.observe(item);
    });

    const collapseAll = () => {
        faqItems.forEach(item => {
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            answer.style.height = '0px';
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
    };

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');

            collapseAll();

            if (!isActive) {
                faqItem.classList.add('active');
                const scrollHeight = answer.scrollHeight;
                answer.style.height = `${scrollHeight}px`;
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    const heroLines = document.querySelectorAll('.hero-line');
    heroLines.forEach((line, index) => {
        line.style.animationDelay = `${0.1 + (index * 0.1)}s`;
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
            nav.style.boxShadow = '0 15px 40px rgba(0,0,0,0.6)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.85)';
            nav.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
        }
    });
});
