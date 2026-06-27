import { certifications } from '../data.js';

export function createCertificationsSection() {
  const section = document.createElement('section');
  section.className = 'section certifications';
  section.id = 'certifications';
  section.setAttribute('aria-labelledby', 'cert-title');
  section.innerHTML = `
    <div class="section__inner">
      <div class="section-heading reveal">
        <div class="eyebrow">Certifications</div>
        <h2 id="cert-title">Professional focus areas and verification themes</h2>
      </div>
      <div class="certifications__grid">
        ${certifications
          .map(
            (cert) => `
              <article class="cert-card glass-panel reveal">
                <span class="cert-card__issuer">${cert.issuer}</span>
                <h3>${cert.title}</h3>
                <p>${cert.body}</p>
              </article>
            `
          )
          .join('')}
      </div>
    </div>
  `;
  return section;
}
