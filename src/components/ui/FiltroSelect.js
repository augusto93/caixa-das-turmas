import { ui } from '../../core/store.js';
import { turmasOrdenadas, topicosDe } from '../../services/calc.js';
import { esc } from '../../utils/format.js';

const option = (value, label, selected) => `<option value="${value}" ${selected ? 'selected' : ''}>${esc(label)}</option>`;

/* Filtro de turma (e de tópico, quando withTop e há turma escolhida). As mudanças são tratadas em events/index.js. */
export function FiltroSelect(withTop) {
  let h = `<div class="filters"><select class="filter" id="f-turma" aria-label="Filtrar turma"><option value="">Todas as turmas</option>${turmasOrdenadas().map(t => option(t.id, t.nome, t.id === ui.filtro)).join('')}</select>`;
  if (withTop && ui.filtro) {
    h += `<select class="filter" id="f-top" aria-label="Filtrar tópico"><option value="">Todos os tópicos</option>${topicosDe(ui.filtro).map(t => option(t.id, t.nome, t.id === ui.filtroTop)).join('')}</select>`;
  }
  return h + '</div>';
}
