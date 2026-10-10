/* Título de seção com ação opcional à direita. */
export const SectionHead = (title, actions = '') =>
  `<div class="sec-h"><h2>${title}</h2>${actions}</div>`;
