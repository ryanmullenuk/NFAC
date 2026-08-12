const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.setProperty('--delay', `${Math.min(index % 4, 3) * 90}ms`);
  revealObserver.observe(element);
});

document.querySelectorAll('[data-form-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('[data-form-tab]').forEach((item) => {
      item.classList.toggle('active', item === tab);
      item.setAttribute('aria-selected', String(item === tab));
    });
    document.querySelectorAll('.contact-form').forEach((form) => form.classList.toggle('active', form.id === tab.dataset.formTab));
  });
});

const email = 'Newforestautocentre@hotmail.com';
document.querySelectorAll('[data-mail-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = [...new FormData(form).entries()].filter(([, value]) => String(value).trim());
    const body = fields.map(([key, value]) => `${key}: ${value}`).join('\n');
    const subject = `${form.dataset.subject}${fields.find(([key]) => key === 'Vehicle registration') ? ` – ${fields.find(([key]) => key === 'Vehicle registration')[1]}` : ''}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('Your email app is opening with the request ready to send.');
  });
});

const toast = document.querySelector('[data-toast]');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();
const preferredDate = document.querySelector('#mot-date');
preferredDate.min = new Date().toISOString().split('T')[0];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  document.querySelectorAll('[data-particles]').forEach(createParticles);
}

function createParticles(canvas) {
  const context = canvas.getContext('2d');
  let width;
  let height;
  let particles = [];
  let animationFrame;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(52, Math.floor(width / 24));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.35,
      vx: (Math.random() - 0.5) * 0.18,
      vy: Math.random() * -0.25 - 0.05,
      alpha: Math.random() * 0.4 + 0.08
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.y < -4) particle.y = height + 4;
      if (particle.x < -4) particle.x = width + 4;
      if (particle.x > width + 4) particle.x = -4;
      context.beginPath();
      context.fillStyle = `rgba(244, 191, 58, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationFrame);
    else draw();
  });
}
