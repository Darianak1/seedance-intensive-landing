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

function initGallery() {
  const items = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxVideo = lightbox.querySelector('.lightbox__video');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      lightboxVideo.src = item.dataset.video;
      lightbox.classList.add('is-open');
      lightboxVideo.play().catch(() => {});
    });
  });

  closeBtn.addEventListener('click', () => {
    lightboxVideo.pause();
    lightboxVideo.src = '';
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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined') return;
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

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: '+=100%',
    pin: '.hero__content',
    pinSpacing: false,
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
  initAccordions('.faq-item', '.faq-item__toggle');
  initCountdown();
  initScrollAnimations();
});
