import { app, ui } from '../../core/store.js';
import { topicosDe, alunosDe, statsTurma } from '../../services/calc.js';
import { esc, brl, pct } from '../../utils/format.js';
import { PageHead, EmptyState, ProgressBar, SectionHead } from '../../components/ui/index.js';
import { TopicoCard } from './TopicoCard.js';
import { AlunosList } from './AlunosList.js';

/* Detalhe de uma turma: resumo, tópicos e alunos. */
export function TurmaDetail(t) {
  const ro = app.ro;
  const tops = topicosDe(t.id), als = alunosDe(t.id), s = statsTurma(t.id);

  let h = `<button class="back" data-act="voltar">‹ Todas as turmas</button>
  ${PageHead({ eyebrow: 'Turma', title: esc(t.nome), actions: ro ? '' : '<button class="btn sm" data-act="editar-turma">Editar turma</button>' })}
  ${Number(t.desconto) > 0 ? `<div class="hint small">Desconto de <b>${brl(t.desconto)}</b> para quem participa de mais de um tópico, dividido igualmente entre os tópicos do aluno.</div>` : ''}
  <div class="card">${ProgressBar(pct(s.arrec, s.meta), s.meta && s.falta <= 0)}<div class="small num" style="margin-top:8px"><b>${brl(s.arrec)}</b> arrecadado de ${brl(s.meta)} · falta ${brl(s.falta)}</div></div>
  <section class="sec">${SectionHead('Tópicos', ro ? '' : '<button class="btn sm" data-act="novo-topico">+ Tópico</button>')}`;

  if (!tops.length) h += EmptyState({ text: 'Adicione os tópicos de pagamento desta turma, por exemplo <b>Sítio</b> ou <b>Formatura</b>, com o valor total que cada aluno precisa pagar.' });
  else h += `<div class="topics">${tops.map(TopicoCard).join('')}</div>`;

  h += `</section><section class="sec">${SectionHead(`Alunos <span class="muted num">(${als.length})</span>`, ro ? '' : '<button class="btn sm" data-act="novo-aluno">+ Aluno</button>')}`;

  if (!als.length) h += EmptyState({ text: 'Nenhum aluno nesta turma ainda. Você pode colar uma lista de nomes, um por linha.' });
  else h += `<input class="search" id="busca" type="search" placeholder="Buscar aluno" value="${esc(ui.busca)}" autocomplete="off"><div class="list" id="alunos-list">${AlunosList(t.id)}</div>`;

  return h + '</section>';
}
