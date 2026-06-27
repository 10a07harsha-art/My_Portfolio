import { timeline } from '../data.js';

export function createTimelineSection() {
  const section = document.createElement('section');
  section.className = 'section timeline';
  section.id = 'experience';
  section.setAttribute('aria-labelledby', 'timeline-title');
  section.innerHTML = `
    <div class="section__inner">
      <div class="section-heading reveal">
        <div class="eyebrow">Experience timeline</div>
        <h2 id="timeline-title">Progression through build quality and systems thinking</h2>
      </div>
      <div class="timeline__rail glass-panel reveal">
        ${timeline
          .map(
            (entry) => `
              <article class="timeline__item">
                <span class="timeline__year">${entry.year}</span>
                <div>
                  <h3>${entry.title}</h3>
                  <p>${entry.text}</p>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
    </div>
  `;
  return section;
}
