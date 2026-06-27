export function createModal() {
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="project-modal__backdrop" data-close-modal></div>
    <div class="project-modal__dialog" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="project-modal-title">
      <button class="project-modal__close" aria-label="Close project details" data-close-modal>×</button>
      <div class="project-modal__content" data-modal-content></div>
    </div>
  `;
  return modal;
}
