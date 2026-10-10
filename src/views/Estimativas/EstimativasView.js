import { S, ui } from '../../core/store.js';
import { statsTop, alunoQuitado } from '../../services/calc.js';
import { brl } from '../../utils/format.js';
import { PageHead, EmptyState, FiltroSelect } from '../../components/ui/index.js';
import { TopicoEstimativa } from './TopicoEstimativa.js';

const StatTile = (label, value, variant = '') =>
  `<div class="tile"><span class="eyebrow">${label}</span><span class="v${variant ? ' ' + variant : ''} num">${value}</span></div>`;

/* Aba Estimativas: meta × arrecadado por tópico e sugestão de valor mensal. */
export function EstimativasView() {
  const f = ui.filtro;
  const ts = S.turmas.filter(t => !f || t.id === f);
  const tops = S.topicos.filter(t => ts.some(x => x.id === t.turmaId)).sort((a, b) => (a.prazo || '9').localeCompare(b.prazo || '9'));
  let meta = 0, arrec = 0, falta = 0;
  tops.forEach(t => { const s = statsTop(t); meta += s.meta; arrec += s.arrec; falta += s.falta; });
  const als = S.alunos.filter(a => ts.some(x => x.id === a.turmaId) && (a.topicos || []).length);
  const q = als.filter(alunoQuitado).length;

  const h = PageHead({ eyebrow: 'Previsão', title: 'Estimativas' }) + FiltroSelect(false);
  if (!tops.length) return h + EmptyState({ text: 'As estimativas aparecem quando houver turmas com tópicos e alunos cadastrados.' });

  return h
    + `<div class="tiles">${StatTile('Meta total', brl(meta))}${StatTile('Arrecadado', brl(arrec), 'ok')}${StatTile('Falta receber', brl(falta), 'warn')}${StatTile('Alunos quitados', `${q} de ${als.length}`)}</div>`
    + `<section class="sec"><h2>Por tópico</h2>${tops.map(TopicoEstimativa).join('')}</section>`;
}
