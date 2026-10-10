import { turma } from '../services/calc.js';
import { esc } from '../utils/format.js';
import { SheetHead } from '../components/Sheet/SheetHead.js';

/* Criar / editar turma. Envio tratado em events/forms.js → turma. */
export function TurmaSheet(s) {
  const t = s.id ? turma(s.id) : null;
  if (s.id && !t) return null;
  return SheetHead(t ? 'Editar turma' : 'Nova turma')
    + `<form data-form="turma"><label class="f">Nome da turma<input id="i-nome" name="nome" required maxlength="80" placeholder="Ex.: 3º ano B — 2026" value="${esc(t ? t.nome : '')}" autofocus></label><button class="btn primary block">${t ? 'Salvar' : 'Criar turma'}</button>${t ? `<button type="button" class="btn danger block" data-act="del-turma" data-id="${t.id}">Excluir turma e todos os dados</button>` : ''}</form>`;
}
