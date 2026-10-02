(() => {
  'use strict';

  /* ================================
     MENÚ MOBILE
  ================================= */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('active');

      menuToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú' : 'Abrir menú'
      );
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');

        menuToggle.setAttribute(
          'aria-expanded',
          'false'
        );

        menuToggle.setAttribute(
          'aria-label',
          'Abrir menú'
        );
      });
    });
  }


  /* ================================
     GALERÍA DE PROYECTOS
  ================================= */
  const lightbox = document.getElementById('projectLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeButton = document.getElementById('lightboxClose');
  const prevButton = document.getElementById('lightboxPrev');
  const nextButton = document.getElementById('lightboxNext');

  const cards = Array.from(
    document.querySelectorAll('.project-card[data-gallery]')
  );


  if (
    lightbox &&
    lightboxImage &&
    cards.length
  ) {

    let gallery = [];
    let currentIndex = 0;
    let previousBodyOverflow = '';
    let touchStartX = 0;
    let touchStartY = 0;


    function parseGallery(card) {
      return (card.dataset.gallery || '')
        .split('|')
        .map(path => path.trim())
        .filter(Boolean);
    }


    function updateLightbox() {
      const item = gallery[currentIndex];

      if (!item) return;

      lightboxImage.src = item;

      lightboxImage.alt =
        `${lightboxTitle.textContent} — fotografía ${currentIndex + 1}`;

      lightboxCounter.textContent =
        `${currentIndex + 1} / ${gallery.length}`;

      const hasMultiple = gallery.length > 1;

      if (prevButton) {
        prevButton.hidden = !hasMultiple;
      }

      if (nextButton) {
        nextButton.hidden = !hasMultiple;
      }
    }


    function openLightbox(card) {
      gallery = parseGallery(card);

      if (!gallery.length) return;

      currentIndex = 0;

      lightboxTitle.textContent =
        card.dataset.projectTitle || 'Proyecto';

      lightboxCategory.textContent =
        card.dataset.projectCategory ||
        'Proyecto documentado';

      updateLightbox();

      previousBodyOverflow =
        document.body.style.overflow;

      document.body.style.overflow = 'hidden';

      lightbox.classList.add('is-open');

      lightbox.setAttribute(
        'aria-hidden',
        'false'
      );

      closeButton?.focus();
    }


    function closeLightbox() {
      lightbox.classList.remove('is-open');

      lightbox.setAttribute(
        'aria-hidden',
        'true'
      );

      lightboxImage.removeAttribute('src');

      document.body.style.overflow =
        previousBodyOverflow;
    }


    function showPrevious() {
      if (gallery.length < 2) return;

      currentIndex =
        (currentIndex - 1 + gallery.length) %
        gallery.length;

      updateLightbox();
    }


    function showNext() {
      if (gallery.length < 2) return;

      currentIndex =
        (currentIndex + 1) %
        gallery.length;

      updateLightbox();
    }


    cards.forEach(card => {

      card.addEventListener(
        'click',
        () => openLightbox(card)
      );


      card.addEventListener(
        'keydown',
        event => {

          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {

            event.preventDefault();

            openLightbox(card);
          }
        }
      );

    });


    closeButton?.addEventListener(
      'click',
      closeLightbox
    );


    prevButton?.addEventListener(
      'click',
      showPrevious
    );


    nextButton?.addEventListener(
      'click',
      showNext
    );


    lightbox.addEventListener(
      'click',
      event => {

        if (event.target === lightbox) {
          closeLightbox();
        }

      }
    );


    document.addEventListener(
      'keydown',
      event => {

        if (
          !lightbox.classList.contains('is-open')
        ) {
          return;
        }

        if (event.key === 'Escape') {
          closeLightbox();
        }

        if (event.key === 'ArrowLeft') {
          showPrevious();
        }

        if (event.key === 'ArrowRight') {
          showNext();
        }

      }
    );


    lightboxImage.addEventListener(
      'touchstart',
      event => {

        const touch =
          event.changedTouches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

      },
      { passive: true }
    );


    lightboxImage.addEventListener(
      'touchend',
      event => {

        const touch =
          event.changedTouches[0];

        const deltaX =
          touch.clientX - touchStartX;

        const deltaY =
          touch.clientY - touchStartY;

        if (
          Math.abs(deltaX) < 45 ||
          Math.abs(deltaX) < Math.abs(deltaY)
        ) {
          return;
        }

        if (deltaX > 0) {
          showPrevious();
        } else {
          showNext();
        }

      },
      { passive: true }
    );

  }


  /* ================================
     FORMULARIO → WHATSAPP
     Número actual del sitio:
     confirmar antes de publicar.
  ================================= */
  const contactForm =
    document.getElementById('contact-form');

  const whatsappNumber =
    '549346215660262';


  contactForm?.addEventListener(
    'submit',
    event => {

      event.preventDefault();

      const formData =
        new FormData(contactForm);

      const name =
        String(
          formData.get('name') || ''
        ).trim();

      const company =
        String(
          formData.get('company') || ''
        ).trim();

      const phone =
        String(
          formData.get('phone') || ''
        ).trim();

      const email =
        String(
          formData.get('email') || ''
        ).trim();

      const message =
        String(
          formData.get('message') || ''
        ).trim();


      const text = [
        'Hola, quiero consultar por un proyecto con Montajes Cimet.',
        '',
        `Nombre: ${name}`,
        company
          ? `Empresa: ${company}`
          : '',
        phone
          ? `WhatsApp / teléfono: ${phone}`
          : '',
        `Email: ${email}`,
        '',
        `Consulta: ${message}`
      ]
        .filter(Boolean)
        .join('\n');


      const url =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;


      window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      );

    }
  );


  /* ================================
     SCROLL REVEAL — CIMET
     
     UN SOLO SISTEMA DE ANIMACIONES
  ================================= */

  document.addEventListener(
    'DOMContentLoaded',
    () => {

      const revealElements =
        document.querySelectorAll(
          [
            /* Empresa */
            '.company-section .section-intro',
            '.company-image',
            '.company-content',

            /* Qué hacemos */
            '.what-we-do .section-intro',
            '.what-grid article',

            /* Servicios */
            '.services-section .section-intro',
            '.service-item',
            '.capability-group',
            '.capabilities-block',
            '.services-cta',

            /* Statement */
            '.statement-inner',

            /* Sectores */
            '.sectors-section .section-intro',
            '.sectors-grid article',

            /* Proyectos */
            '.projects-section .section-intro',
            '.project-card',

            /* Clientes */
            '.clients-section .section-intro',
            '.client-logo',

            /* Contacto */
            '.contact-intro',
            '.contact-form'
          ].join(', ')
        );


      /*
         Preparar elementos para la animación
      */

      revealElements.forEach(
        (element, index) => {

          element.classList.add(
            'cimet-reveal'
          );


          /*
             Delay escalonado.
             Cada grupo de 4 elementos
             vuelve a comenzar.
          */

          const delay =
            index % 4;


          if (delay === 1) {
            element.classList.add(
              'cimet-reveal-delay-1'
            );
          }


          if (delay === 2) {
            element.classList.add(
              'cimet-reveal-delay-2'
            );
          }


          if (delay === 3) {
            element.classList.add(
              'cimet-reveal-delay-3'
            );
          }

        }
      );


      /*
         Si el navegador no soporta
         IntersectionObserver,
         mostrar todo normalmente.
      */

      if (
        !('IntersectionObserver' in window)
      ) {

        revealElements.forEach(
          element => {
            element.classList.add(
              'is-visible'
            );
          }
        );

        return;
      }


      /*
         Observer único
      */

      const observer =
        new IntersectionObserver(
          (entries, obs) => {

            entries.forEach(
              entry => {

                if (
                  !entry.isIntersecting
                ) {
                  return;
                }


                entry.target.classList.add(
                  'is-visible'
                );


                obs.unobserve(
                  entry.target
                );

              }
            );

          },
          {
            threshold: 0.12,
            rootMargin:
              '0px 0px -60px 0px'
          }
        );


      /*
         Observar todos los elementos
      */

      revealElements.forEach(
        element => {
          observer.observe(element);
        }
      );

    }
  );

})();