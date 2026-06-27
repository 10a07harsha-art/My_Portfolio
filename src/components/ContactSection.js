import { profile } from '../data.js';

export function createContactSection() {
  const section = document.createElement('section');
  section.className = 'section contact';
  section.id = 'contact';
  section.setAttribute('aria-labelledby', 'contact-title');
  section.innerHTML = `
    <div class="section__inner">
      <div class="section-heading reveal">
        <div class="eyebrow">Contact</div>
        <h2 id="contact-title">Let’s build something cinematic and useful</h2>
      </div>
      <div class="contact__panel glass-panel reveal">
        <p class="contact__lead">Open channels for collaboration, hiring conversations, and project work.</p>
        <div class="contact__actions">
          <a class="btn btn--gold magnetic" href="mailto:${profile.email}">Email</a>
          <a class="btn btn--glass magnetic" href="${profile.github}" target="_blank" rel="noreferrer">GitHub</a>
          <a class="btn btn--glass magnetic" href="${profile.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
          <button class="btn btn--glass magnetic" data-download-resume>${profile.resumeLabel}</button>
        </div>
        <div class="contact__meta">
          <span>${profile.email}</span>
          <span>Available for full stack and front-end focused work</span>
        </div>
      </div>
    </div>
  `;
  return section;
}
