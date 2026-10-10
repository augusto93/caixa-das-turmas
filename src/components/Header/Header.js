import { app } from '../../core/store.js';
import { $ } from '../../utils/dom.js';

export const Header = () => `<header class="top"><div class="top-in">
  <div class="brand"><span class="brand-mark">R$</span>Caixa das Turmas</div>
  <div class="userbox"><div class="sync" id="sync"><span class="dot"></span>Conectando…</div><button class="btn sm" id="sair" data-act="sair" hidden>Sair</button></div>
</div></header>`;

function syncStatus() {
  if (app.mode === 'sync') return navigator.onLine ? '<span class="dot on"></span>Sincronizado' : '<span class="dot"></span>Offline · salva ao reconectar';
  if (app.mode === 'login' || app.mode === 'negado') return '';
  return '<span class="dot"></span>Conectando…';
}

export function updateHeader() {
  $('#sync').innerHTML = syncStatus();
  $('#sair').hidden = !app.me;
}
