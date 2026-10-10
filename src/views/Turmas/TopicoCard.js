import { statsTop } from '../../services/calc.js';
import { esc, brl, fdata, pct } from '../../utils/format.js';
import { ProgressBar } from '../../components/ui/index.js';

/* Cartão de tópico (Sítio, Formatura…) dentro da turma. Toque abre a edição. */
export function TopicoCard(tp) {
  const st = statsTop(tp);
  return `<button class="topic" data-act="editar-topico" data-id="${tp.id}"><b>${esc(tp.nome)}</b><span class="small muted num">Teto ${brl(tp.teto)} por aluno${tp.prazo ? ' · até ' + fdata(tp.prazo) : ''}</span>${ProgressBar(pct(st.meta - st.falta, st.meta), st.n && st.falta <= 0)}<span class="small num">${st.quit} de ${st.n} quitados</span></button>`;
}
