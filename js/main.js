/* ============================================================
   Villa Harpocrates — Main JavaScript
   ============================================================ */

// ========== AOS Init ==========
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' });
  }
});

// ========== Navbar Scroll ==========
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// ========== Mobile Menu ==========
const mobileBtn  = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('open');
    mobileBtn.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !mobileBtn.contains(e.target)
    ) {
      mobileMenu.classList.remove('open');
      mobileBtn.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ========== Active Nav Link (by page) ==========
(function setActiveNav() {
  const path = window.location.pathname;
  const navLinks     = document.querySelectorAll('.nav-link');
  const mobileLinks  = document.querySelectorAll('.mobile-link');

  const pageMap = {
    '/':             'index',
    '/index':        'index',
    '/index.html':   'index',
    '/about':        'about',
    '/about.html':   'about',
    '/services':     'services',
    '/services.html':'services',
    '/gallery':      'gallery',
    '/gallery.html': 'gallery',
    '/pricing':      'pricing',
    '/pricing.html': 'pricing',
    '/contact':      'contact',
    '/contact.html': 'contact',
  };

  const currentPage = pageMap[path] || 'index';

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = pageMap[href] || pageMap['/' + href.replace(/^\//, '').replace(/\.html$/, '')] || href.replace(/\.html$/, '').replace(/^\//, '');
    if (linkPage === currentPage || href.replace(/\.html$/, '').replace(/^\//, '') === currentPage) {
      link.classList.add('active');
    }
  });

  mobileLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.replace(/\.html$/, '').replace(/^\//, '') === currentPage ||
        (currentPage === 'index' && (href === '/' || href === 'index.html'))) {
      link.classList.add('active');
    }
  });
})();

// ========== Hero Background Slideshow ==========
document.addEventListener('DOMContentLoaded', () => {
  const bgs = document.querySelectorAll('#hero .hero-bg');
  if (bgs.length < 2) return;
  let current = 0;
  setInterval(() => {
    bgs[current].classList.remove('active');
    current = (current + 1) % bgs.length;
    bgs[current].classList.add('active');
  }, 5000);
});

// ========== Gallery Lightbox ==========
let galleryImages = [];
let currentLightboxIndex = 0;

function buildGalleryImages() {
  const items = document.querySelectorAll('.gallery-item[data-src]');
  galleryImages = Array.from(items).map(item => ({
    src: item.getAttribute('data-src'),
    alt: item.getAttribute('data-alt') || 'Villa Harpocrates'
  }));
}

function showLightbox(index) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-counter');
  if (!lb || !lbImg || galleryImages.length === 0) return;

  currentLightboxIndex = (index + galleryImages.length) % galleryImages.length;
  lbImg.src = galleryImages[currentLightboxIndex].src;
  lbImg.alt = galleryImages[currentLightboxIndex].alt;
  if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;

  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

function prevImage() { showLightbox(currentLightboxIndex - 1); }
function nextImage() { showLightbox(currentLightboxIndex + 1); }

// Init gallery
document.addEventListener('DOMContentLoaded', () => {
  buildGalleryImages();

  document.querySelectorAll('.gallery-item[data-src]').forEach((item, index) => {
    item.addEventListener('click', () => showLightbox(index));
  });

  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn  = document.getElementById('lightbox-prev');
  const nextBtn  = document.getElementById('lightbox-next');
  const lb       = document.getElementById('lightbox');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', prevImage);
  if (nextBtn)  nextBtn.addEventListener('click', nextImage);
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lb || !lb.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Touch swipe support
  if (lb) {
    let touchStartX = 0;
    lb.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 50) {
        delta < 0 ? nextImage() : prevImage();
      }
    }, { passive: true });
  }
});

// ========== Gallery Category Filter ==========
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      // Rebuild image index after filter
      buildGalleryImages();
      document.querySelectorAll('.gallery-item[data-src]').forEach((item, i) => {
        item.onclick = () => showLightbox(i);
      });
    });
  });
});

// ========== Leaflet Map (Lazy Init) ==========
document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('villa-map');
  if (!mapEl || typeof L === 'undefined') return;

  let mapInitialized = false;

  const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !mapInitialized) {
        mapInitialized = true;
        initMap();
        mapObserver.disconnect();
      }
    });
  }, { rootMargin: '0px 0px 200px 0px' });

  mapObserver.observe(mapEl);
});

function initMap() {
  const map = L.map('villa-map', {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([43.1786, 16.6993], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>'
  }).addTo(map);

  const goldIcon = L.divIcon({
    html: '<div style="background:#c9a84c;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,0.6)"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    className: ''
  });

  L.marker([43.1786, 16.6993], { icon: goldIcon })
    .addTo(map)
    .bindPopup('<b>Villa Harpocrates</b><br>Put Gospojice 41, Vrboska, Hvar')
    .openPopup();
}

// ========== Back to Top ==========
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== Booking Form ==========
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.booking-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('[type="submit"]');
      const checkIn  = form.querySelector('input[name="check-in"]');
      const checkOut = form.querySelector('input[name="check-out"]');

      // Date validation
      if (checkIn && checkOut && checkIn.value && checkOut.value) {
        const inDate  = new Date(checkIn.value);
        const outDate = new Date(checkOut.value);
        const diffDays = (outDate - inDate) / (1000 * 60 * 60 * 24);

        if (outDate <= inDate) {
          e.preventDefault();
          alert('Check-out date must be after check-in date.');
          checkOut.focus();
          return;
        }
        if (diffDays < 3) {
          e.preventDefault();
          alert('Minimum stay is 3 nights.');
          return;
        }
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
    });
  });

  // Set min date for check-in to today
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });
});

// ========== Smooth Anchor Scroll (polyfill) ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
