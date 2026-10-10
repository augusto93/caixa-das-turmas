/* Caixa tracejada para listas vazias. */
export const EmptyState = ({ title = '', text = '', actions = '' } = {}) =>
  `<div class="empty">${title ? `<strong>${title}</strong>` : ''}<span>${text}</span>${actions}</div>`;
