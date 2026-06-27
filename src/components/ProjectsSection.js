import { projects } from '../data.js';

export function createProjectsSection() {
  const section = document.createElement('section');
  section.className = 'section projects';
  section.id = 'projects';
  section.setAttribute('aria-labelledby', 'projects-title');
  section.innerHTML = `
    <div class="section__inner">
      <div class="section-heading reveal">
        <div class="eyebrow">Project showcase</div>
        <h2 id="projects-title">Selected systems and experiences</h2>
      </div>
      <div class="projects__grid">
        ${projects
          .map(
            (project) => `
              <article class="project-card glass-panel reveal" data-project-id="${project.id}">
                <div class="project-card__top">
                  <span class="project-card__category">${project.category}</span>
                  <span class="project-card__accent ${project.accent}"></span>
                </div>
                <h3>${project.name}</h3>
                <p>${project.summary}</p>
                <ul class="project-card__stack">
                  ${project.stack.map((item) => `<li>${item}</li>`).join('')}
                </ul>
                <div class="project-card__actions">
                  <button class="text-button" data-open-project="${project.id}">View details</button>
                  <a href="${project.github}" target="_blank" rel="noreferrer">GitHub</a>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
      <div class="github-strip glass-panel reveal">
        <div class="github-strip__heading">
          <span class="eyebrow">GitHub integration</span>
          <h3>Latest repositories</h3>
        </div>
        <div class="github-strip__list" data-github-list>
          <div class="loading-line"></div>
          <div class="loading-line"></div>
          <div class="loading-line"></div>
        </div>
      </div>
    </div>
  `;
  return section;
}
