import { ui } from '../core/store.js';
import { aluno, turma, topicosDe } from '../services/calc.js';
import { esc, brl } from '../utils/format.js';
import { SheetHead } from '../components/Sheet/SheetHead.js';

const TopicoCheck = (t, checked) =>
  `<label class="check"><input type="checkbox" name="top" value="${t.id}" ${checked ? 'checked' : ''}>${esc(t.nome)} <span class="muted small num">· ${brl(t.teto)}</span></label>`;

/* Cadastrar alunos (vários de uma vez, um por linha) ou editar um aluno. Envio em events/forms.js → aluno. */
export function AlunoFormSheet(s) {
  const a = s.id ? aluno(s.id) : null;
  if (s.id && !a) return null;
  const tid = a ? a.turmaId : ui.turma;
  const tops = topicosDe(tid);

  const campos = a
    ? `<label class="f">Nome<input id="i-anome" name="nome" required maxlength="100" value="${esc(a.nome)}"></label>
      <label class="f">Contato do responsável (opcional)<input id="i-contato" name="contato" maxlength="100" value="${esc(a.contato || '')}"></label>`
    : '<label class="f">Nome do aluno<textarea id="i-anomes" name="nomes" required placeholder="Um nome por linha para cadastrar vários de uma vez" autofocus></textarea></label>';

  const topicos = tops.length
    ? `<div class="sec"><span class="eyebrow">Participa de</span><div class="checks">${tops.map(t => TopicoCheck(t, !a || (a.topicos || []).includes(t.id))).join('')}</div></div>`
    : '<p class="small muted" style="margin:0">Esta turma ainda não tem tópicos. Depois de criá-los, você pode incluir os alunos.</p>';

  return SheetHead(a ? 'Editar aluno' : 'Novo aluno', esc(turma(tid)?.nome || '')) + `<form data-form="aluno">
      ${campos}
      ${topicos}
      <button class="btn primary block">${a ? 'Salvar' : 'Cadastrar'}</button>
      ${a ? `<button type="button" class="btn danger block" data-act="del-aluno" data-id="${a.id}">Excluir aluno e seus pagamentos</button>` : ''}</form>`;
}
