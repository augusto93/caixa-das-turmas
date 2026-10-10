/* Título da sheet com botão de fechar. */
export const SheetHead = (title, sub) =>
  `<div class="sheet-h"><div>${sub ? `<div class="eyebrow">${sub}</div>` : ''}<h3>${title}</h3></div><button class="close" data-act="close" aria-label="Fechar">✕</button></div>`;
