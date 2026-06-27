import { aboutPoints } from '../data.js';

export function createAboutSection() {
  const section = document.createElement('section');
  section.className = 'section about';
  section.id = 'about';
  section.setAttribute('aria-labelledby', 'about-title');
  section.innerHTML = `
    <div class="section__inner">
      <div class="section-heading reveal">
        <div class="eyebrow">About</div>
        <h2 id="about-title">Professional profile with a product mindset</h2>
      </div>
      <div class="about__grid">
        <div class="about__story glass-panel reveal">
          <p>
            Harsha P builds interfaces that feel deliberate, fast, and premium. The work blends structure, motion, and usability with a strong sense of visual narrative.
          </p>
          <p>
            The emphasis is on full stack delivery, recruitment and placement workflows, and polished front-end storytelling that still respects accessibility and performance.
          </p>
          <div class="about__points">
            ${aboutPoints
              .map(
                (item) => `
                  <article class="about__point">
                    <span>${item.label}</span>
                    <strong>${item.value}</strong>
                    <p>${item.detail}</p>
                  </article>
                `
              )
              .join('')}
          </div>
          <div class="about__timeline">
            <h3>Education and experience</h3>
            <ol>
              <li><span>Foundation</span><p>Programming, web basics, and design curiosity shaped the early path.</p></li>
              <li><span>Projects</span><p>Recruitment tools, resume systems, and student platforms became the main focus.</p></li>
              <li><span>Delivery</span><p>Modern front-end systems, clean UI state, and smooth interactions took priority.</p></li>
            </ol>
            <div class="about__extra">
              <h4>Internships</h4>
              <p>Java programming, graphic design, and applied product thinking.</p>
            </div>
          </div>
        </div>
        <div class="about__resume glass-panel reveal">
          <img src="/assets/resume-image.png" alt="Resume preview for Harsha P" />
        </div>
      </div>
    </div>
  `;
  return section;
}
