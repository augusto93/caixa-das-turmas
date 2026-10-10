import { ui } from '../core/store.js';
import { turma, topico } from '../services/calc.js';
import { esc, valorInput } from '../utils/format.js';
import { SheetHead } from '../components/Sheet/SheetHead.js';

const SUGESTOES = ['Sítio', 'Formatura', 'Viagem', 'Festa', 'Camiseta'];

/* Criar / editar tópico de pagamento. Envio tratado em events/forms.js → topico. */
export function TopicoSheet(s) {
  const t = s.id ? topico(s.id) : null;
  if (s.id && !t) return null;
  return SheetHead(t ? 'Editar tópico' : 'Novo tópico', esc(turma(ui.turma)?.nome || '')) + `<form data-form="topico">
      <label class="f">Nome do tópico<input id="i-tnome" name="nome" required maxlength="60" placeholder="Ex.: Formatura" value="${esc(t ? t.nome : '')}" autofocus></label>
      ${t ? '' : `<div class="quick">${SUGESTOES.map(n => `<button type="button" data-act="quick" data-v="${n}">${n}</button>`).join('')}</div>`}
      <div class="two"><label class="f">Valor total por aluno<input id="i-teto" name="teto" required inputmode="decimal" placeholder="350,00" value="${t ? valorInput(t.teto) : ''}"></label>
      <label class="f">Data limite<input id="i-prazo" name="prazo" type="date" value="${esc(t ? t.prazo || '' : '')}"></label></div>
      <p class="small muted" style="margin:0">Cada aluno paga o valor que puder por mês até completar o total.</p>
      ${t ? '' : '<label class="check"><input type="checkbox" id="i-todos" name="todos" checked>Incluir todos os alunos atuais da turma</label>'}
      <button class="btn primary block">${t ? 'Salvar' : 'Adicionar tópico'}</button>
      ${t ? `<button type="button" class="btn danger block" data-act="del-topico" data-id="${t.id}">Excluir tópico e seus pagamentos</button>` : ''}</form>`;
}
