import { dias } from '../../utils/format.js';

/* Etiqueta. variant: '' | 'ok' | 'warn' | 'bad' | 'acc' (pode incluir classes extras, ex.: 'ok num'). */
export const Pill = (html, variant = '') => `<span class="pill${variant ? ' ' + variant : ''}">${html}</span>`;

/* Etiqueta com quantos dias faltam para a data limite. */
export function PrazoPill(prazo) {
  const d = dias(prazo);
  if (d === null) return Pill('Sem prazo');
  if (d < 0) return Pill(`Venceu há ${-d} dia${d === -1 ? '' : 's'}`, 'bad');
  if (d === 0) return Pill('Vence hoje', 'bad');
  return Pill(`Faltam ${d} dia${d === 1 ? '' : 's'}`, d <= 30 ? 'warn' : 'acc');
}
