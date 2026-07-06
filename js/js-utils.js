/* ============================================
   Utilidades JS reutilizables
   ============================================ */

// Age Gate: Inicializar en todas las páginas
function initAgeGate() {
  const ageGate = document.getElementById('age-gate');
  if (!ageGate) return; // No existe en esta página

  const confirmBtn = document.querySelector('[data-age-confirm]');
  const denyBtn = document.querySelector('[data-age-deny]');
  const ageConfirmed = localStorage.getItem('godua-age-confirmed');

  if (!ageConfirmed) {
    ageGate.removeAttribute('hidden');
    document.body.classList.add('age-gate--open');
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      localStorage.setItem('godua-age-confirmed', 'true');
      ageGate.setAttribute('hidden', '');
      document.body.classList.remove('age-gate--open');
    });
  }

  if (denyBtn) {
    denyBtn.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }
}

// Acordeón: Toggle de items
function initAccordions() {
  document.querySelectorAll('.accordion__trigger').forEach(button => {
    button.addEventListener('click', (e) => {
      const item = button.parentElement;
      item.classList.toggle('accordion--open');
    });
  });
}

// Calculadora de chopera
function initChoperaCalculator() {
  const peopleInput = document.getElementById('people-count');
  const hoursInput = document.getElementById('hours-count');
  const litersEstimate = document.getElementById('liters-estimate');
  const cupsEstimate = document.getElementById('cups-estimate');

  if (!peopleInput) return; // No existe calculator en esta página

  function updateCalc() {
    const people = parseInt(peopleInput.value) || 20;
    const hours = parseInt(hoursInput.value) || 4;
    const liters = Math.ceil((people * hours / 2) * 0.5);
    const cups = Math.ceil(liters * 2);

    litersEstimate.textContent = liters;
    cupsEstimate.textContent = cups;
  }

  peopleInput.addEventListener('change', updateCalc);
  hoursInput.addEventListener('change', updateCalc);
}

// Mock de precios (reemplazar con fetch cuando backend esté listo)
function loadPrices() {
  // Simulación: precios cargan después de 500ms
  const priceElements = document.querySelectorAll('[id^="price-"]');

  if (priceElements.length === 0) return; // No hay precios en esta página

  const mockPrices = {
    'price-500': '1200',
    'price-1000': '2000',
    'price-20l': '4500',
    'price-30l': '6200',
    'price-50l': '9200'
  };

  setTimeout(() => {
    priceElements.forEach(el => {
      if (mockPrices[el.id]) {
        el.textContent = mockPrices[el.id];
      }
    });
  }, 500);
}

// Scroll reveal: anima los elementos [data-reveal] cuando entran al viewport.
// Los estilos están en css/components/animations.css.
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length || !('IntersectionObserver' in window)) return;

  // Recién acá se ocultan los elementos: si el JS falla, todo se ve normal
  document.documentElement.classList.add('js-anim');

  // Grupos con cascada: cada hijo [data-reveal] recibe un delay incremental
  document.querySelectorAll('[data-reveal-group]').forEach(group => {
    group.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * 0.1}s`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      observer.unobserve(el); // anima una sola vez

      // Al terminar, limpiamos el atributo para no pisar las transitions
      // propias del elemento (hovers de cards, ilustraciones, etc.)
      el.addEventListener('transitionend', () => {
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--reveal-delay');
      }, { once: true });
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// Smart header: el navbar se esconde al scrollear hacia abajo
// y reaparece apenas se scrollea hacia arriba (aunque no estés en el tope).
function initSmartNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const menuToggle = document.getElementById('nav-toggle');
  let lastY = window.scrollY;
  let ticking = false; // evita procesar más de un scroll por frame

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = window.scrollY;
      const delta = y - lastY;
      const menuOpen = menuToggle && menuToggle.checked;

      if (y < 80) {
        // Cerca del tope: siempre visible
        navbar.classList.remove('navbar--hidden');
      } else if (delta > 6 && !menuOpen) {
        // Bajando (y sin el menú abierto): se esconde
        navbar.classList.add('navbar--hidden');
      } else if (delta < -6) {
        // Subiendo: reaparece
        navbar.classList.remove('navbar--hidden');
      }
      // El umbral de 6px filtra micro-movimientos (trackpads, rebote táctil)

      lastY = y;
      ticking = false;
    });
  }, { passive: true });
}

// Inicializar todo al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initAccordions();
  initChoperaCalculator();
  loadPrices();
  initScrollReveal();
  initSmartNavbar();
});
