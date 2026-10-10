import { statsTurma, alunosDe, topicosDe } from '../../services/calc.js';
import { esc, brl, pct, plural } from '../../utils/format.js';
import { ProgressBar } from '../../components/ui/index.js';

/* Linha da lista de turmas com progresso de arrecadação. */
export function TurmaRow(t) {
  const s = statsTurma(t.id);
  const na = alunosDe(t.id).length, nt = topicosDe(t.id).length;
  return `<button class="row" data-act="abrir-turma" data-id="${t.id}"><div class="grow"><div class="name">${esc(t.nome)}</div><div class="small muted">${plural(na, 'aluno')} · ${plural(nt, 'tópico')}</div>${ProgressBar(pct(s.arrec, s.meta), s.meta && s.falta <= 0)}<div class="small num"><b>${brl(s.arrec)}</b> <span class="muted">de ${brl(s.meta)}</span></div></div><span class="chev">›</span></button>`;
}
