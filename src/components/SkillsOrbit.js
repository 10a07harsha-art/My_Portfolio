import { skills } from '../data.js';

export function createSkillsSection() {
  const section = document.createElement('section');
  section.className = 'section skills';
  section.id = 'skills';
  section.setAttribute('aria-labelledby', 'skills-title');
  section.innerHTML = `
    <div class="section__inner">
      <div class="section-heading reveal">
        <div class="eyebrow">Skills orbit</div>
        <h2 id="skills-title">Capabilities orbiting a product core</h2>
      </div>
      <div class="skills__stage glass-panel reveal">
        <div class="skills__core" aria-hidden="true">
          <span>Harsha</span>
          <small>Build</small>
        </div>
        <div class="skills__orbit">
          ${skills
            .map(
              (skill, index) => `
                <span class="skill-pill" style="--i:${index};">${skill}</span>
              `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
  return section;
}
