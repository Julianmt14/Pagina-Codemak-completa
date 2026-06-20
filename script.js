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

    // ===== MODAL DE PQR (PETICIONES, QUEJAS, RECLAMOS Y SUGERENCIAS) =====
    const modalPqr = document.getElementById('modal-pqr');
    const modalContent = modalPqr ? modalPqr.querySelector('.modal-content') : null;
    const btnAbrirPqr = document.getElementById('btn-abrir-pqr');
    const btnCerrarModalPqr = document.getElementById('btn-cerrar-modal-pqr');
    const btnCancelarHabeas = document.getElementById('btn-cancelar-habeas');
    const btnVolverHabeas = document.getElementById('btn-volver-habeas');
    const btnContinuarFormulario = document.getElementById('btn-continuar-formulario');
    const checkHabeas = document.getElementById('check-habeas');
    const pqrStepHabeas = document.getElementById('pqr-step-habeas');
    const formPqrBody = document.getElementById('form-pqr-body');
    const pqrStepSuccess = document.getElementById('pqr-step-success');
    const pqrRadicadoNumero = document.getElementById('pqr-radicado-numero');
    const btnCopiarRadicado = document.getElementById('btn-copiar-radicado');
    const btnPqrMailto = document.getElementById('btn-pqr-mailto');
    const btnCerrarPqrExito = document.getElementById('btn-cerrar-pqr-exito');

    function abrirPqrModal() {
        if (!modalPqr) return;
        
        // Reset de pasos
        pqrStepHabeas.classList.remove('hidden');
        formPqrBody.classList.add('hidden');
        pqrStepSuccess.classList.add('hidden');
        
        // Reset Habeas Data
        checkHabeas.checked = false;
        btnContinuarFormulario.disabled = true;
        btnContinuarFormulario.classList.remove('bg-primary', 'hover:bg-primary-dark', 'cursor-pointer');
        btnContinuarFormulario.classList.add('bg-gray-400', 'cursor-not-allowed');
        
        // Reset campos formulario
        formPqrBody.reset();
        
        // Mostrar modal
        modalPqr.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    function cerrarPqrModal() {
        if (!modalPqr) return;
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modalPqr.classList.add('hidden');
        }, 300);
    }

    if (btnAbrirPqr) btnAbrirPqr.addEventListener('click', abrirPqrModal);
    if (btnCerrarModalPqr) btnCerrarModalPqr.addEventListener('click', cerrarPqrModal);
    if (btnCancelarHabeas) btnCancelarHabeas.addEventListener('click', cerrarPqrModal);
    if (btnCerrarPqrExito) btnCerrarPqrExito.addEventListener('click', cerrarPqrModal);

    // Habilitar / Deshabilitar boton continuar en Habeas Data
    if (checkHabeas) {
        checkHabeas.addEventListener('change', () => {
            if (checkHabeas.checked) {
                btnContinuarFormulario.disabled = false;
                btnContinuarFormulario.classList.remove('bg-gray-400', 'cursor-not-allowed');
                btnContinuarFormulario.classList.add('bg-primary', 'hover:bg-primary-dark', 'cursor-pointer');
            } else {
                btnContinuarFormulario.disabled = true;
                btnContinuarFormulario.classList.remove('bg-primary', 'hover:bg-primary-dark', 'cursor-pointer');
                btnContinuarFormulario.classList.add('bg-gray-400', 'cursor-not-allowed');
            }
        });
    }

    // Ir de Habeas Data a Formulario
    if (btnContinuarFormulario) {
        btnContinuarFormulario.addEventListener('click', () => {
            pqrStepHabeas.classList.add('hidden');
            formPqrBody.classList.remove('hidden');
        });
    }

    // Volver de Formulario a Habeas Data
    if (btnVolverHabeas) {
        btnVolverHabeas.addEventListener('click', () => {
            formPqrBody.classList.add('hidden');
            pqrStepHabeas.classList.remove('hidden');
        });
    }

    // Envío del Formulario PQR
    if (formPqrBody) {
        formPqrBody.addEventListener('submit', (e) => {
            e.preventDefault();

            // Generar radicado
            const hoy = new Date();
            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0');
            const dd = String(hoy.getDate()).padStart(2, '0');
            const random = Math.floor(1000 + Math.random() * 9000);
            const radicado = `CDK-PQR-${yyyy}${mm}${dd}-${random}`;

            // Obtener valores del formulario
            const nombre = document.getElementById('pqr-nombre').value;
            const documento = document.getElementById('pqr-documento').value;
            const vinculo = document.getElementById('pqr-vinculo').value;
            const telefono = document.getElementById('pqr-telefono').value;
            const correo = document.getElementById('pqr-correo').value;
            const tipo = document.getElementById('pqr-tipo').value;
            const descripcion = document.getElementById('pqr-descripcion').value;
            const confidencial = document.querySelector('input[name="pqr-confidencial"]:checked').value;
            const respuesta = document.querySelector('input[name="pqr-respuesta"]:checked').value;

            // Mostrar radicado en el modal
            if (pqrRadicadoNumero) {
                pqrRadicadoNumero.textContent = radicado;
            }

            // Crear el cuerpo del correo en texto plano pre-formateado
            const emailBody = `RADICACIÓN FORMAL DE PQR - CODEMAK S.A.S.
--------------------------------------------------
Radicado No: ${radicado}
Fecha de Envío: ${dd}/${mm}/${yyyy}

1. DATOS DEL SOLICITANTE:
- Nombre: ${nombre}
- Documento de identidad: ${documento}
- Cargo o vínculo con la empresa: ${vinculo}
- Teléfono de contacto: ${telefono}
- Correo electrónico: ${correo}

2. DETALLES DE LA SOLICITUD:
- Tipo de solicitud: ${tipo}
- Descripción de los hechos:
${descripcion}

3. CONFIDENCIALIDAD Y RESPUESTA:
- Mantener identidad confidencial ante terceros: ${confidencial}
- Medio de respuesta formal deseado: ${respuesta}

--------------------------------------------------
Esta solicitud fue radicada de manera conforme por el sitio web oficial de CODEMAK.
El solicitante ha autorizadode manera expresa el tratamiento de sus datos personales bajo la Ley 1581 de 2012 (Habeas Data).`;

            // Configurar el mailto
            const mailtoUrl = `mailto:coordinadorarhcodemak@gmail.com?subject=${encodeURIComponent(`Radicación de PQR - ${radicado} [${nombre}]`)}&body=${encodeURIComponent(emailBody)}`;
            if (btnPqrMailto) {
                btnPqrMailto.setAttribute('href', mailtoUrl);
            }

            // Guardar en localStorage para respaldo/auditoría del usuario
            const pqrsGuardadas = JSON.parse(localStorage.getItem('codemak_pqrs') || '[]');
            pqrsGuardadas.push({
                radicado,
                fecha: `${dd}/${mm}/${yyyy}`,
                nombre,
                documento,
                vinculo,
                telefono,
                correo,
                tipo,
                descripcion,
                confidencial,
                respuesta
            });
            localStorage.setItem('codemak_pqrs', JSON.stringify(pqrsGuardadas));

            // Transición a la pantalla de éxito
            formPqrBody.classList.add('hidden');
            pqrStepSuccess.classList.remove('hidden');
        });
    }

    // Copiar radicado al portapapeles
    if (btnCopiarRadicado) {
        btnCopiarRadicado.addEventListener('click', () => {
            const numero = pqrRadicadoNumero ? pqrRadicadoNumero.textContent : '';
            if (numero) {
                navigator.clipboard.writeText(numero).then(() => {
                    // Feedback visual en el botón
                    const originalIconHtml = btnCopiarRadicado.innerHTML;
                    btnCopiarRadicado.innerHTML = `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>`;
                    btnCopiarRadicado.classList.add('bg-green-50', 'border-green-300');
                    setTimeout(() => {
                        btnCopiarRadicado.innerHTML = originalIconHtml;
                        btnCopiarRadicado.classList.remove('bg-green-50', 'border-green-300');
                    }, 2000);
                });
            }
        });
    }

    // Revelar "Cerrar Ventana" solo después de pulsar "Enviar por Correo Formal"
    if (btnPqrMailto) {
        btnPqrMailto.addEventListener('click', () => {
            // Ocultar el aviso amarillo
            const avisoCorreo = document.getElementById('pqr-aviso-correo');
            if (avisoCorreo) avisoCorreo.classList.add('hidden');

            // Mostrar botón de cerrar
            if (btnCerrarPqrExito) {
                btnCerrarPqrExito.classList.remove('hidden');
            }

            // Cambiar el texto y estilo del botón de correo para indicar que ya se hizo
            btnPqrMailto.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Correo Preparado ✓
            `;
            btnPqrMailto.classList.remove('bg-primary', 'hover:bg-primary-dark');
            btnPqrMailto.classList.add('bg-green-600', 'hover:bg-green-700');
        });
    }

});

