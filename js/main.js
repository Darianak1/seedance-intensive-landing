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

  // dots: on touch the arrows are hidden, so this is the only signal that
  // there is more than one testimonial
  const dotsWrap = document.getElementById('testimonialsDots');
  const slides = [...track.querySelectorAll('.testimonials-carousel__slide')];
  if (!dotsWrap || slides.length < 2) return;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonials-carousel__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Отзыв ' + (i + 1));
    dot.addEventListener('click', () => {
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  const syncDots = () => {
    // pick the slide whose left edge is closest to the track's scroll position
    let best = 0;
    let bestGap = Infinity;
    slides.forEach((slide, i) => {
      const gap = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (gap < bestGap) { bestGap = gap; best = i; }
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === best);
      dot.setAttribute('aria-selected', String(i === best));
    });
  };

  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(syncDots);
  }, { passive: true });
  syncDots();
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

  const close = () => {
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxImage.src = '';
    lightbox.classList.remove('is-open');
  };

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}

function initLazyPosters() {
  const videos = document.querySelectorAll('video[data-poster]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const video = entry.target;
        video.poster = video.dataset.poster;
        observer.unobserve(video);
      }
    });
  }, { rootMargin: '400px 0px' });
  videos.forEach((video) => observer.observe(video));
}

function initGalleryAutoplay() {
  const videos = document.querySelectorAll('.gallery__item video, .final-cta__video');
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
  const START_DATE = new Date('2026-09-19T10:00:00+03:00');
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
    // nothing will draw them in, so show them as they are
    document.documentElement.classList.remove('js-anim');
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

  // the underline is a background now, so it draws itself in by widening
  // rather than by unrolling a stroke
  document.querySelectorAll('.chalk-underline').forEach((el) => {
    gsap.fromTo(el,
      { backgroundSize: '0% 8px' },
      {
        backgroundSize: '100% 8px',
        // the hero underline draws in slower and a beat after the
        // headline lands, so it reads as a deliberate stroke
        duration: Number(el.dataset.drawDuration) || 1.1,
        delay: Number(el.dataset.drawDelay) || 0,
        ease: 'power1.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
  });

  // the hero ring sweeps in left to right, a beat after the headline
  document.querySelectorAll('.hero__ring-svg').forEach((svg) => {
    gsap.to(svg, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 2.2,
      delay: 0.6,
      ease: 'power1.inOut',
      scrollTrigger: { trigger: svg, start: 'top 85%' },
    });
  });

  document.querySelectorAll('.inside__arrow path, .inside__fork path, .inside__link-arrow path, .program__lead-arrow path, .chalk-circle__svg path').forEach((path) => {
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

}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  document.querySelectorAll('.js-shader-canvas').forEach((canvas) => {
    initShaderBackground(canvas);
  });
  initAccordions('.program-day', '.program-day__toggle');
  initGallery();
  initGalleryAutoplay();
  initLazyPosters();
  initTestimonialsCarousel();
  initAccordions('.faq-item', '.faq-item__toggle');
  initCountdown();
  initScrollAnimations();
});
