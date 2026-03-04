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
    
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        const faqObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    faqObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        faqObserver.observe(item);
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            faqQuestions.forEach(q => {
                q.closest('.faq-item').classList.remove('active');
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
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
