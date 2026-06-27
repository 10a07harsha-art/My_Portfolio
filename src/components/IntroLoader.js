import { brandMarkUrl } from '../assets.js';

export function createIntroLoader() {
  const loader = document.createElement('div');
  loader.className = 'intro-loader';
  loader.setAttribute('aria-live', 'polite');
  loader.innerHTML = `
    <div class="intro-loader__ring" aria-hidden="true"></div>
    <div class="intro-loader__brand">
      <img src="${brandMarkUrl}" alt="" aria-hidden="true" />
      <span>Harsha P</span>
    </div>
    <div class="intro-loader__progress">
      <div class="intro-loader__bar"><span></span></div>
      <div class="intro-loader__meta">
        <span>Initializing experience</span>
        <span data-loader-percent>0%</span>
      </div>
    </div>
  `;
  return loader;
}
