// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

// Get navigation elements
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Add scrolled class to nav on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ===================================
// SMOOTH SCROLL WITH OFFSET
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const offsetTop = target.offsetTop - 80; // 80px offset for fixed nav
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===================================
// INTERSECTION OBSERVER - FADE IN ANIMATIONS
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections for fade-in effect
const sections = document.querySelectorAll('section');
sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
  observer.observe(section);
});

// ===================================
// SKILL BARS ANIMATION
// ===================================

const skillsSection = document.querySelector('.skills');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimated) {
      animateSkillBars();
      skillsAnimated = true;
    }
  });
}, { threshold: 0.3 });

if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  skillBars.forEach((bar, index) => {
    setTimeout(() => {
      const progress = bar.getAttribute('data-progress');
      bar.style.width = progress + '%';
    }, index * 100); // Stagger animation
  });
}

// ===================================
// TIMELINE ITEMS STAGGER ANIMATION
// ===================================

const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-30px)';
  item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  item.style.transitionDelay = `${index * 0.2}s`;
});

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
    }
  });
}, { threshold: 0.2 });

timelineItems.forEach(item => {
  timelineObserver.observe(item);
});

// ===================================
// PROJECT CARDS STAGGER ANIMATION
// ===================================

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  card.style.transitionDelay = `${index * 0.15}s`;
});

const projectsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

projectCards.forEach(card => {
  projectsObserver.observe(card);
});

// ===================================
// PARALLAX EFFECT ON HERO
// ===================================

const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.7;
  }
});

// ===================================
// ACTIVE NAV LINK BASED ON SCROLL POSITION
// ===================================

const allSections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.pageYOffset;

  allSections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      correspondingLink?.classList.add('active');
    } else {
      correspondingLink?.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', highlightNav);

// ===================================
// CURSOR FOLLOW EFFECT (OPTIONAL - DESKTOP ONLY)
// ===================================

const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Add CSS for custom cursor
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  .custom-cursor {
    width: 20px;
    height: 20px;
    border: 2px solid #6366f1;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    transition: transform 0.15s ease-out, opacity 0.15s ease-out;
    z-index: 9999;
    opacity: 0;
  }
  
  @media (max-width: 968px) {
    .custom-cursor {
      display: none;
    }
  }
`;
document.head.appendChild(cursorStyle);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
});

// Smooth cursor animation
function animateCursor() {
  const diffX = mouseX - cursorX;
  const diffY = mouseY - cursorY;
  
  cursorX += diffX * 0.1;
  cursorY += diffY * 0.1;
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Scale cursor on hover over interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-card, .skill-category');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(1.5)';
    cursor.style.borderColor = '#ec4899';
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.borderColor = '#6366f1';
  });
});

// ===================================
// TYPING EFFECT FOR HERO TITLE (OPTIONAL)
// ===================================

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const originalText = heroTitle.textContent;
  heroTitle.textContent = '';
  
  let charIndex = 0;
  
  function typeWriter() {
    if (charIndex < originalText.length) {
      heroTitle.textContent += originalText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 80);
    }
  }
  
  // Start typing effect after page loads
  setTimeout(typeWriter, 800);
}

// ===================================
// ADD PARTICLE EFFECT TO HERO (OPTIONAL)
// ===================================

function createParticles() {
  const hero = document.querySelector('.hero');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation duration
    particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 5) + 's';
    
    hero.appendChild(particle);
  }
}

// Add particle CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  .particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: rgba(99, 102, 241, 0.5);
    border-radius: 50%;
    animation: float-particle linear infinite;
    pointer-events: none;
  }
  
  @keyframes float-particle {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) translateX(50px);
      opacity: 0;
    }
  }
  
  @media (max-width: 968px) {
    .particle {
      display: none;
    }
  }
`;
document.head.appendChild(particleStyle);

createParticles();

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

const progressBar = document.createElement('div');
progressBar.classList.add('scroll-progress');
document.body.appendChild(progressBar);

const progressStyle = document.createElement('style');
progressStyle.textContent = `
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    z-index: 9999;
    transition: width 0.1s ease-out;
  }
`;
document.head.appendChild(progressStyle);

window.addEventListener('scroll', () => {
  const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrollPercentage + '%';
});

// ===================================
// CONSOLE MESSAGE (EASTER EGG)
// ===================================

console.log(
  '%c👋 Hey there! ',
  'color: #6366f1; font-size: 24px; font-weight: bold;'
);
console.log(
  '%cLike what you see? Let\'s connect! ',
  'color: #ec4899; font-size: 16px;'
);
console.log(
  '%c📧 morvay04@gmail.com',
  'color: #14b8a6; font-size: 14px;'
);

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Lazy load images when they come into view
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));

// ===================================
// INITIALIZE EVERYTHING ON LOAD
// ===================================

window.addEventListener('load', () => {
  // Remove initial opacity from hero to trigger animations
  document.querySelector('.hero').style.opacity = '1';
  
  // Log page load time
  console.log('%c⚡ Page loaded in ' + (performance.now() / 1000).toFixed(2) + 's', 'color: #14b8a6; font-size: 12px;');
});

// ===================================
// THEME TOGGLE
// ===================================

const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
  body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  
  // Save preference
  const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  
  // Add click animation
  themeToggle.style.transform = 'scale(0.9)';
  setTimeout(() => {
    themeToggle.style.transform = 'scale(1)';
  }, 150);
});