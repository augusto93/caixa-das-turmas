/* Cabeçalho de tela: rótulo pequeno, título e ações à direita. */
export const PageHead = ({ eyebrow, title, actions = '' }) =>
  `<div class="pagehead"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1></div>${actions}</div>`;
