# Лендинг интенсива Seedance 2.5 (CreAIte) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page static landing site for the CreAIte "Seedance 2.5" 7-day intensive, in the approved black/acid-lime chalkboard visual style, with GSAP scroll animations, a monochrome WebGL background shader, and video sections ready to receive real Seedance clips.

**Architecture:** One `index.html` with all sections, one `css/style.css`, and three small vanilla-JS files (`js/countdown.js` for pure date math, `js/shader-bg.js` for the WebGL background, `js/main.js` for everything else — nav, accordions, gallery/lightbox, GSAP wiring). No build step, no bundler, no framework. GSAP + ScrollTrigger load from CDN.

**Tech Stack:** Static HTML/CSS/JS, GSAP 3.12.5 + ScrollTrigger (cdnjs CDN), Google Fonts (Unbounded, Golos Text, Caveat, JetBrains Mono), vanilla WebGL (no Three.js), Node.js built-in test runner (`node:test`) for the one pure-logic unit (dev-time only, not shipped).

**Spec:** `docs/superpowers/specs/2026-08-25-seedance-intensive-landing-design.md`

## Global Constraints

- No build step, no bundler, no npm dependencies shipped to the browser — only `<script>`/`<link>` tags.
- External hosts allowed: `cdnjs.cloudflare.com` (GSAP + ScrollTrigger only) and `fonts.googleapis.com`/`fonts.gstatic.com` (Google Fonts only). No other CDNs.
- Color tokens are exact: `--bg: #000000`, `--acid: #D7FF28`. Never substitute approximate values.
- Fonts: `Unbounded` (700/800) for all headings, `Golos Text` for body copy, `Caveat` for `.chalk-note` accents, `JetBrains Mono` for `.meta` corner labels.
- `prefers-reduced-motion: reduce` must disable the WebGL shader (skip init entirely) and skip GSAP ScrollTrigger animation registration.
- Every `<video>` must have a `poster` attribute and must not break layout if its `src` 404s.
- Placeholder content uses fixed, greppable markers so the user can find/replace them later: video paths under `assets/video/...`, CTA links `href="#cta-placeholder"`, testimonial text exactly `«Заглушка: замените реальным отзывом ученика.»`.
- Node.js 18+ is required only to run the countdown unit tests during development; it is never referenced by the shipped site.

---

## File Structure

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── countdown.js     — pure getTimeRemaining() date math, dual Node/browser export
│   ├── shader-bg.js     — vanilla WebGL monochrome noise background
│   └── main.js          — nav scroll state, accordions, gallery/lightbox, countdown DOM wiring, GSAP init
├── tests/
│   └── countdown.test.js
└── assets/
    ├── video/           — placeholders; user supplies real Seedance clips later
    └── img/             — favicon, og-image, poster images, speaker photo (placeholders)
```

---

### Task 1: Project scaffold, design tokens, header/footer shell

**Files:**
- Create: `index.html`
- Create: `css/style.css`

**Interfaces:**
- Produces: CSS custom properties `--bg`, `--bg-alt`, `--white`, `--acid`, `--border`, `--border-acid`, `--card-bg`, `--card-bg-acid`, `--font-display`, `--font-body`, `--font-chalk`, `--font-mono`; classes `.container`, `.card`, `.card--accent`, `.meta`/`.meta--tl`/`.meta--tr`/`.meta--bl`/`.meta--br`, `.chalk-note`, `.chalk-doodle`, `.btn`/`.btn-cta`, `.site-header`/`.is-scrolled`, `.site-header__nav`; SVG filter `#chalkRough`; `<main>` container that later tasks append sections into (in document order: hero, trust, program, gallery, speaker, pricing, testimonials, faq, final-cta); script tags for GSAP CDN + `js/countdown.js` + `js/shader-bg.js` + `js/main.js` (in that load order, at the end of `<body>`).

- [ ] **Step 1: Write `index.html`**

