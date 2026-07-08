/* EC FOOD — interacciones */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────── Nav: fondo al scrollear + menú móvil ───────── */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");

  function onScrollNav() {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  function closeMenu() {
    navLinks.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
  }
  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ───────── Hero slider ───────── */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero__slide"));
  var progress = document.getElementById("heroProgress");
  var numEl = document.getElementById("heroNum");
  var totalEl = document.getElementById("heroTotal");
  var AUTOPLAY_MS = 6000;
  var current = 0;
  var timer = null;

  totalEl.textContent = String(slides.length).padStart(2, "0");

  var bars = slides.map(function (_, i) {
    var b = document.createElement("button");
    b.className = "hero__bar";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Ir al plato " + (i + 1));
    b.appendChild(document.createElement("i"));
    b.addEventListener("click", function () { goTo(i, true); });
    progress.appendChild(b);
    return b;
  });

  function paintBars() {
    bars.forEach(function (b, i) {
      b.classList.remove("is-active", "is-done");
      b.setAttribute("aria-selected", String(i === current));
      if (i < current) b.classList.add("is-done");
      if (i === current && !reducedMotion) {
        // reinicia la animación de llenado
        void b.offsetWidth;
        b.classList.add("is-active");
      }
      if (i === current && reducedMotion) b.classList.add("is-done");
    });
  }

  function goTo(i, manual) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) {
      s.classList.toggle("is-active", k === current);
    });
    numEl.textContent = String(current + 1).padStart(2, "0");
    paintBars();
    if (manual) restartTimer();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function restartTimer() {
    if (timer) clearInterval(timer);
    if (reducedMotion) return; // sin autoplay si el usuario pide menos movimiento
    timer = setInterval(next, AUTOPLAY_MS);
  }

  document.getElementById("heroNext").addEventListener("click", function () { goTo(current + 1, true); });
  document.getElementById("heroPrev").addEventListener("click", function () { goTo(current - 1, true); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") goTo(current + 1, true);
    if (e.key === "ArrowLeft") goTo(current - 1, true);
  });

  // swipe táctil
  var hero = document.querySelector(".hero");
  var touchX = null;
  hero.addEventListener("touchstart", function (e) {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  hero.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? goTo(current + 1, true) : goTo(current - 1, true));
    touchX = null;
  }, { passive: true });

  // pausa cuando la pestaña no está visible
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (timer) clearInterval(timer); }
    else restartTimer();
  });

  paintBars();
  restartTimer();

  /* ───────── Carrusel de favoritos: flechas + arrastre ───────── */
  var track = document.getElementById("favTrack");
  var card = track.querySelector(".fav-card");

  function cardStep() {
    return (card ? card.getBoundingClientRect().width : 300) + 22;
  }
  document.getElementById("favNext").addEventListener("click", function () {
    track.scrollBy({ left: cardStep() * 2, behavior: reducedMotion ? "auto" : "smooth" });
  });
  document.getElementById("favPrev").addEventListener("click", function () {
    track.scrollBy({ left: -cardStep() * 2, behavior: reducedMotion ? "auto" : "smooth" });
  });

  // arrastre con mouse
  var isDown = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener("mousedown", function (e) {
    isDown = true; moved = false;
    startX = e.pageX; startScroll = track.scrollLeft;
    track.classList.add("is-dragging");
  });
  window.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    var dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });
  window.addEventListener("mouseup", function () {
    isDown = false;
    track.classList.remove("is-dragging");
  });
  // evita que un arrastre dispare un clic
  track.addEventListener("click", function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  /* ───────── Testimonios ───────── */
  var quotes = Array.prototype.slice.call(document.querySelectorAll("#quoteSlides blockquote"));
  var dotsWrap = document.getElementById("quoteDots");
  var qCurrent = 0;
  var qTimer = null;

  var qDots = quotes.map(function (_, i) {
    var d = document.createElement("button");
    d.setAttribute("role", "tab");
    d.setAttribute("aria-label", "Opinión " + (i + 1));
    d.addEventListener("click", function () { quoteGo(i); restartQuotes(); });
    dotsWrap.appendChild(d);
    return d;
  });

  function quoteGo(i) {
    qCurrent = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, k) { q.classList.toggle("is-active", k === qCurrent); });
    qDots.forEach(function (d, k) {
      d.classList.toggle("is-active", k === qCurrent);
      d.setAttribute("aria-selected", String(k === qCurrent));
    });
  }
  function restartQuotes() {
    if (qTimer) clearInterval(qTimer);
    if (reducedMotion) return;
    qTimer = setInterval(function () { quoteGo(qCurrent + 1); }, 5500);
  }
  quoteGo(0);
  restartQuotes();

  /* ───────── Reveal on scroll ───────── */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ───────── Contadores ───────── */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reducedMotion) { el.textContent = target; return; }
    var start = null;
    var DUR = 1400;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / DUR, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCounter(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
  }
})();
