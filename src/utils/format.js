/* Formatação e conversão de valores (dinheiro, datas, texto). */

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const brl = v => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* Número → texto de input no formato brasileiro (350.5 → "350,5"). */
export const valorInput = v => String(v).replace('.', ',');

export function parseBRL(s) {
  s = String(s || '').replace(/R\$|\s/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(s);
  return isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const hoje = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

export const fdata = s => {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return d + '/' + m + '/' + y;
};

/* Dias de hoje até a data (negativo se já passou). */
export function dias(prazo) {
  if (!prazo) return null;
  const [y, m, d] = prazo.split('-').map(Number);
  const a = new Date(y, m - 1, d), t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((a - t) / 86400000);
}

export const byNome = (a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR');

export const pct = (a, b) => (b > 0 ? Math.min(100, Math.round(a / b * 100)) : 0);

/* Plural simples: plural(2, 'aluno') → "2 alunos". */
export const plural = (n, palavra) => `${n} ${palavra}${n === 1 ? '' : 's'}`;
