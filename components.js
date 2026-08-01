/* ==========================================================================
   BLOOMING PETALS - UI Components & Interactive Effects (components.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initTestimonialSlider();
  initGalleryLightbox();
  initFAQAccordion();
  initContactFormValidation();
  initNewsletterForm();
});

/* 1. Global Toast Notification Engine */
window.showToast = function(message, iconClass = 'fa-circle-check') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
};

/* 2. Special Offers Countdown Timer */
function initCountdownTimer() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Set target 3 days from now
  const targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minsEl.innerText = "00";
      secsEl.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days < 10 ? `0${days}` : days;
    hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
    minsEl.innerText = mins < 10 ? `0${mins}` : mins;
    secsEl.innerText = secs < 10 ? `0${secs}` : secs;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* 3. Testimonial Carousel Slider */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track) return;

  const slides = Array.from(track.children);
  const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
  let currentIndex = 0;
  let autoplayTimer = null;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  prevBtn?.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAutoplay();
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();
}

/* 4. Flower Gallery Lightbox Popup */
function initGalleryLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      modalImg.src = fullSrc;
      modal.classList.add('active');
    });
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

/* 5. FAQ Accordion Handler */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other accordion items
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 6. Real-Time Contact Form Validation */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const messageInput = document.getElementById('contactMessage');

  form.addEventListener('submit', e => {
    e.preventDefault();

    let isValid = true;

    // Name check
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your full name');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Phone check
    const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
    if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
      showError(phoneInput, 'Please enter a valid phone number');
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    // Message check
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please enter your message');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      if (window.showToast) {
        window.showToast('Thank you! Your message has been sent successfully.', 'fa-paper-plane');
      }
      form.reset();
    }
  });

  function showError(input, msg) {
    const group = input.parentElement;
    group.classList.add('error');
    const errSpan = group.querySelector('.form-error');
    if (errSpan) errSpan.innerText = msg;
  }

  function clearError(input) {
    const group = input.parentElement;
    group.classList.remove('error');
  }
}

/* 7. Newsletter Subscription Handler */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');

  if (!form || !emailInput) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      if (window.showToast) window.showToast('Please enter a valid email address!', 'fa-circle-exclamation');
      return;
    }

    if (window.showToast) {
      window.showToast('Welcome to VIP Blooming Club! Check your inbox for 15% OFF.', 'fa-envelope-open-text');
    }

    emailInput.value = '';
  });
}
