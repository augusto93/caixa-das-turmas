import { app } from '../../core/store.js';
import { brl } from '../../utils/format.js';

/* Linha de lançamento (pagamento ou despesa) com valor e botões Editar (opcional) e Excluir.
   kind: 'pos' (entrada, verde) | 'neg' (saída, vermelho, com "−")
   editAct: ação de events/actions.js que abre a edição (recebe data-id) */
export function LineItem({ title, meta, valor, kind = 'pos', col, id, editAct }) {
  const valorTxt = kind === 'neg' ? `− ${brl(valor)}` : brl(valor);
  const editar = app.ro || !editAct ? '' : `<button class="x" data-act="${editAct}" data-id="${id}">Editar</button>`;
  const excluir = app.ro ? '' : `<button class="x" data-act="del" data-col="${col}" data-id="${id}">Excluir</button>`;
  return `<div class="line-item"><div class="grow"><div>${title}</div><div class="small muted">${meta}</div></div><span class="${kind} num">${valorTxt}</span>${editar}${excluir}</div>`;
}
