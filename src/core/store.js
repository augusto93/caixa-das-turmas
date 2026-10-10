/* Estado global do app.
   S   → dados sincronizados do Firestore (uma lista por coleção)
   app → sessão: modo da tela, usuário logado, somente leitura
   ui  → estado da interface (aba, turma aberta, filtros, sheet aberta) */

export const COLS = ['turmas', 'topicos', 'alunos', 'pagamentos', 'despesas'];
export const CATS = ['Frete', 'Enfeites', 'Alimentação', 'Local / Aluguel', 'Transporte', 'Fotos / Vídeo', 'Camisetas', 'Outros'];
export const FORMAS = ['Pix', 'Dinheiro', 'Cartão', 'Transferência'];

export const S = { turmas: [], topicos: [], alunos: [], pagamentos: [], despesas: [] };

/* mode: 'loading' | 'config' | 'login' | 'negado' | 'sync' */
export const app = { mode: 'loading', me: null, ro: false };

export const ui = { tab: 'turmas', turma: null, filtro: '', filtroTop: '', busca: '', open: {}, sheet: null };

const UI_KEY = 'caixa-ui';
try {
  const s = JSON.parse(localStorage.getItem(UI_KEY) || '{}');
  if (s.tab) ui.tab = s.tab;
  if (s.filtro) ui.filtro = s.filtro;
} catch (e) {}

export function saveUi() {
  try { localStorage.setItem(UI_KEY, JSON.stringify({ tab: ui.tab, filtro: ui.filtro })); } catch (e) {}
}

export function limparDados() {
  COLS.forEach(c => (S[c] = []));
}
