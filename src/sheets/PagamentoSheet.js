import { FORMAS } from '../core/store.js';
import { aluno, topico, faltaNoTopico } from '../services/calc.js';
import { esc, brl, hoje, valorInput } from '../utils/format.js';
import { SheetHead } from '../components/Sheet/SheetHead.js';

/* Placeholder do campo valor: quanto falta no tópico escolhido. Também usado ao trocar o tópico (events/index.js). */
export const placeholderValor = falta => (falta ? valorInput(falta.toFixed(2)) : '0,00');

/* Registrar pagamento de um aluno. Envio em events/forms.js → pagar. */
export function PagamentoSheet(s) {
  const a = aluno(s.aluno);
  if (!a) return null;
  const tops = (a.topicos || []).map(topico).filter(Boolean);
  const cur = s.topico || tops[0]?.id;
  const fal = cur ? faltaNoTopico(a, topico(cur)) : 0;

  return SheetHead('Registrar pagamento', esc(a.nome)) + `<form data-form="pagar">
      <label class="f">Tópico<select id="i-ptop" name="topico">${tops.map(t => `<option value="${t.id}" ${t.id === cur ? 'selected' : ''}>${esc(t.nome)} — falta ${brl(faltaNoTopico(a, t))}</option>`).join('')}</select></label>
      <div class="two"><label class="f">Valor<input id="i-pval" name="valor" required inputmode="decimal" placeholder="${placeholderValor(fal)}" autofocus></label>
      <label class="f">Data<input id="i-pdata" name="data" type="date" value="${hoje()}" required></label></div>
      <label class="f">Forma de pagamento<select id="i-pforma" name="forma">${FORMAS.map(x => `<option>${x}</option>`).join('')}</select></label>
      <label class="f">Observação (opcional)<input id="i-pobs" name="obs" maxlength="120" placeholder="Ex.: parcela de outubro"></label>
      <button class="btn primary block">Salvar pagamento</button>
      <button type="button" class="btn block" data-act="abrir-aluno" data-id="${a.id}">Voltar</button></form>`;
}
