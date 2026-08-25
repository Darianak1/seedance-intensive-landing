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

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  document.querySelectorAll('.js-shader-canvas').forEach((canvas) => {
    initShaderBackground(canvas);
  });
  initAccordions('.program-day', '.program-day__toggle');
});
