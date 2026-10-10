/* Registro das sheets: openSheet({ type: '<chave>', ... }) desenha o componente correspondente.
   Cada componente recebe o objeto da sheet e devolve HTML, ou null se o registro não existe mais. */
import { TurmaSheet } from './TurmaSheet.js';
import { TopicoSheet } from './TopicoSheet.js';
import { AlunoFormSheet } from './AlunoFormSheet.js';
import { AlunoSheet } from './AlunoSheet.js';
import { PagamentoSheet } from './PagamentoSheet.js';
import { DespesaSheet } from './DespesaSheet.js';

export const SHEETS = {
  turma: TurmaSheet,
  topico: TopicoSheet,
  alunoForm: AlunoFormSheet,
  aluno: AlunoSheet,
  pagar: PagamentoSheet,
  despesa: DespesaSheet,
};

/* Sheets só de visualização: são redesenhadas quando os dados mudam (formulários não, para não perder o que foi digitado). */
export const VIEW_SHEETS = ['aluno'];
