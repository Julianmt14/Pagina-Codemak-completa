// ========== CODEMAK - JavaScript Principal ==========

document.addEventListener('DOMContentLoaded', () => {

    // ===== EFECTO DE DESPLAZAMIENTO DE LA BARRA DE NAVEGACIÓN =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        lastScroll = currentScroll;
    });

    // ===== MENÚ MÓVIL DE NAVEGACIÓN =====
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.classList.toggle('hamburger-active');
    });

    // Cierra el menú móvil al hacer clic en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.classList.remove('hamburger-active');
        });
    });

    // ===== ENLACE ACTIVO AL DESPLAZARSE =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ===== DESPLAZAMIENTO SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== ANIMACIONES DE DESPLAZAMIENTO (Intersection Observer) =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Escalonar la animación para elementos hermanos
                const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                let delay = 0;

                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) {
                        delay = i * 100;
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ===== ANIMACIÓN DEL CONTADOR =====
    const statValues = document.querySelectorAll('[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                let current = 0;
                const increment = target / 60;
                const duration = 2000;
                const stepTime = duration / 60;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = Math.floor(current) + suffix;
                }, stepTime);

                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => {
        counterObserver.observe(stat);
    });

    // ===== EFECTO PARALLAX EN LA SECCIÓN HERO =====
    const heroSection = document.getElementById('inicio');
    const heroImg = heroSection ? heroSection.querySelector('img') : null;

    if (heroImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
            }
        });
    }

    // ===== CARRUSEL DE PROYECTOS =====
    const track = document.getElementById('carousel-track');
    const slides = track ? track.querySelectorAll('.carousel-slide') : [];
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let slidesPerView = window.innerWidth >= 768 ? 2 : 1;
        let maxIndex = Math.max(0, slides.length - slidesPerView);

        // Crear puntos de navegación
        function createDots() {
            dotsContainer.innerHTML = '';
            const totalDots = maxIndex + 1;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.setAttribute('aria-label', `Ir al proyecto ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        // Actualizar posición del carrusel usando medidas reales de los slides
        function updateCarousel() {
            if (slides.length === 0) return;
            // Calcular el ancho real de un slide
            const slideElement = slides[0];
            const slideWidth = slideElement.getBoundingClientRect().width;
            const offset = currentIndex * slideWidth;
            track.style.transform = `translateX(-${offset}px)`;

            // Actualizar estado de los puntos
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            // Actualizar estado de las flechas
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            updateCarousel();
        }

        function nextSlide() {
            if (currentIndex < maxIndex) {
                goToSlide(currentIndex + 1);
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            }
        }

        // Detectores de eventos
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Soporte para gestos táctiles y deslizamiento
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });

        // Manejar redimensionamiento de ventana
        window.addEventListener('resize', () => {
            const newSlidesPerView = window.innerWidth >= 768 ? 2 : 1;
            if (newSlidesPerView !== slidesPerView) {
                slidesPerView = newSlidesPerView;
                maxIndex = Math.max(0, slides.length - slidesPerView);
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                createDots();
            }
            updateCarousel();
        });

        // Inicializar
        createDots();
        updateCarousel();
    }

    // ===== AVISO DE COOKIES =====
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Verificar si ya se aceptaron las cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            // Mostrar después de 1 segundo
            setTimeout(() => {
                cookieBanner.classList.remove('translate-y-full');
            }, 1000);
        }

        // Manejar el clic en "Aceptar"
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            // Ocultar animando hacia abajo
            cookieBanner.classList.add('translate-y-full');
        });
    }

});
