import { S, app, ui } from '../../core/store.js';
import { turma, topico } from '../../services/calc.js';
import { esc, brl, fdata } from '../../utils/format.js';
import { PageHead, EmptyState, FiltroSelect, LineItem, ProgressBar } from '../../components/ui/index.js';

const soma = lista => lista.reduce((s, x) => s + (Number(x.valor) || 0), 0);

const SaldoCard = ({ arrec, gasto, porTurma }) =>
  `<div class="saldo"><div><div class="lbl">Saldo disponível</div><div class="big num">${brl(arrec - gasto)}</div></div><div class="split"><div><span class="lbl">Arrecadado</span><span class="v num">${brl(arrec)}</span></div><div><span class="lbl">${porTurma ? 'Despesas da turma' : 'Despesas'}</span><span class="v num">− ${brl(gasto)}</span></div></div></div>`;

function GastosPorCategoria(dp) {
  const cat = {};
  dp.forEach(d => (cat[d.categoria || 'Outros'] = (cat[d.categoria || 'Outros'] || 0) + (Number(d.valor) || 0)));
  const mx = Math.max(...Object.values(cat));
  const linhas = Object.entries(cat).sort((a, b) => b[1] - a[1])
    .map(([c, v]) => `<div class="cat"><span>${esc(c)}</span>${ProgressBar(Math.max(3, v / mx * 100))}<span class="num">${brl(v)}</span></div>`).join('');
  return `<section class="sec"><h2>Gastos por categoria</h2><div class="card" style="display:flex;flex-direction:column;gap:10px">${linhas}</div></section>`;
}

function DespesaItem(d, porTurma) {
  const t = turma(d.turmaId), tp = topico(d.topicoId);
  const meta = `${fdata(d.data)} · ${esc(d.categoria || 'Outros')}${!porTurma ? ' · ' + (t ? esc(t.nome) : 'Todas as turmas') : ''}${tp ? ' · ' + esc(tp.nome) : ''}`;
  return LineItem({ title: esc(d.descricao || d.categoria), meta, valor: d.valor, kind: 'neg', col: 'despesas', id: d.id, editAct: 'editar-despesa' });
}

/* Aba Saldo: arrecadado − despesas, com filtro por turma/tópico. */
export function SaldoView() {
  const f = ui.filtro, ft = ui.filtroTop;
  const pg = S.pagamentos.filter(p => (!f || p.turmaId === f) && (!ft || p.topicoId === ft));
  /* Despesas sem turma (turmaId vazio) são gerais: contam no saldo total e,
     quando uma turma está selecionada, aparecem à parte em vez de serem cobradas dela. */
  const dp = S.despesas.filter(d => (!f || d.turmaId === f) && (!ft || d.topicoId === ft))
    .sort((a, b) => (b.data || '').localeCompare(a.data || '') || (b.atualizadoEm || 0) - (a.atualizadoEm || 0));
  const arrec = soma(pg), gasto = soma(dp);
  const gerais = f ? soma(S.despesas.filter(d => !d.turmaId)) : 0;

  let h = PageHead({ eyebrow: 'Caixa', title: 'Saldo', actions: app.ro || !S.turmas.length ? '' : '<button class="btn primary" data-act="nova-despesa">+ Lançar despesa</button>' })
    + FiltroSelect(true)
    + SaldoCard({ arrec, gasto, porTurma: !!f })
    + (gerais > 0 ? `<div class="hint small">Despesas gerais de todas as turmas somam <b class="num">${brl(gerais)}</b> e não entram neste filtro. Escolha <b>Todas as turmas</b> para ver o saldo total.</div>` : '');

  if (!S.turmas.length) return h + EmptyState({ text: 'Cadastre uma turma e registre pagamentos para o saldo aparecer aqui.' });
  if (dp.length) h += GastosPorCategoria(dp);

  h += '<section class="sec"><h2>Despesas lançadas</h2>';
  if (!dp.length) h += EmptyState({ text: 'Nenhuma despesa ainda. Lance gastos como frete, enfeites ou aluguel do local e eles serão descontados do saldo.' });
  else h += `<div class="card">${dp.map(d => DespesaItem(d, !!f)).join('')}</div>`;
  return h + '</section>';
}
