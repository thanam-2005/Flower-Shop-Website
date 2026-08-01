/* ==========================================================================
   BLOOMING PETALS - Core JavaScript (main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  initStickyHeader();
  initScrollProgress();
  initMobileMenu();
  initScrollReveal();
  initHeroParticles();
  initAnimatedCounters();
  initBackToTop();
});

/* 1. Preloader Handler */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 400);
  });
  // Fallback timeout in case load event fires early
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 1500);
}

/* 2. Dark / Light Mode Theme Toggle */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('bp_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('bp_theme', newTheme);
    updateThemeIcon(newTheme);
    if (window.showToast) {
      window.showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'fa-circle-half-stroke');
    }
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

/* 3. Sticky Navbar & Header Shrink */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* 4. Scroll Progress Indicator Line */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progressPercent = (scrollPosition / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
  });
}

/* 5. Mobile Hamburger Menu Toggle */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = hamburgerBtn.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars-staggered';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = hamburgerBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars-staggered';
    });
  });
}

/* 6. Scroll Reveal Observer */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* 7. Floating Petals Canvas Particle System */
function initHeroParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = canvas.parentElement.offsetWidth;
  let height = canvas.height = canvas.parentElement.offsetHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const petals = [];
  const petalCount = 28;

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1.5 + 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      color: `rgba(255, ${Math.floor(105 + Math.random() * 50)}, ${Math.floor(180 + Math.random() * 40)}, ${Math.random() * 0.4 + 0.3})`
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > height) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width) p.x = 0;
      if (p.x < 0) p.x = width;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      // Draw soft flower petal ellipse shape
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* 8. Animated Counters */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.innerText = target.toLocaleString() + '+';
              clearInterval(timer);
            } else {
              counter.innerText = current.toLocaleString() + '+';
            }
          }, 16);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

/* 9. Back to Top Button */
function initBackToTop() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
