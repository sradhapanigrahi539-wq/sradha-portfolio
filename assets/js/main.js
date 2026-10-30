/**
 * Sradha Panigrahi - Electrical & Electronics Engineering Portfolio
 * Interactive Features: Neural Canvas, Theme Switcher, Project Filter, Modal Engine, Terminal Console
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initThemeToggle();
  initNavbar();
  initProjectFilter();
  initModals();
  initTerminal();
  initContactForm();
  initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. NEURAL & ELECTRICAL GRID CANVAS
   -------------------------------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
  let particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/attraction
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw(theme) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.75)' : 'rgba(2, 132, 199, 0.65)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  initParticles();

  function animate() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines (simulating grid busbars & neural synapses)
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * (theme === 'dark' ? 0.25 : 0.15);
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = theme === 'dark' ? `rgba(56, 189, 248, ${opacity})` : `rgba(2, 132, 199, ${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
      particles[a].update();
      particles[a].draw(theme);
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. THEME SWITCHER (DARK / LIGHT)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Read saved or default
  const savedTheme = localStorage.getItem('sradha-portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('sradha-portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }
}

/* --------------------------------------------------------------------------
   3. NAVBAR BEHAVIOR, ACTIVE SCROLL SPY, & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');

  // Sticky Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Menu Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Back to top button
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   4. PROJECT CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. PROJECT MODALS
   -------------------------------------------------------------------------- */
