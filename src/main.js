import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './style.css';
import { brandMarkUrl, noiseUrl, heroOceanUrl, resumeImageUrl } from './assets.js';
import { profile } from './data.js';
import { createIntroLoader } from './components/IntroLoader.js';
import { createHeroSection } from './components/HeroSection.js';
import { createAboutSection } from './components/AboutSection.js';
import { createSkillsSection } from './components/SkillsOrbit.js';
import { createProjectsSection } from './components/ProjectsSection.js';
import { createTimelineSection } from './components/TimelineSection.js';
import { createCertificationsSection } from './components/CertificationsSection.js';
import { createContactSection } from './components/ContactSection.js';
import { createModal } from './components/Modal.js';
import { renderGitHubRepos } from './components/GitHubFeed.js';
import { initThreeScene, setScrollProgress } from './threeScene.js';

gsap.registerPlugin(ScrollTrigger);

const app = document.getElementById('app');
const shell = document.createElement('div');
shell.className = 'app-shell';

const sceneLayer = document.createElement('div');
sceneLayer.className = 'scene-layer';
sceneLayer.innerHTML = `
  <canvas id="three-canvas" aria-hidden="true"></canvas>
  <div data-hotspot-tooltip aria-hidden="true"></div>
`;

document.documentElement.style.setProperty('--noise-image', `url("${noiseUrl}")`);
document.documentElement.style.setProperty('--hero-ocean-image', `url("${heroOceanUrl}")`);

const loader = createIntroLoader();
const modal = createModal();

const hero = createHeroSection();
const about = createAboutSection();
const skills = createSkillsSection();
const projectsSection = createProjectsSection();
const timeline = createTimelineSection();
const certifications = createCertificationsSection();
const contact = createContactSection();

const content = document.createElement('main');
content.id = 'content';
content.append(hero, about, skills, projectsSection, timeline, certifications, contact);

const nav = document.createElement('header');
nav.className = 'topbar';
nav.innerHTML = `
  <div class="topbar__brand">
    <img src="${brandMarkUrl}" alt="" aria-hidden="true" />
    <span>${profile.name}</span>
  </div>
  <nav class="topbar__nav" aria-label="Primary">
    <a href="#about" data-scroll-to="#about">About</a>
    <a href="#projects" data-scroll-to="#projects">Projects</a>
    <a href="#contact" data-scroll-to="#contact">Contact</a>
  </nav>
`;

shell.append(nav, content, modal);
app.append(sceneLayer, shell, loader);

const lenis = new Lenis({
  duration: 0.85,
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 1
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (target) {
    lenis.scrollTo(target, { offset: -96, immediate: false });
  }
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-scroll-to]');
  if (trigger) {
    event.preventDefault();
    scrollToTarget(trigger.getAttribute('data-scroll-to'));
  }

  if (event.target.closest('[data-download-resume]')) {
    const anchor = document.createElement('a');
    anchor.href = resumeImageUrl;
    anchor.download = 'Harsha-P-Resume.png';
    anchor.click();
  }
});

const modalContent = modal.querySelector('[data-modal-content]');
const modalDialog = modal.querySelector('.project-modal__dialog');
const closeTargets = modal.querySelectorAll('[data-close-modal]');

function closeModal() {
  modal.hidden = true;
  modalContent.innerHTML = '';
  document.body.style.overflow = '';
}

function openModal(data) {
  modal.hidden = false;
  modalContent.innerHTML = `
    <div class="eyebrow">${data.category}</div>
    <h3 id="project-modal-title">${data.title}</h3>
    <p class="hero__description">${data.summary}</p>
    <p>${data.details}</p>
    <ul>${data.stack.map((item) => `<li>${item}</li>`).join('')}</ul>
    <a class="btn btn--gold" href="${data.github}" target="_blank" rel="noreferrer">Open GitHub</a>
  `;
  document.body.style.overflow = 'hidden';
  modalDialog?.focus?.();
}

closeTargets.forEach((target) => target.addEventListener('click', closeModal));
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

const canvas = document.getElementById('three-canvas');
initThreeScene({
  canvasElement: canvas,
  onProjectOpen: openModal
});

const githubList = projectsSection.querySelector('[data-github-list]');

async function loadGitHub() {
  try {
    const response = await fetch(`https://api.github.com/users/10a07harsha-art/repos?sort=updated&per_page=6`);
    if (!response.ok) throw new Error('GitHub request failed');
    const data = await response.json();
    renderGitHubRepos(githubList, data);
  } catch (error) {
    renderGitHubRepos(githubList, []);
  }
}

loadGitHub();

function attachRevealAnimations() {
  gsap.utils.toArray('.reveal').forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 84%'
        }
      }
    );
  });
}

attachRevealAnimations();

const heroMotion = gsap.timeline({ delay: 0.15 });
heroMotion
  .from(hero.querySelector('.eyebrow'), { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' })
  .from(hero.querySelector('.hero__title'), { opacity: 0, y: 26, duration: 0.8, ease: 'power3.out' }, '<0.05')
  .from(hero.querySelector('.hero__subtitle'), { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, '<0.1')
  .from(hero.querySelector('.hero__description'), { opacity: 0, y: 18, duration: 0.8, ease: 'power3.out' }, '<0.08')
  .from(hero.querySelector('.hero__actions'), { opacity: 0, y: 22, duration: 0.75, ease: 'power3.out' }, '<0.08');

const sections = gsap.utils.toArray('.section');
sections.forEach((section, index) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onUpdate: (self) => {
      const absoluteProgress = (index + self.progress) / sections.length;
      setScrollProgress(absoluteProgress);
    }
  });
});

const loaderBar = loader.querySelector('.intro-loader__bar span');
const loaderPercent = loader.querySelector('[data-loader-percent]');
const loaderState = { value: 0 };

gsap.to(loaderState, {
  value: 100,
  duration: 2.1,
  ease: 'power2.out',
  onUpdate: () => {
    const v = Math.round(loaderState.value);
    loaderBar.style.width = `${v}%`;
    loaderPercent.textContent = `${v}%`;
  },
  onComplete: () => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      onComplete: () => loader.remove()
    });
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

document.querySelectorAll('.magnetic').forEach((el) => {
  const strength = 0.12;
  el.addEventListener('pointermove', (event) => {
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: dx * strength,
      y: dy * strength,
      duration: 0.35,
      ease: 'power3.out'
    });
  });
  el.addEventListener('pointerleave', () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'power3.out'
    });
  });
});

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