```html
<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Интенсив по Seedance 2.5 — CreAIte</title>
<meta name="description" content="7-дневный интенсив по AI-генерации видео в Seedance 2.5 от школы CreAIte. Реальный проект для ОККО.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Golos+Text:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Unbounded:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="chalkRough" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="2" seed="7" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>

<header class="site-header" id="site-header">
  <div class="container site-header__inner">
    <a href="#hero" class="site-header__logo">CreAIte</a>
    <nav class="site-header__nav">
      <a href="#program">Программа</a>
      <a href="#gallery">Галерея</a>
      <a href="#speaker">Спикер</a>
      <a href="#pricing">Цены</a>
      <a href="#testimonials">Отзывы</a>
      <a href="#faq">FAQ</a>
    </nav>
    <a href="#cta-placeholder" class="btn btn-cta">Записаться</a>
  </div>
</header>

<main>
  <!-- секции добавляются в задачах 3, 5-9 -->
</main>

<footer class="site-footer" id="site-footer">
  <div class="container site-footer__inner">
    <span class="site-footer__logo">CreAIte</span>
    <p class="meta">© 2026 CreAIte. Школа Эраджа Нидоева.</p>
    <div class="site-footer__socials">
      <a href="#cta-placeholder">Telegram</a>
      <a href="#cta-placeholder">Instagram</a>
    </div>
  </div>
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="js/countdown.js"></script>
<script src="js/shader-bg.js"></script>
<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `css/style.css`**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

:root {
  --bg: #000000;
  --bg-alt: #111111;
  --white: #ffffff;
  --acid: #D7FF28;
  --border: rgba(255, 255, 255, 0.28);
  --border-acid: rgba(215, 255, 40, 0.5);
  --card-bg: rgba(255, 255, 255, 0.04);
  --card-bg-acid: rgba(215, 255, 40, 0.08);
  --font-display: 'Unbounded', sans-serif;
  --font-body: 'Golos Text', sans-serif;
  --font-chalk: 'Caveat', cursive;
  --font-mono: 'JetBrains Mono', monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--white);
  font-family: var(--font-body);
  line-height: 1.5;
}

h1, h2, h3 { font-family: var(--font-display); font-weight: 800; line-height: 1.1; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.section-title { font-size: clamp(2rem, 4vw, 3rem); margin: 16px 0 40px; }

.card {
  border: 1px solid var(--border);
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  position: relative;
}
.card--accent { border-color: var(--border-acid); background: var(--card-bg-acid); }

.meta {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.6;
}
.meta--tl { position: absolute; top: 12px; left: 12px; }
.meta--tr { position: absolute; top: 12px; right: 12px; }
.meta--bl { position: absolute; bottom: 12px; left: 12px; }
.meta--br { position: absolute; bottom: 12px; right: 12px; }

.chalk-note {
  font-family: var(--font-chalk);
  color: var(--acid);
  font-size: 1.75rem;
  display: inline-block;
  transform: rotate(-2deg);
}

.chalk-doodle { filter: url(#chalkRough); }

.btn {
  display: inline-block;
  font-family: var(--font-body);
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.2s ease;
  border: none;
  cursor: pointer;
}
.btn-cta { background: var(--acid); color: #000; }
.btn-cta:hover { transform: scale(1.05); }

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 20px 0;
  transition: padding 0.3s ease, background 0.3s ease;
}
.site-header.is-scrolled {
  padding: 12px 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.site-header__inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.site-header__logo { font-family: var(--font-display); font-weight: 800; color: var(--white); text-decoration: none; font-size: 1.25rem; }
.site-header__nav { display: flex; gap: 24px; }
.site-header__nav a { color: var(--white); text-decoration: none; opacity: 0.8; }
.site-header__nav a:hover { opacity: 1; color: var(--acid); }

.site-footer { border-top: 1px solid var(--border); padding: 40px 0; margin-top: 80px; }
.site-footer__inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.site-footer__socials { display: flex; gap: 16px; }
.site-footer__socials a { color: var(--white); opacity: 0.7; text-decoration: none; }

@media (max-width: 768px) {
  .site-header__nav { display: none; }
}
```

- [ ] **Step 3: Manual verification**

Run: open `index.html` in a browser (double-click it, or run `explorer.exe index.html` from the project root in a Windows terminal).
Expected:
- Page background is solid black.
- Header shows "CreAIte" logo in the bold geometric Unbounded font, nav links, and a lime "Записаться" pill button.
- Open DevTools → Elements → select the `.btn-cta` element → confirm computed `background-color` is `rgb(215, 255, 40)`.
- Resize below 768px width → nav links disappear, logo and CTA button remain.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: scaffold page shell with design tokens"
```

---

### Task 2: Countdown date-math module with unit tests

**Files:**
- Create: `js/countdown.js`
- Test: `tests/countdown.test.js`

**Interfaces:**
- Produces: `getTimeRemaining(targetDate: Date, now?: Date): { days: number, hours: number, minutes: number, seconds: number, isPast: boolean }`. Exposed as `window.getTimeRemaining` in the browser (plain `<script>`, no modules) and as `module.exports.getTimeRemaining` under Node.

- [ ] **Step 1: Write the failing test**

```js
// tests/countdown.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { getTimeRemaining } = require('../js/countdown.js');

test('returns full breakdown for exactly 2 days ahead', () => {
  const now = new Date('2026-09-15T10:00:00Z');
  const target = new Date('2026-09-17T10:00:00Z');
  const result = getTimeRemaining(target, now);
  assert.deepEqual(result, { days: 2, hours: 0, minutes: 0, seconds: 0, isPast: false });
});

test('accounts for hours, minutes and seconds separately', () => {
  const now = new Date('2026-09-17T07:58:30Z');
  const target = new Date('2026-09-17T10:00:00Z');
  const result = getTimeRemaining(target, now);
  assert.deepEqual(result, { days: 0, hours: 2, minutes: 1, seconds: 30, isPast: false });
});

