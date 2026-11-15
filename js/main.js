/**
 * SRADHA PANIGRAHI — Electrical & Electronics Engineering Portfolio
 * Interactive Script: Theme switching, TTS audio reader, counter animations,
 * SVG gauges, lightbox modal, typewriter effect, and inquiry handler.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Initialize theme from localStorage, default to light (96% white + 4% grey)
  const savedTheme = localStorage.getItem('sradha_portfolio_theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('sradha_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Obsidian Substation' : 'Drafting Blueprint'} Mode`);
    });
  }

  // 2. Mobile Menu Navigation
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Scroll Progress Indicator & Active Nav Spy
  const progressBar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  window.addEventListener('scroll', () => {
    // Scroll progress bar
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progressBar && height > 0) {
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }

    // Active nav link spy
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (winScroll >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Typewriter Effect
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const roles = [
      'Power Systems & Renewable Microgrids',
      'COMSOL Multiphysics & Electrostatics',
      'Substation Architecture & HV Diagnostics',
      'Applied Embedded Systems & IoT Instrumentation',
      'Solar PV Array Modeling & MPPT Control'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 65;

    function typeWriterLoop() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 65;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2200; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before next word
      }

      setTimeout(typeWriterLoop, typingSpeed);
    }
    typeWriterLoop();
  }

  // 5. Spec Strip Gauge & Numeric Counter Animation
  const specStrip = document.getElementById('spec-strip');
  let animatedGauges = false;

  if (specStrip && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedGauges) {
          animatedGauges = true;
          animateGaugesAndCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(specStrip);
  } else {
    animateGaugesAndCounters();
  }

  function animateGaugesAndCounters() {
    // Animate circular SVG gauges
    const gauges = document.querySelectorAll('.gauge-arc');
    const circumference = 2 * Math.PI * 27; // ~169.64

    gauges.forEach(gauge => {
      const pct = parseFloat(gauge.getAttribute('data-pct') || '0.75');
      const offset = circumference * (1 - pct);
      gauge.style.strokeDashoffset = offset;
    });

    // Animate count numbers
    const countElements = document.querySelectorAll('[data-target-count]');
    countElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target-count'), 10);
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeProgress * target);
        el.textContent = currentCount;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  // 6. Text-to-Speech (TTS) Project Reader
  const ttsButtons = document.querySelectorAll('.tts-control-btn');
  let currentSpeechUtterance = null;
  let activeTTSButton = null;

  ttsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-tts-target');
      const targetContent = document.getElementById(targetId);

      if (!('speechSynthesis' in window)) {
        showToast('Speech synthesis not supported in this browser.');
        return;
      }

      // If already speaking this button, stop it
      if (activeTTSButton === btn) {
        window.speechSynthesis.cancel();
        btn.classList.remove('speaking');
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        activeTTSButton = null;
        return;
      }

      // If speaking something else, cancel it
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (activeTTSButton) {
          activeTTSButton.classList.remove('speaking');
          activeTTSButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
      }

      if (!targetContent) return;

      const title = btn.getAttribute('data-tts-title') || 'Project details';
      const cleanText = `${title}. ` + targetContent.innerText.replace(/[\n\r]+/g, ' ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.98;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        btn.classList.add('speaking');
        btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
        activeTTSButton = btn;
        showToast(`Reading: ${title}`);
      };

      utterance.onend = () => {
        btn.classList.remove('speaking');
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        activeTTSButton = null;
      };

      utterance.onerror = () => {
        btn.classList.remove('speaking');
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        activeTTSButton = null;
      };

      currentSpeechUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  });

  // 7. Lightbox Modal for Simulation Diagrams & Hardware Photos
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const mediaWrappers = document.querySelectorAll('[data-lightbox-src]');
  mediaWrappers.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-lightbox-src');
      const captionText = item.getAttribute('data-lightbox-caption') || '';
      if (lightboxModal && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = captionText;
        if (lightboxCaption) lightboxCaption.textContent = captionText;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 8. Quick Inquiry Template Pre-fills
  const templateButtons = document.querySelectorAll('.template-btn');
  const inquirySubject = document.getElementById('inquiry-subject');
  const inquiryMessage = document.getElementById('inquiry-message');

  const templateMap = {
    'comsol': {
      subject: 'COMSOL Multiphysics & High-Voltage Simulation Inquiry',
      message: 'Hello Sradha,\n\nI reviewed your Electrostatic Precipitator (ESP) simulation work at IIT Bhubaneswar. I would like to discuss a simulation project involving electric-field modeling / boundary condition setups in COMSOL.'
    },
    'microgrid': {
      subject: 'Solar PV & BESS Microgrid Modeling Inquiry',
      message: 'Hello Sradha,\n\nI am interested in your MATLAB/Simulink modeling work on the 6.84 kW grid-connected PV array with MPPT and Lithium-ion battery storage.'
    },
    'iot': {
      subject: 'Embedded Systems & AIoT Prototype Collaboration',
      message: 'Hello Sradha,\n\nI saw your PORTA-MP microplastic detector and Knock-pattern authentication hardware builds. We are exploring an applied embedded systems project.'
    },
    'taiwan-ms': {
      subject: 'Taiwan MS Graduate Research / Academic Discussion',
      message: 'Hello Sradha,\n\nI came across your electrical engineering portfolio and noted your preparation for Master of Science programs in Taiwan (Power Systems / Multiphysics / Smart Grids).'
    }
  };

  templateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-template-key');
      if (templateMap[key] && inquirySubject && inquiryMessage) {
        inquirySubject.value = templateMap[key].subject;
        inquiryMessage.value = templateMap[key].message;
        inquiryMessage.focus();
        showToast('Template populated in inquiry form');
      }
    });
  });

  // 9. Inquiry Form Submit Handler
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inquiry-name')?.value || 'Colleague';
      const email = document.getElementById('inquiry-email')?.value || '';
      const subject = inquirySubject?.value || 'Technical Collaboration Inquiry';
      const msg = inquiryMessage?.value || '';

      const fullBody = `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${msg}`;
      const mailtoUrl = `mailto:sradhapanigrahi539@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

      window.open(mailtoUrl, '_blank');
      showToast('Opening default email client...');
    });
  }

  // 10. Toast Notification System
  function showToast(message, duration = 3400) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notice';
      toast.className = 'toast-notice';
      toast.innerHTML = '<i class="fa-solid fa-circle-check"></i><span id="toast-text"></span>';
      document.body.appendChild(toast);
    }

    const toastText = toast.querySelector('#toast-text');
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
