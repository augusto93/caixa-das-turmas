import { app, ui } from '../../core/store.js';
import { $ } from '../../utils/dom.js';

const svg = paths => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

/* As abas e seus ícones. `id` precisa bater com as chaves de VIEWS em core/render.js. */
export const TABS = [
  { id: 'turmas', label: 'Turmas', icon: svg('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c2.4-.2 4 1.3 4.5 4.3"/>') },
  { id: 'saldo', label: 'Saldo', icon: svg('<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path d="M15.5 14.5h2.5"/><path d="M7 6V4.5h10V6"/>') },
  { id: 'est', label: 'Estimativas', icon: svg('<path d="M4 20V10"/><path d="M10 20V5"/><path d="M16 20v-7"/><path d="M21 20H3"/>') },
];

export const TabBar = () => `<nav class="tabs" id="tabs" aria-label="Telas" hidden><div class="in">
  ${TABS.map(t => `<button data-act="tab" data-tab="${t.id}">${t.icon}${t.label}</button>`).join('\n  ')}
</div></nav>`;

export function updateTabBar() {
  $('#tabs').hidden = app.mode !== 'sync';
  document.querySelectorAll('nav.tabs button').forEach(b => {
    if (b.dataset.tab === ui.tab) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
}
