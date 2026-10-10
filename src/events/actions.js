/* Ações de clique. Qualquer elemento com data-act="<nome>" chama a função de mesmo nome.
   Assinatura: (el, event) → el é o elemento com data-act, el.dataset.id costuma trazer o id do registro. */
import { S, ui, saveUi } from '../core/store.js';
import { render } from '../core/render.js';
import { $ } from '../utils/dom.js';
import { put, del, run, apagarTudo } from '../services/db.js';
import { backup, escolherArquivo } from '../services/backup.js';
import { entrar, sair } from '../services/auth.js';
import { openSheet, closeSheet } from '../components/Sheet/Sheet.js';
import { arm } from './arm.js';

export const actions = {
  /* Navegação */
  tab: el => { ui.tab = el.dataset.tab; saveUi(); render(); scrollTo(0, 0); },
  'abrir-turma': el => { ui.turma = el.dataset.id; ui.busca = ''; render(); scrollTo(0, 0); },
  voltar: () => { ui.turma = null; render(); },
  toggle: el => { const id = el.dataset.id; ui.open[id] = !ui.open[id]; render(); },

  /* Sessão e backup */
  entrar: () => entrar(),
  sair: () => sair(),
  backup: () => backup(),
  importar: () => escolherArquivo(),
  'apagar-tudo': el => { if (arm(el, 'Toque de novo: apaga os dados de todos')) apagarTudo(); },

  /* Sheets */
  close: () => closeSheet(),
  'nova-turma': () => openSheet({ type: 'turma' }),
  'editar-turma': () => openSheet({ type: 'turma', id: ui.turma }),
  'novo-topico': () => openSheet({ type: 'topico' }),
  'editar-topico': el => openSheet({ type: 'topico', id: el.dataset.id }),
  'novo-aluno': () => openSheet({ type: 'alunoForm' }),
  'editar-aluno': el => openSheet({ type: 'alunoForm', id: el.dataset.id }),
  'abrir-aluno': el => openSheet({ type: 'aluno', id: el.dataset.id }),
  pagar: el => openSheet({ type: 'pagar', aluno: ui.sheet.id, topico: el.dataset.topico }),
  'nova-despesa': () => openSheet({ type: 'despesa' }),
  'editar-despesa': el => openSheet({ type: 'despesa', id: el.dataset.id }),
  quick: el => { $('#i-tnome').value = el.dataset.v; $('#i-teto').focus(); },

  /* Exclusões (com confirmação em dois toques) */
  del: el => { if (arm(el)) run(() => del(el.dataset.col, el.dataset.id), 'Excluído'); },

  'del-despesa': el => {
    if (arm(el, 'Toque de novo para confirmar')) run(async () => { await del('despesas', el.dataset.id); closeSheet(); }, 'Despesa excluída');
  },

  'del-turma': el => {
    const id = el.dataset.id;
    if (!arm(el, 'Toque de novo para apagar tudo')) return;
    run(async () => {
      for (const c of ['pagamentos', 'despesas', 'alunos', 'topicos']) for (const x of S[c].filter(x => x.turmaId === id)) await del(c, x.id);
      await del('turmas', id);
      ui.turma = null;
      closeSheet();
    }, 'Turma excluída');
  },

  'del-topico': el => {
    const id = el.dataset.id;
    if (!arm(el, 'Toque de novo para confirmar')) return;
    run(async () => {
      for (const p of S.pagamentos.filter(p => p.topicoId === id)) await del('pagamentos', p.id);
      for (const a of S.alunos.filter(a => (a.topicos || []).includes(id))) await put('alunos', a.id, { ...a, topicos: a.topicos.filter(x => x !== id) });
      await del('topicos', id);
      closeSheet();
    }, 'Tópico excluído');
  },

  'del-aluno': el => {
    const id = el.dataset.id;
    if (!arm(el, 'Toque de novo para confirmar')) return;
    run(async () => {
      for (const p of S.pagamentos.filter(p => p.alunoId === id)) await del('pagamentos', p.id);
      await del('alunos', id);
      closeSheet();
    }, 'Aluno excluído');
  },
};
