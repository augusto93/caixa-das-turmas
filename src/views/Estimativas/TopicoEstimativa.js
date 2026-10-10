import { ui } from '../../core/store.js';
import { statsTop, turma } from '../../services/calc.js';
import { esc, brl, fdata, dias, pct } from '../../utils/format.js';
import { ProgressBar, Pill, PrazoPill } from '../../components/ui/index.js';

/* Texto de orientação: quanto cada aluno pendente precisa pagar por mês até o prazo. */
function dica(t, s) {
  const d = dias(t.prazo);
  const meses = d !== null && d > 0 ? Math.max(1, Math.ceil(d / 30)) : null;
  const pendN = s.pend.length;
  if (!s.n) return 'Nenhum aluno inscrito neste tópico.';
  if (!pendN) return 'Todos os alunos quitaram este tópico.';
  if (meses) {
    const porAluno = s.falta / pendN / meses;
    return `Para fechar até ${fdata(t.prazo)}, cada aluno pendente precisa pagar em média <b class="num">${brl(porAluno)}</b> por mês (${meses} ${meses === 1 ? 'mês' : 'meses'} restantes).`;
  }
  if (d !== null) return `O prazo passou com ${pendN} aluno${pendN === 1 ? '' : 's'} pendente${pendN === 1 ? '' : 's'}, faltando ${brl(s.falta)}.`;
  return 'Defina uma data limite para ver quanto cada aluno precisa pagar por mês.';
}

const Pendentes = pend =>
  `<div class="pend num">${pend.map(x => `<div><span>${esc(x.a.nome)}</span><span><span class="muted">${brl(x.p)} pago ·</span> <b>falta ${brl(x.f)}</b></span></div>`).join('')}</div>`;

/* Cartão de estimativa de um tópico, com lista expansível de quem falta pagar. */
export function TopicoEstimativa(t) {
  const s = statsTop(t), tu = turma(t.turmaId);
  const pendN = s.pend.length;
  const open = !!ui.open[t.id];
  return `<div class="card est"><div class="est-h"><div><h3>${esc(t.nome)}</h3><div class="small muted">${esc(tu ? tu.nome : '')} · teto ${brl(t.teto)} por aluno${t.prazo ? ' · limite ' + fdata(t.prazo) : ''}${s.comDesc > 0 ? ` · ${s.comDesc} com desconto` : ''}</div></div>${PrazoPill(t.prazo)}</div>
    ${ProgressBar(pct(s.meta - s.falta, s.meta), s.n && !pendN)}
    <div class="trio num"><div><span class="eyebrow">Meta</span><span class="v">${brl(s.meta)}</span></div><div><span class="eyebrow">Arrecadado</span><span class="v pos">${brl(s.arrec)}</span></div><div><span class="eyebrow">Falta</span><span class="v">${brl(s.falta)}</span></div></div>
    <div class="pills">${Pill(`${s.quit} quitado${s.quit === 1 ? '' : 's'}`, 'ok')}${Pill(`${pendN - s.zero} pagando`, 'warn')}${Pill(`${s.zero} sem pagamento`)}</div>
    <div class="hint">${dica(t, s)}</div>
    ${pendN ? `<button class="linkbtn" data-act="toggle" data-id="${t.id}" aria-expanded="${open}">${open ? 'Ocultar' : 'Ver'} quem falta pagar (${pendN})</button>` : ''}
    ${open && pendN ? Pendentes(s.pend) : ''}
    </div>`;
}