test('marks past dates as isPast with zeroed fields', () => {
  const now = new Date('2026-09-18T00:00:00Z');
  const target = new Date('2026-09-17T10:00:00Z');
  const result = getTimeRemaining(target, now);
  assert.deepEqual(result, { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/countdown.test.js`
Expected: FAIL — `Cannot find module '../js/countdown.js'`

- [ ] **Step 3: Write minimal implementation**

```js
// js/countdown.js
function getTimeRemaining(targetDate, now = new Date()) {
  const diffMs = targetDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, isPast: false };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getTimeRemaining };
} else {
  window.getTimeRemaining = getTimeRemaining;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/countdown.test.js`
Expected: PASS — 3 tests, 0 failures

- [ ] **Step 5: Commit**

```bash
git add js/countdown.js tests/countdown.test.js
git commit -m "feat: add countdown date-math module with unit tests"
```

---

### Task 3: Hero section + sticky header scroll behavior

**Files:**
- Modify: `index.html` — replace the `<!-- секции добавляются в задачах 3, 5-9 -->` comment inside `<main>` with the hero section (leave the comment in place, immediately after the new `<section>`, for later tasks to anchor on)
- Modify: `css/style.css` — append hero styles
- Create: `js/main.js`

**Interfaces:**
- Consumes: `.container`, `.btn-cta`, `.meta`, `.chalk-note`, `#site-header` from Task 1.
- Produces: `initHeaderScroll()` function and a `DOMContentLoaded` listener in `js/main.js` that later tasks add more `init...()` calls into; canvas element with class `.js-shader-canvas` inside `.hero` that Task 4 initializes.

- [ ] **Step 1: Insert hero markup into `index.html`**

Replace:
```html
<main>
  <!-- секции добавляются в задачах 3, 5-9 -->
</main>
```
with:
```html
<main>
  <section class="hero" id="hero">
    <video class="hero__video" autoplay muted loop playsinline poster="assets/img/hero-poster.jpg">
      <source src="assets/video/hero.mp4" type="video/mp4">
    </video>
    <canvas class="hero__shader js-shader-canvas" aria-hidden="true"></canvas>
    <div class="hero__overlay"></div>
    <div class="container hero__content">
      <p class="meta meta--tl">CreAIte × Seedance 2.5</p>
      <h1 class="hero__title">Сними кино с&nbsp;помощью ИИ<br>за&nbsp;<span class="hero__title-accent">7 дней</span></h1>
      <p class="hero__subtitle">Интенсив на реальном проекте для ОККО. От промпта до готового ролика — под руководством Эраджа Нидоева.</p>
      <a href="#cta-placeholder" class="btn btn-cta hero__cta">Записаться на интенсив</a>
      <p class="meta meta--br">Скролль вниз ↓</p>
    </div>
  </section>
  <!-- секции добавляются в задачах 3, 5-9 -->
</main>
```

- [ ] **Step 2: Append hero styles to `css/style.css`**

```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.hero__shader {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  mix-blend-mode: screen;
  opacity: 0.5;
}
.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%);
}
.hero__content { position: relative; z-index: 3; padding-bottom: 80px; width: 100%; }
.hero__title { font-size: clamp(2.5rem, 6vw, 5rem); margin-bottom: 24px; }
.hero__title-accent { color: var(--acid); }
.hero__subtitle { font-size: 1.25rem; max-width: 560px; margin-bottom: 32px; opacity: 0.9; }
```

- [ ] **Step 3: Create `js/main.js` with header scroll behavior**

```js
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
});
```

- [ ] **Step 4: Manual verification**

Run: open `index.html` in a browser.
Expected:
- Full-viewport hero with black gradient overlay, headline "Сними кино с помощью ИИ за 7 дней" (7 дней in lime), subtitle, CTA button.
- Video element shows the black `poster` background (no `assets/img/hero-poster.jpg` file yet is fine — browser shows a blank video area without breaking layout).
- Scroll down 40px+ → header gains a translucent blurred background (`.is-scrolled`); scroll back to top → it clears.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add hero section and sticky header scroll state"
```

---

### Task 4: WebGL monochrome shader background

**Files:**
- Create: `js/shader-bg.js`
- Modify: `js/main.js` — register shader init inside the existing `DOMContentLoaded` listener

**Interfaces:**
- Consumes: any `<canvas class="js-shader-canvas">` element (Task 3's hero canvas now, Task 9's final-cta canvas later).
- Produces: `initShaderBackground(canvas: HTMLCanvasElement): void`, exposed as `window.initShaderBackground` when loaded via plain `<script>`.

- [ ] **Step 1: Write `js/shader-bg.js`**

```js
function initShaderBackground(canvas) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const vertexSrc = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentSrc = `
    precision mediump float;
    uniform vec2 uResolution;
    uniform float uTime;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec2 grain = uv * uResolution.xy * 0.6;
      float n = random(grain + floor(uTime * 8.0));
      float dust = smoothstep(0.965, 1.0, n);
      float spark = smoothstep(0.997, 1.0, n) * 0.6;
      vec3 color = vec3(dust) + vec3(0.843, 1.0, 0.157) * spark;
      gl_FragColor = vec4(color, dust * 0.5 + spark);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSrc);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  const resolutionLoc = gl.getUniformLocation(program, 'uResolution');
  const timeLoc = gl.getUniformLocation(program, 'uTime');

  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function render(time) {
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, time * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
```

- [ ] **Step 2: Add the CDN script tag order dependency check**

Confirm `index.html` `<body>` end already loads scripts in this order (from Task 1): GSAP → ScrollTrigger → `countdown.js` → `shader-bg.js` → `main.js`. No change needed if Task 1 was followed exactly — this step is just a verification read of `index.html`.

- [ ] **Step 3: Register shader init in `js/main.js`**

Modify the `DOMContentLoaded` listener from:
```js
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
});
```
to:
```js
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  document.querySelectorAll('.js-shader-canvas').forEach((canvas) => {
    initShaderBackground(canvas);
  });
});
```

- [ ] **Step 4: Manual verification**

Run: open `index.html` in a browser.
Expected:
- Behind the hero video, a faint animated black-and-white grain/noise texture is visible with occasional lime sparks (visible mainly where the video is dark).
- Open DevTools → Rendering tab → set "Emulate CSS media feature `prefers-reduced-motion`" to `reduce`, reload the page → the canvas stays blank (no animation, no console errors).

- [ ] **Step 5: Commit**

```bash
git add js/shader-bg.js js/main.js
git commit -m "feat: add monochrome WebGL shader background"
```

---

### Task 5: Trust badge + Program (7-day accordion) section

**Files:**
- Modify: `index.html` — insert trust + program sections after `</section>` closing the hero, before the `<!-- секции добавляются в задачах 3, 5-9 -->` comment
- Modify: `css/style.css` — append trust/program/accordion styles
- Modify: `js/main.js` — add generic `initAccordions()` helper and register it for `.program-day`

**Interfaces:**
- Consumes: `.card`, `.card--accent`, `.meta`, `.section-title` from Task 1.
- Produces: `initAccordions(itemSelector, toggleSelector)` reusable helper (Task 8's FAQ reuses this — do not write a second accordion implementation); `[data-count-to]` numeric spans (`.trust__stat-value`) that Task 10's counter animation targets.

- [ ] **Step 1: Insert trust + program markup into `index.html`**

Insert immediately after the hero `</section>` (before the `<!-- секции добавляются... -->` comment):
```html
  <section class="trust" id="trust">
    <div class="container trust__inner">
      <div class="card card--accent trust__claim">
        <p class="meta meta--tl">Кейс</p>
        <p class="trust__text">Работаем над <strong>реальным проектом для ОККО</strong> — не учебная задача, а ролик, который увидят зрители.</p>
      </div>
      <div class="trust__stats">
        <div class="trust__stat">
          <span class="trust__stat-value" data-count-to="7">0</span>
          <span class="trust__stat-label">дней</span>
        </div>
        <div class="trust__stat">
          <span class="trust__stat-value" data-count-to="1">0</span>
          <span class="trust__stat-label">реальный проект</span>
        </div>
      </div>
    </div>
  </section>

  <section class="program" id="program">
    <div class="container">
      <p class="meta meta--tl">Программа</p>
      <h2 class="section-title">7 дней <span class="chalk-note">от идеи до готового ролика</span></h2>
      <div class="program__timeline">
        <article class="program-day card" data-open="false">
          <button class="program-day__toggle" aria-expanded="false">
            <span class="program-day__number">День 1</span>
            <span class="program-day__label">Пайплайн и старт проекта</span>
          </button>
          <div class="program-day__content">
            <p>Понимание пайплайна, возможностей нейросети, экономики проекта. Начало работы над проектом: распределение по командам, анализ сценария и брифа, подбор референсов.</p>
          </div>
        </article>
        <article class="program-day card" data-open="false">
          <button class="program-day__toggle" aria-expanded="false">
            <span class="program-day__number">День 2</span>
            <span class="program-day__label">Персонаж, мир и text-to-video</span>
          </button>
          <div class="program-day__content">
            <p>Создание персонажа и мира, генерация персонажа в образе, локации, подходы к формату. Создание промпта для видео в формате text-to-video. Практика: создание кадров в формате text-to-video.</p>
          </div>
        </article>
        <article class="program-day card" data-open="false">
          <button class="program-day__toggle" aria-expanded="false">
            <span class="program-day__number">День 3</span>
            <span class="program-day__label">Photo-to-video и ключевые кадры</span>
          </button>
          <div class="program-day__content">
            <p>Разбор ошибок и недостатков формата text-to-video. Формат photo-to-video и работа с ключевыми кадрами. Практика: создание видеокадров по ключевым кадрам.</p>
          </div>
        </article>
        <article class="program-day card" data-open="false">
          <button class="program-day__toggle" aria-expanded="false">
            <span class="program-day__number">День 4</span>
            <span class="program-day__label">Video-to-video и motion control</span>
          </button>
          <div class="program-day__content">
            <p>Формат video-to-video, редактура видео, motion control. Практика: генерация и отбор видеокадров.</p>
          </div>
        </article>
        <article class="program-day card" data-open="false">
          <button class="program-day__toggle" aria-expanded="false">
            <span class="program-day__number">День 5</span>
            <span class="program-day__label">Пост-продакшн и монтаж</span>
          </button>
          <div class="program-day__content">
            <p>Пост-продакшн теория. Звук: музыка и озвучка. Монтаж и понимание темпо-ритма. Практика: монтаж видео, понимание, какие кадры не работают и как их заменить.</p>
          </div>
        </article>
        <article class="program-day card" data-open="false">
          <button class="program-day__toggle" aria-expanded="false">
            <span class="program-day__number">День 6</span>
            <span class="program-day__label">Обратная связь от Эраджа</span>
          </button>
          <div class="program-day__content">
            <p>Финальная обратная связь от Эраджа, доработка роликов.</p>
          </div>
        </article>
        <article class="program-day card" data-open="false">
          <button class="program-day__toggle" aria-expanded="false">
            <span class="program-day__number">День 7</span>
            <span class="program-day__label">Обратная связь от экспертов</span>
          </button>
          <div class="program-day__content">
            <p>Обратная связь от экспертов.</p>
          </div>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Append trust/program/accordion styles to `css/style.css`**

```css
.trust__inner { display: flex; flex-wrap: wrap; gap: 32px; align-items: center; justify-content: space-between; padding: 60px 24px; }
.trust__claim { flex: 1 1 320px; }
.trust__text { padding-top: 8px; }
.trust__stats { display: flex; gap: 32px; }
.trust__stat { text-align: center; }
.trust__stat-value { display: block; font-family: var(--font-display); font-size: 2rem; color: var(--acid); }
.trust__stat-label { font-size: 0.85rem; opacity: 0.7; }

.program { padding: 80px 0; }
.program__timeline { display: flex; flex-direction: column; gap: 16px; }
.program-day__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  background: none;
  border: none;
  color: var(--white);
  font-family: var(--font-display);
  font-size: 1.1rem;
  text-align: left;
  cursor: pointer;
  padding: 0;
}
.program-day__number { color: var(--acid); }
.program-day__content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.program-day[data-open="true"] .program-day__content { max-height: 300px; padding-top: 16px; }
```

- [ ] **Step 3: Add generic accordion helper to `js/main.js`**

Add this function above `document.addEventListener('DOMContentLoaded', ...)`:
```js
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
```
Then update the `DOMContentLoaded` listener to:
```js
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  document.querySelectorAll('.js-shader-canvas').forEach((canvas) => {
    initShaderBackground(canvas);
  });
  initAccordions('.program-day', '.program-day__toggle');
});
```

- [ ] **Step 4: Manual verification**

Run: open `index.html` in a browser.
Expected:
- Trust badge shows the ОККО claim in a lime-bordered card, plus "7 дней" / "1 реальный проект" stats (still showing "0" — Task 10 wires the count-up animation).
- Program section lists all 7 days; clicking a day's button expands its content with a smooth height transition and sets `aria-expanded="true"`; clicking again collapses it.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add trust badge and 7-day program accordion"
```

---

### Task 6: Gallery grid + lightbox

**Files:**
- Modify: `index.html` — insert gallery section after the program section; add lightbox markup just before the closing `</body>` script tags
- Modify: `css/style.css` — append gallery/lightbox styles
- Modify: `js/main.js` — add `initGallery()` and `initGalleryAutoplay()`, register both

**Interfaces:**
- Consumes: nothing new from earlier tasks besides shared tokens.
- Produces: `#lightbox` element and `initGallery()`/`initGalleryAutoplay()` — self-contained, no later task depends on these directly.

- [ ] **Step 1: Insert gallery markup into `index.html`**

Insert after the program section's closing `</section>`:
```html
  <section class="gallery" id="gallery">
    <div class="container">
      <p class="meta meta--tl">Галерея</p>
      <h2 class="section-title">Что можно снять за <span class="hero__title-accent">7 дней</span></h2>
      <div class="gallery__grid">
        <button class="gallery__item" data-video="assets/video/gallery-1.mp4">
          <video muted loop playsinline poster="assets/img/gallery-1-poster.jpg">
            <source src="assets/video/gallery-1.mp4" type="video/mp4">
          </video>
        </button>
        <button class="gallery__item" data-video="assets/video/gallery-2.mp4">
          <video muted loop playsinline poster="assets/img/gallery-2-poster.jpg">
            <source src="assets/video/gallery-2.mp4" type="video/mp4">
          </video>
        </button>
        <button class="gallery__item" data-video="assets/video/gallery-3.mp4">
          <video muted loop playsinline poster="assets/img/gallery-3-poster.jpg">
            <source src="assets/video/gallery-3.mp4" type="video/mp4">
          </video>
        </button>
        <button class="gallery__item" data-video="assets/video/gallery-4.mp4">
          <video muted loop playsinline poster="assets/img/gallery-4-poster.jpg">
            <source src="assets/video/gallery-4.mp4" type="video/mp4">
          </video>
        </button>
      </div>
    </div>
  </section>
```

Insert the lightbox markup immediately before the GSAP `<script>` tags at the end of `<body>`:
```html
<div class="lightbox" id="lightbox">
  <button class="lightbox__close" aria-label="Закрыть">&times;</button>
  <video class="lightbox__video" controls playsinline></video>
</div>
```

- [ ] **Step 2: Append gallery/lightbox styles to `css/style.css`**

```css
.gallery { padding: 80px 0; }
.gallery__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.gallery__item {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  background: none;
  cursor: pointer;
  aspect-ratio: 16 / 9;
}
.gallery__item video { width: 100%; height: 100%; object-fit: cover; }
@media (min-width: 768px) {
  .gallery__grid { grid-template-columns: repeat(4, 1fr); }
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}
.lightbox.is-open { opacity: 1; visibility: visible; }
.lightbox__video { max-width: 90vw; max-height: 85vh; transform: scale(0.9); transition: transform 0.3s ease; }
.lightbox.is-open .lightbox__video { transform: scale(1); }
.lightbox__close { position: absolute; top: 24px; right: 24px; background: none; border: none; color: var(--white); font-size: 2rem; cursor: pointer; }
```

- [ ] **Step 3: Add gallery/lightbox JS to `js/main.js`**

Add above `document.addEventListener('DOMContentLoaded', ...)`:
```js
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
```
Update the `DOMContentLoaded` listener to:
```js
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  document.querySelectorAll('.js-shader-canvas').forEach((canvas) => {
    initShaderBackground(canvas);
  });
  initAccordions('.program-day', '.program-day__toggle');
  initGallery();
  initGalleryAutoplay();
});
```

- [ ] **Step 4: Manual verification**

Run: open `index.html` in a browser.
Expected:
- 4-column grid (2-column below 768px) of video tiles.
- Scrolling a tile into view (more than half visible) starts its muted preview playing; scrolling it out pauses it.
- Clicking a tile opens a centered lightbox with a fade+scale transition and playable video controls; clicking the × closes it and stops playback.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add video gallery grid with lightbox"
```

---

### Task 7: Speaker + Pricing sections

**Files:**
- Modify: `index.html` — insert speaker + pricing sections after the gallery section
- Modify: `css/style.css` — append speaker/pricing styles

**Interfaces:**
- Produces: `.pricing__price-value[data-count-to="28000"]` span that Task 10's counter animation targets.

- [ ] **Step 1: Insert speaker + pricing markup into `index.html`**

Insert after the gallery section's closing `</section>`:
```html
  <section class="speaker" id="speaker">
    <div class="container speaker__inner">
      <img class="speaker__photo" src="assets/img/eradj-nidoev.jpg" alt="Эрадж Нидоев">
      <div class="speaker__info card">
        <p class="meta meta--tl">Спикер</p>
        <h2 class="section-title">Эрадж Нидоев</h2>
        <p>Основатель школы AI-видео CreAIte. Ведёт интенсив лично — от постановки задачи до финальной обратной связи по каждому ролику.</p>
      </div>
    </div>
  </section>

  <section class="pricing" id="pricing">
    <div class="container">
      <p class="meta meta--tl">Стоимость</p>
      <div class="pricing__card card card--accent">
        <p class="pricing__price"><span class="pricing__price-value" data-count-to="28000">0</span> ₽</p>
        <p class="pricing__note">Доступна рассрочка</p>
        <ul class="pricing__features">
          <li>7 дней практики на реальном проекте для ОККО</li>
          <li>Личная обратная связь от Эраджа Нидоева</li>
          <li>Разбор от экспертов в финале</li>
          <li>Готовый ролик в портфолио</li>
        </ul>
        <a href="#cta-placeholder" class="btn btn-cta">Записаться на интенсив</a>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Append speaker/pricing styles to `css/style.css`**

```css
.speaker { padding: 80px 0; }
.speaker__inner { display: grid; grid-template-columns: 200px 1fr; gap: 32px; align-items: center; }
.speaker__photo { width: 100%; border-radius: 12px; border: 1px solid var(--border); }
@media (max-width: 640px) {
  .speaker__inner { grid-template-columns: 1fr; text-align: center; }
}

.pricing { padding: 80px 0; }
.pricing__card { max-width: 480px; margin: 0 auto; text-align: center; }
.pricing__price { font-family: var(--font-display); font-size: 3rem; color: var(--acid); }
.pricing__note { opacity: 0.8; margin-top: 8px; }
.pricing__features { list-style: none; margin: 24px 0; display: flex; flex-direction: column; gap: 12px; text-align: left; }
.pricing__features li::before { content: "— "; color: var(--acid); }
```

- [ ] **Step 3: Manual verification**

Run: open `index.html` in a browser.
Expected:
- Speaker section shows a broken-image icon where `assets/img/eradj-nidoev.jpg` is missing (expected — placeholder, no layout break) next to the bio card.
- Pricing card shows "0 ₽" (Task 10 wires the count-up to 28 000), the installment note, feature list, and CTA button.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add speaker and pricing sections"
```

---

### Task 8: Testimonials + FAQ sections

**Files:**
- Modify: `index.html` — insert testimonials + FAQ sections after pricing
- Modify: `css/style.css` — append testimonials/FAQ styles
- Modify: `js/main.js` — register `initAccordions` for `.faq-item` (reuse the Task 5 helper, do not duplicate it)

**Interfaces:**
- Consumes: `initAccordions()` from Task 5.

- [ ] **Step 1: Insert testimonials + FAQ markup into `index.html`**

Insert after the pricing section's closing `</section>`:
```html
  <section class="testimonials" id="testimonials">
    <div class="container">
      <p class="meta meta--tl">Отзывы</p>
      <h2 class="section-title">Что говорят выпускники</h2>
      <div class="testimonials__grid">
        <blockquote class="card testimonial">
          <p>«Заглушка: замените реальным отзывом ученика.»</p>
          <cite>Имя Фамилия — роль</cite>
        </blockquote>
        <blockquote class="card testimonial">
          <p>«Заглушка: замените реальным отзывом ученика.»</p>
          <cite>Имя Фамилия — роль</cite>
        </blockquote>
        <blockquote class="card testimonial">
          <p>«Заглушка: замените реальным отзывом ученика.»</p>
          <cite>Имя Фамилия — роль</cite>
        </blockquote>
      </div>
    </div>
  </section>

  <section class="faq" id="faq">
    <div class="container">
      <p class="meta meta--tl">FAQ</p>
      <h2 class="section-title">Частые вопросы</h2>
      <div class="faq__list">
        <article class="faq-item card" data-open="false">
          <button class="faq-item__toggle" aria-expanded="false">Нужен ли опыт в видеомонтаже?</button>
          <div class="faq-item__content"><p>Нет, программа рассчитана на новичков в AI-видео — базовые навыки монтажа объясняются в рамках интенсива.</p></div>
        </article>
        <article class="faq-item card" data-open="false">
          <button class="faq-item__toggle" aria-expanded="false">Что нужно для участия технически?</button>
          <div class="faq-item__content"><p>Компьютер с доступом в интернет и доступ к Seedance 2.5 — как подключиться, расскажем перед стартом.</p></div>
        </article>
        <article class="faq-item card" data-open="false">
          <button class="faq-item__toggle" aria-expanded="false">Что я получу в конце интенсива?</button>
          <div class="faq-item__content"><p>Готовый видеоролик в портфолио, сделанный на реальном проекте для ОККО, и обратную связь от Эраджа и приглашённых экспертов.</p></div>
        </article>
        <article class="faq-item card" data-open="false">
          <button class="faq-item__toggle" aria-expanded="false">Есть ли рассрочка?</button>
          <div class="faq-item__content"><p>Да, оплату можно разбить на части — детали уточняются при записи.</p></div>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Append testimonials/FAQ styles to `css/style.css`**

```css
.testimonials { padding: 80px 0; }
.testimonials__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.testimonial cite { display: block; margin-top: 16px; color: var(--acid); font-style: normal; }

.faq { padding: 80px 0; }
.faq__list { display: flex; flex-direction: column; gap: 12px; }
.faq-item__toggle {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: var(--white);
  font-family: var(--font-display);
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
}
.faq-item__content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq-item[data-open="true"] .faq-item__content { max-height: 200px; padding-top: 12px; }
```

- [ ] **Step 3: Register FAQ accordion in `js/main.js`**

Update the `DOMContentLoaded` listener to:
```js
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
```

- [ ] **Step 4: Manual verification**

Run: open `index.html` in a browser.
Expected:
- 3 testimonial cards showing the placeholder quote text verbatim (so it is easy to `grep` and replace later).
- FAQ accordion expands/collapses each question independently, same interaction as the program-day accordion.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add testimonials and FAQ sections"
```

---

### Task 9: Final CTA with countdown + shader, wired footer

**Files:**
- Modify: `index.html` — insert final-cta section after FAQ, before `</main>`
- Modify: `css/style.css` — append final-cta/countdown styles
- Modify: `js/main.js` — add `initCountdown()`, register it and the new shader canvas

**Interfaces:**
- Consumes: `getTimeRemaining()` from Task 2 (global `window.getTimeRemaining`), `initShaderBackground()` from Task 4 via the existing `.js-shader-canvas` query.
- Produces: nothing further consumed by later tasks.

- [ ] **Step 1: Insert final-cta markup into `index.html`**

Insert after the FAQ section's closing `</section>`, replacing the `<!-- секции добавляются в задачах 3, 5-9 -->` comment:
```html
  <section class="final-cta" id="final-cta">
    <canvas class="final-cta__shader js-shader-canvas" aria-hidden="true"></canvas>
    <div class="container final-cta__inner">
      <p class="meta meta--tl">Старт 17 сентября 2026</p>
      <h2 class="section-title">Успей попасть в поток</h2>
      <div class="countdown" id="countdown">
        <div class="countdown__unit"><span class="countdown__value" data-unit="days">00</span><span class="countdown__label">дней</span></div>
        <div class="countdown__unit"><span class="countdown__value" data-unit="hours">00</span><span class="countdown__label">часов</span></div>
        <div class="countdown__unit"><span class="countdown__value" data-unit="minutes">00</span><span class="countdown__label">минут</span></div>
        <div class="countdown__unit"><span class="countdown__value" data-unit="seconds">00</span><span class="countdown__label">секунд</span></div>
      </div>
      <a href="#cta-placeholder" class="btn btn-cta">Записаться на интенсив</a>
    </div>
  </section>
```

- [ ] **Step 2: Append final-cta/countdown styles to `css/style.css`**

```css
.final-cta { position: relative; padding: 120px 0; text-align: center; overflow: hidden; }
.final-cta__shader { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.4; mix-blend-mode: screen; }
.final-cta__inner { position: relative; z-index: 1; }
.countdown { display: flex; justify-content: center; gap: 24px; margin: 40px 0; flex-wrap: wrap; }
.countdown__unit { display: flex; flex-direction: column; align-items: center; }
.countdown__value { font-family: var(--font-display); font-size: 2.5rem; color: var(--acid); }
.countdown__label { font-size: 0.85rem; opacity: 0.7; }
```

- [ ] **Step 3: Add `initCountdown()` to `js/main.js`**

Add above `document.addEventListener('DOMContentLoaded', ...)`:
```js
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
```
Update the `DOMContentLoaded` listener to:
```js
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
});
```

- [ ] **Step 4: Manual verification**

Run: open `index.html` in a browser.
Expected:
- Final section shows an animated monochrome shader behind a "дней / часов / минут / секунд" countdown, updating every second, counting down toward 17 September 2026, 10:00 Moscow time.
- No console errors related to `getTimeRemaining` (confirms `js/countdown.js` loaded before `js/main.js` per the script order fixed in Task 1).

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add final CTA section with live countdown"
```