function initModals() {
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const closeButtons = document.querySelectorAll('.modal-close');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('open');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // lock background scroll
      }
    });
  });

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  modalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach((modal) => {
        if (modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE ENGINEER TERMINAL CONSOLE
   -------------------------------------------------------------------------- */
function initTerminal() {
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  if (!terminalForm || !terminalInput || !terminalOutput) return;

  const commandResponses = {
    help: `Available Commands:
  • <span class="term-accent">skills</span>       - List core simulation, hardware & coding competencies
  • <span class="term-accent">projects</span>     - Overview of key engineering innovations (UPQC, DSP, etc.)
  • <span class="term-accent">experience</span>   - Internships at IIT Bhubaneswar, TPSODL & NIST
  • <span class="term-accent">education</span>    - Academic background at NIST University
  • <span class="term-accent">upqc</span>         - Deep-dive summary into ANN-UPQC microgrid design
  • <span class="term-accent">contact</span>      - Direct phone, email, and LinkedIn details
  • <span class="term-accent">download-cv</span>  - Instant link to ATS-optimized resume
  • <span class="term-accent">clear</span>        - Clear terminal display`,

    skills: `⚡ Technical Competencies:
  • Simulation & CAD: MATLAB/Simulink, COMSOL Multiphysics, ETAP, LabVIEW
  • Power Systems: UPQC, Microgrids, Substation Design, Switchgear & Protection
  • Embedded & IoT: ESP32, Arduino, Raspberry Pi 5, 8051/8086, MQTT
  • Programming: Python (SciPy/NumPy/Matplotlib), C, SQL, Assembly Language`,

    projects: `🔬 Key Engineering Projects:
  1. Electrostatic Precipitator (ESP) Multiphysics Modeling (COMSOL at IIT BBS)
  2. Design of ANN Controller & UPQC Integrated with Microgrid (MATLAB/Simulink)
  3. 6.84 kW Grid-Connected PV Microgrid with MPPT & Li-ion BESS
  4. Smart Irrigation System with Automated Sensor Integration (ESP32 / Award Winner)
  5. Digital Filter of Noise Reduction & Feature Extraction from Signal (Python)`,

    experience: `💼 Internship Experience:
  • IIT Bhubaneswar (May 2026 – Jul 2026): Research Intern - COMSOL Multiphysics ESP Design
  • TP Southern Odisha Distribution Ltd (Jun 2025 – Jul 2025): Substation & Grid Maintenance
  • NIST University (May 2024 – Jun 2024): C Programming Intern - Numerical Methods`,

    education: `🎓 Academic Background:
  • B.Tech in Electrical & Electronics Engineering: NIST University (2023 - Present)
  • Senior Secondary (+2 Science): Sankalp Senior Secondary School (2020 - 2022)
  • Secondary School: K.C Public School (2008 - 2020)`,

    upqc: `⚡ UPQC & ANN Controller Details:
  • Replaced classical PI controllers with Backpropagation Neural Network
  • Series APF: Mitigates 30% voltage sag & 25% swell dynamically
  • Shunt APF: Slashes current THD from 22.4% to <2.8% (IEEE 519 compliant)
  • Integrated with renewable microgrid DC link for seamless stabilization`,

    contact: `📬 Contact Channels:
  • Email: <a href="mailto:sradhapanigrahi539@gmail.com" class="term-accent">sradhapanigrahi539@gmail.com</a>
  • Phone: <a href="tel:+916371443909" class="term-accent">+91 6371443909</a>
  • LinkedIn: <a href="https://linkedin.com/in/sradha-panigrahi-ab732a290" target="_blank" class="term-accent">linkedin.com/in/sradha-panigrahi-ab732a290</a>
  • Location: Berhampur, Odisha, India`,

    'download-cv': `📄 Triggering ATS Resume download... 
  <a href="assets/documents/Sradha_Panigrahi_Resume.pdf" download="Sradha_Panigrahi_Resume.pdf" class="term-accent">Click here if download does not start automatically</a>`,

    whoami: `You are an inquisitive visitor exploring Sradha Panigrahi's portfolio!`
  };

  window.runTerminalCommand = function (cmd) {
    terminalInput.value = cmd;
    executeCommand(cmd);
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = `
        <p class="term-line term-welcome"><span class="term-accent">Console cleared. Ready for instructions.</span></p>
        <p class="term-line">Type <span class="term-chip" onclick="runTerminalCommand('help')">help</span> for commands.</p>
      `;
      terminalInput.value = '';
      return;
    }

    // Append user input
    const userLine = document.createElement('p');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">visitor@sradha:~$</span> ${escapeHTML(rawCmd)}`;
    terminalOutput.appendChild(userLine);

    // Response
    const respLine = document.createElement('div');
    respLine.className = 'term-line';

    if (commandResponses[cmd]) {
      respLine.innerHTML = commandResponses[cmd];
      if (cmd === 'download-cv') {
        const link = document.createElement('a');
        link.href = 'assets/documents/Sradha_Panigrahi_Resume.pdf';
        link.download = 'Sradha_Panigrahi_Resume.pdf';
        link.click();
      }
    } else {
      respLine.innerHTML = `<span style="color:#ef4444;">Command not found: '${escapeHTML(cmd)}'. Type <span class="term-chip" onclick="runTerminalCommand('help')">help</span> for options.</span>`;
    }

    terminalOutput.appendChild(respLine);
    terminalInput.value = '';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    executeCommand(terminalInput.value);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* --------------------------------------------------------------------------
   7. COPY TO CLIPBOARD & TOAST
   -------------------------------------------------------------------------- */
window.copyToClipboard = function (text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied to clipboard: ${text}`);
    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `✓`;
      btnElement.style.color = '#10b981';
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        btnElement.style.color = '';
      }, 2000);
    }
  }).catch(() => {
    showToast('Failed to copy. Please copy manually.');
  });
};

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* --------------------------------------------------------------------------
   8. CONTACT FORM HANDLING
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;
    const subject = document.getElementById('msgSubject').value;
    const message = document.getElementById('msgContent').value;

    formStatus.style.color = '#10b981';
    formStatus.textContent = 'Preparing email dispatch... Opening your email client!';

    // Mailto fallback so message sends directly to Sradha's email
    const mailtoUrl = `mailto:sradhapanigrahi539@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;
      contactForm.reset();
      formStatus.textContent = 'Message template loaded in your mail client. Thank you for reaching out!';
    }, 800);
  });
}

/* --------------------------------------------------------------------------
   9. CURRENT YEAR AUTO-UPDATE
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
