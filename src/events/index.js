/* Delegação de eventos: um listener por tipo no document, despachando para actions.js e forms.js.
   Assim os componentes só precisam declarar data-act / data-form / id no HTML. */
import { app, ui, saveUi } from '../core/store.js';
import { render, scheduleRender } from '../core/render.js';
import { $ } from '../utils/dom.js';
import { aluno, topico, faltaNoTopico } from '../services/calc.js';
import { closeSheet } from '../components/Sheet/Sheet.js';
import { AlunosList } from '../views/Turmas/AlunosList.js';
import { topicoOptions } from '../sheets/DespesaSheet.js';
import { placeholderValor } from '../sheets/PagamentoSheet.js';
import { actions } from './actions.js';
import { forms } from './forms.js';

function onClick(e) {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  // Clique no fundo escuro fecha a sheet; clique dentro dela não.
  if (act === 'overlay') { if (e.target === el) closeSheet(); return; }
  if (act === 'editar-topico' && app.ro) return;
  actions[act]?.(el, e);
}

function onInput(e) {
  if (e.target.id === 'busca') {
    ui.busca = e.target.value;
    const l = $('#alunos-list');
    if (l) l.innerHTML = AlunosList(ui.turma);
  }
}

/* Campos que atualizam outra parte da tela ao mudar. */
const CHANGES = {
  'f-turma': v => { ui.filtro = v; ui.filtroTop = ''; saveUi(); render(); },
  'f-top': v => { ui.filtroTop = v; render(); },
  'i-dturma': v => { const s = $('#i-dtop'); s.innerHTML = topicoOptions(v); s.disabled = !v; },
  'i-ptop': v => {
    const a = aluno(ui.sheet.aluno);
    $('#i-pval').placeholder = placeholderValor(faltaNoTopico(a, topico(v)));
    ui.sheet.topico = v;
  },
};

function onChange(e) {
  CHANGES[e.target.id]?.(e.target.value);
}

function onKeydown(e) {
  if (e.key === 'Escape' && ui.sheet) closeSheet();
}

function onSubmit(e) {
  e.preventDefault();
  const f = e.target, handler = forms[f.dataset.form];
  if (!handler) return;
  const btn = f.querySelector('button.primary');
  if (btn) btn.disabled = true;
  const done = () => { if (btn) btn.disabled = false; };
  const p = handler(new FormData(f), ui.sheet);
  if (p) p.finally(done);
  else done();
}

export function bindEvents() {
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('submit', onSubmit);
  window.addEventListener('online', scheduleRender);
  window.addEventListener('offline', scheduleRender);
}
