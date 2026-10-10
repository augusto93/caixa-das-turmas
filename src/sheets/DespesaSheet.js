import { CATS } from '../core/store.js';
import { turmasOrdenadas, topicosDe, despesa } from '../services/calc.js';
import { esc, hoje, valorInput } from '../utils/format.js';
import { SheetHead } from '../components/Sheet/SheetHead.js';

const option = (value, label, selected) => `<option value="${esc(value)}" ${selected ? 'selected' : ''}>${esc(label)}</option>`;

/* Opções do select de tópico conforme a turma escolhida. Atualizado ao trocar a turma (events/index.js). */
export function topicoOptions(tid, selecionado = '') {
  if (!tid) return '<option value="">—</option>';
  return '<option value="">Geral da turma</option>' + topicosDe(tid).map(t => option(t.id, t.nome, t.id === selecionado)).join('');
}

/* Lançar ou editar despesa (geral ou de uma turma/tópico). Envio em events/forms.js → despesa. */
export function DespesaSheet(s) {
  const d = s.id ? despesa(s.id) : null;
  if (s.id && !d) return null;
  const tid = d?.turmaId || '';
  const cat = d?.categoria || CATS[0];
  // Mantém a categoria de despesas antigas mesmo que ela não esteja mais na lista.
  const cats = CATS.includes(cat) ? CATS : [...CATS, cat];

  return SheetHead(d ? 'Editar despesa' : 'Lançar despesa') + `<form data-form="despesa">
      <label class="f">Descrição<input id="i-ddesc" name="descricao" required maxlength="120" placeholder="Ex.: Frete dos enfeites" value="${esc(d?.descricao || '')}" autofocus></label>
      <div class="two"><label class="f">Categoria<select id="i-dcat" name="categoria">${cats.map(c => option(c, c, c === cat)).join('')}</select></label>
      <label class="f">Valor<input id="i-dval" name="valor" required inputmode="decimal" placeholder="0,00" value="${d ? valorInput(d.valor) : ''}"></label></div>
      <div class="two"><label class="f">Turma (opcional)<select id="i-dturma" name="turma"><option value="">Todas as turmas (geral)</option>${turmasOrdenadas().map(t => option(t.id, t.nome, t.id === tid)).join('')}</select></label>
      <label class="f">Tópico (opcional)<select id="i-dtop" name="topico" ${tid ? '' : 'disabled'}>${topicoOptions(tid, d?.topicoId)}</select></label></div>
      <p class="small muted" style="margin:0">Deixe em <b>Todas as turmas</b> para gastos do caixa geral. Escolha uma turma só se o gasto for dela.</p>
      <label class="f">Data<input id="i-ddata" name="data" type="date" value="${esc(d?.data || hoje())}" required></label>
      <button class="btn primary block">${d ? 'Salvar' : 'Lançar despesa'}</button>
      ${d ? `<button type="button" class="btn danger block" data-act="del-despesa" data-id="${d.id}">Excluir despesa</button>` : ''}</form>`;
}
