import { profile } from '../data.js';

export function createHeroSection() {
  const section = document.createElement('section');
  section.className = 'section hero';
  section.id = 'hero';
  section.setAttribute('aria-labelledby', 'hero-title');
  section.innerHTML = `
    <div class="hero__bg" aria-hidden="true"></div>
    <div class="section__inner hero__inner">
      <div class="hero__copy">
        <div class="eyebrow">BMW-inspired storytelling</div>
        <p class="hero__intro">Luxury digital presence for modern products and services.</p>
        <h1 id="hero-title" class="hero__title">Harsha P</h1>
        <p class="hero__subtitle">${profile.role}</p>
        <p class="hero__description">
          I design and build cinematic web experiences with strong motion, clean architecture, and performance-minded execution.
        </p>
        <div class="hero__actions">
          <button class="btn btn--gold magnetic" data-scroll-to="#projects">View Projects</button>
          <button class="btn btn--glass magnetic" data-scroll-to="#contact">Contact Me</button>
        </div>
      </div>
      <div class="hero__stats glass-panel">
        <div>
          <span class="stat__label">Focus</span>
          <strong>Full Stack</strong>
        </div>
        <div>
          <span class="stat__label">Motion</span>
          <strong>GSAP + Three.js</strong>
        </div>
        <div>
          <span class="stat__label">Style</span>
          <strong>Black & Gold</strong>
        </div>
      </div>
      <button class="scroll-indicator magnetic" data-scroll-to="#about" aria-label="Scroll to about section">
        <span aria-hidden="true"></span>
      </button>
    </div>
  `;
  return section;
}
