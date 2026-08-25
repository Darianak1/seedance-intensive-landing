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
      lightboxVideo.play();
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
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.5 });
  videos.forEach((video) => observer.observe(video));
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
});
