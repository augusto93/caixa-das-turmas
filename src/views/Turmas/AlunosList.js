import { ui } from '../../core/store.js';
import { alunosDe, topico, pago, devido, EPS } from '../../services/calc.js';
import { esc, brl } from '../../utils/format.js';
import { Pill } from '../../components/ui/index.js';

function AlunoRow(a) {
  let falta = 0;
  const pills = (a.topicos || []).map(id => {
    const tp = topico(id);
    if (!tp) return '';
    const p = pago(a.id, id), teto = devido(a, tp), f = Math.max(0, teto - p);
    falta += f;
    const variant = f <= EPS ? 'ok num' : p > 0 ? 'warn num' : 'num';
    return Pill(`${esc(tp.nome)} ${f <= EPS ? '✓ quitado' : brl(p) + ' / ' + brl(teto)}`, variant);
  }).join('');
  const status = falta > EPS ? `<span class="muted">falta</span><br><b>${brl(falta)}</b>` : '<span class="pos">Em dia</span>';
  return `<button class="row" data-act="abrir-aluno" data-id="${a.id}"><div class="grow"><div class="name">${esc(a.nome)}</div><div class="pills">${pills || Pill('Sem tópicos')}</div></div><div class="small num" style="text-align:right">${status}</div></button>`;
}

/* Lista de alunos da turma filtrada pela busca. Redesenhada sozinha ao digitar (events/index.js). */
export function AlunosList(tid) {
  const q = ui.busca.trim().toLowerCase();
  const als = alunosDe(tid).filter(a => !q || (a.nome || '').toLowerCase().includes(q));
  if (!als.length) return '<div class="muted small">Nenhum aluno encontrado.</div>';
  return als.map(AlunoRow).join('');
}
