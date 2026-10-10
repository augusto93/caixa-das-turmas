import { S, app } from '../core/store.js';
import { aluno, turma, topico, pago, EPS } from '../services/calc.js';
import { esc, brl, fdata, pct } from '../utils/format.js';
import { SheetHead } from '../components/Sheet/SheetHead.js';
import { EmptyState, ProgressBar, Pill, PrazoPill, LineItem } from '../components/ui/index.js';

function TopicoDoAluno(a, t) {
  const p = pago(a.id, t.id), teto = Number(t.teto) || 0, f = Math.max(0, teto - p);
  const quitado = f <= EPS;
  return `<div class="card est"><div class="est-h"><b style="font-family:var(--f-display);font-size:1.05rem">${esc(t.nome)}</b>${quitado ? Pill('Quitado', 'ok') : PrazoPill(t.prazo)}</div>${ProgressBar(pct(p, teto), quitado)}<div class="small num">Pago <b>${brl(p)}</b> de ${brl(teto)}${!quitado ? ` · falta <b>${brl(f)}</b>` : ''}</div>${app.ro || quitado ? '' : `<button class="btn primary" data-act="pagar" data-topico="${t.id}">Registrar pagamento</button>`}</div>`;
}

const PagamentoItem = p => LineItem({
  title: esc(topico(p.topicoId)?.nome || 'Tópico removido'),
  meta: `${fdata(p.data)}${p.forma ? ' · ' + esc(p.forma) : ''}${p.obs ? ' · ' + esc(p.obs) : ''}`,
  valor: p.valor, kind: 'pos', col: 'pagamentos', id: p.id,
});

/* Ficha do aluno: situação por tópico e histórico de pagamentos. É uma sheet de visualização (atualiza ao vivo). */
export function AlunoSheet(s) {
  const a = aluno(s.id);
  if (!a) return null;
  const tops = (a.topicos || []).map(topico).filter(Boolean);
  const pgs = S.pagamentos.filter(p => p.alunoId === a.id)
    .sort((x, y) => (y.data || '').localeCompare(x.data || '') || (y.atualizadoEm || 0) - (x.atualizadoEm || 0));

  let h = SheetHead(esc(a.nome), esc(turma(a.turmaId)?.nome || ''));
  if (a.contato) h += `<div class="small muted">Contato: ${esc(a.contato)}</div>`;
  if (!tops.length) h += EmptyState({ text: 'Este aluno não participa de nenhum tópico.' });
  h += tops.map(t => TopicoDoAluno(a, t)).join('');

  h += '<div class="sec"><h2>Histórico</h2>';
  if (!pgs.length) h += '<div class="small muted">Nenhum pagamento registrado.</div>';
  else h += `<div class="card">${pgs.map(PagamentoItem).join('')}</div>`;
  h += '</div>';

  if (!app.ro) h += `<button class="btn block" data-act="editar-aluno" data-id="${a.id}">Editar aluno</button>`;
  return h;
}