---

### Task 10: GSAP ScrollTrigger reveal animations

**Files:**
- Modify: `js/main.js` — add `initScrollAnimations()`, register it last in `DOMContentLoaded`

**Interfaces:**
- Consumes: GSAP + ScrollTrigger globals from the CDN scripts (Task 1), `.card`/`.section-title`/`.hero__title`/`.hero__subtitle` markup from earlier tasks, `[data-count-to]` spans from Tasks 5 and 7.

- [ ] **Step 1: Add `initScrollAnimations()` to `js/main.js`**

Add above `document.addEventListener('DOMContentLoaded', ...)`:
```js
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
```
Update the `DOMContentLoaded` listener to add `initScrollAnimations();` as the last call:
```js
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
```

- [ ] **Step 2: Manual verification**

Run: open `index.html` in a browser.
Expected:
- Scrolling down reveals each section's cards/titles with a fade+slide-up, staggered.
- The "7", "1", and "28 000" counters animate up from 0 when their section scrolls into view, formatted with a thousands separator (`28 000`).
- During the first scroll past the hero, the hero text pins briefly over the video before releasing.
- With DevTools `prefers-reduced-motion: reduce` emulation on, reload the page → all content is visible immediately (no faded-out sections), and no console errors.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: add GSAP ScrollTrigger reveal animations"
```

---

### Task 11: Responsive polish and full manual QA pass

**Files:**
- Modify: `css/style.css` — any fixes found during the QA pass below (exact rules depend on what step 1 finds; common fix already anticipated is added in Step 2)

**Interfaces:** None — this task only verifies and polishes existing behavior.

- [ ] **Step 1: Run the full manual QA checklist**

Open `index.html` in a browser and, using DevTools' device toolbar, check each item at 375px, 768px, and 1440px widths:
- No horizontal scrollbar appears at any width.
- Hero title/subtitle remain readable and don't overflow their container (the `clamp()` sizing from Task 3 should handle this — confirm visually).
- Gallery grid shows 2 columns below 768px and 4 columns at/above it.
- Speaker section stacks to a single column and centers text below 640px.
- Countdown units wrap onto two rows on narrow screens without clipping (confirm `.countdown` `flex-wrap: wrap` from Task 9 is sufficient).
- Program/FAQ accordion buttons remain full-width and tappable (min touch target ~44px height) on mobile.

Then check cross-cutting behavior:
- Confirm no console error is thrown for the missing `assets/video/*.mp4` files and every `poster` image area shows cleanly (video `src` 404s are silently handled by the browser).
- In the device toolbar's mobile emulation (e.g. "iPhone 12"), confirm the hero and gallery `<video>` elements have both `muted` and `playsinline` attributes (inspect in Elements panel) — required for autoplay to work on mobile browsers.
- Open DevTools → Lighthouse tab, run an audit with "Performance" and "Accessibility" categories selected (mobile or desktop, either is fine for this static page). Expected: Accessibility score 90+ (the black/white/lime palette has strong contrast by construction); note any Performance flags about the unoptimized placeholder video/image files — these are expected until real, compressed assets replace the placeholders, not a code defect.
- Run `node --test tests/countdown.test.js` once more to confirm the dev-time test suite still passes after all markup changes.
Run: `node --test tests/countdown.test.js`
Expected: PASS — 3 tests, 0 failures.

- [ ] **Step 2: Fix mobile touch-target sizing for accordion toggles**

Append to `css/style.css`:
```css
@media (max-width: 480px) {
  .program-day__toggle,
  .faq-item__toggle {
    padding: 12px 0;
  }
}
```

- [ ] **Step 3: Re-verify after the fix**

Run: open `index.html` in a browser, DevTools device toolbar at 375px width.
Expected: program-day and FAQ toggle buttons have comfortable tap padding; no other regressions from Step 1's checklist.

- [ ] **Step 4: Commit**

```bash
git add css/style.css
git commit -m "fix: improve mobile touch targets for accordions"
```

---

## Post-plan follow-ups (not part of this plan's tasks)

These are the placeholders documented in the spec — flag them to the user once the plan is executed, they are not implementation tasks:
- Replace `assets/video/hero.mp4` and `assets/video/gallery-{1..4}.mp4` with real Seedance 2.5 clips, plus matching poster JPGs in `assets/img/`.
- Replace every `href="#cta-placeholder"` with the real signup/payment URL.
- Replace the 3 testimonial placeholder cards with real quotes.
- Replace `assets/img/eradj-nidoev.jpg` with a real speaker photo.
