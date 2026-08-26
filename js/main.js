function initHeaderScroll() {
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initAccordions(itemSelector, toggleSelector) {
  document.querySelectorAll(itemSelector).forEach((item) => {
    const toggle = item.querySelector(toggleSelector);
    toggle.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', String(!isOpen));
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const prevBtn = document.querySelector('.testimonials-carousel__btn--prev');
  const nextBtn = document.querySelector('.testimonials-carousel__btn--next');
  const scrollBySlide = (dir) => {
    const slide = track.querySelector('.testimonials-carousel__slide');
    if (!slide) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: dir * (slide.offsetWidth + gap), behavior: 'smooth' });
  };
  prevBtn.addEventListener('click', () => scrollBySlide(-1));
  nextBtn.addEventListener('click', () => scrollBySlide(1));
}

function initGallery() {
  const lightbox = document.getElementById('lightbox');
  const lightboxVideo = lightbox.querySelector('.lightbox__video');
  const lightboxImage = lightbox.querySelector('.lightbox__image');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  document.querySelectorAll('.gallery__item').forEach((item) => {
    item.addEventListener('click', () => {
      lightboxImage.style.display = 'none';
      lightboxImage.src = '';
      lightboxVideo.style.display = 'block';
      lightboxVideo.src = item.dataset.video;
      lightbox.classList.add('is-open');
      lightboxVideo.play().catch(() => {});
    });
  });

  document.querySelectorAll('.speaker__photo-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      lightboxVideo.pause();
      lightboxVideo.style.display = 'none';
      lightboxVideo.src = '';
      lightboxImage.style.display = 'block';
      lightboxImage.src = btn.dataset.image;
      lightbox.classList.add('is-open');
    });
  });

  closeBtn.addEventListener('click', () => {
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxImage.src = '';
    lightbox.classList.remove('is-open');
  });
}

function initGalleryAutoplay() {
  const videos = document.querySelectorAll('.gallery__item video');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.5 });
  videos.forEach((video) => observer.observe(video));
}

function initCountdown() {
  const START_DATE = new Date('2026-09-17T10:00:00+03:00');
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  function tick() {
    const { days, hours, minutes, seconds } = getTimeRemaining(START_DATE);
    countdownEl.querySelector('[data-unit="days"]').textContent = String(days).padStart(2, '0');
    countdownEl.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2, '0');
    countdownEl.querySelector('[data-unit="minutes"]').textContent = String(minutes).padStart(2, '0');
    countdownEl.querySelector('[data-unit="seconds"]').textContent = String(seconds).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

function initScrollAnimations() {
  const skipAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof gsap === 'undefined';
  if (skipAnimations) {
    document.querySelectorAll('[data-count-to]').forEach((el) => {
      el.textContent = Number(el.dataset.countTo).toLocaleString('ru-RU');
    });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('section').forEach((section) => {
    const targets = section.querySelectorAll('.card, .section-title, .hero__title, .hero__subtitle, .hero__cta');
    if (!targets.length) return;
    gsap.from(targets, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });
  });

  document.querySelectorAll('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo);
    gsap.to(el, {
      textContent: target,
      duration: 1.5,
      snap: { textContent: 1 },
      onUpdate: function () {
        el.textContent = Math.floor(Number(el.textContent)).toLocaleString('ru-RU');
      },
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  document.querySelectorAll('.trust__stat-circle path, .chalk-underline__svg path').forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: 'power1.inOut',
      scrollTrigger: { trigger: path, start: 'top 85%' },
    });
  });

  gsap.from('.trust__note', {
    opacity: 0,
    scale: 0.7,
    duration: 0.5,
    delay: 0.9,
    scrollTrigger: { trigger: '.trust__note', start: 'top 90%' },
  });

  gsap.from('.trust__stamp', {
    opacity: 0,
    scale: 2.4,
    rotation: 25,
    duration: 0.5,
    ease: 'back.out(2.5)',
    scrollTrigger: { trigger: '.trust__claim', start: 'top 75%' },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  document.querySelectorAll('.js-shader-canvas').forEach((canvas) => {
    initShaderBackground(canvas);
  });
  initAccordions('.program-day', '.program-day__toggle');
  initGallery();
  initGalleryAutoplay();
  initTestimonialsCarousel();
  initAccordions('.faq-item', '.faq-item__toggle');
  initCountdown();
  initScrollAnimations();
});
