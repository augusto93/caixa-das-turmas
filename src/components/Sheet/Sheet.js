import { ui } from '../../core/store.js';
import { $ } from '../../utils/dom.js';
import { SHEETS, VIEW_SHEETS } from '../../sheets/index.js';

/* Painel inferior (bottom sheet) usado pelos formulários e pela ficha do aluno.
   O conteúdo vem de sheets/index.js, pelo `type` do objeto aberto. */

export function openSheet(s) {
  ui.sheet = s;
  renderSheet(true);
}

export function closeSheet() {
  ui.sheet = null;
  renderSheet(true);
}

/* force=false vem do render geral: só redesenha sheets de visualização (não apaga o que o usuário digitou num formulário). */
export function renderSheet(force) {
  const root = $('#sheet-root');
  const s = ui.sheet;
  if (!s) { root.innerHTML = ''; return; }
  if (!force && !VIEW_SHEETS.includes(s.type)) return;
  const tpl = SHEETS[s.type];
  const html = tpl ? tpl(s) : null;
  if (html === null) { ui.sheet = null; root.innerHTML = ''; return; }
  const sc = root.querySelector('.sheet')?.scrollTop || 0;
  root.innerHTML = `<div class="overlay" data-act="overlay"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  if (!force) root.querySelector('.sheet').scrollTop = sc;
  if (force) {
    const fi = root.querySelector('[autofocus]');
    if (fi && window.matchMedia('(min-width:700px)').matches) fi.focus();
  }
}
