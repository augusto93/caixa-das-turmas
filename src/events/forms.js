/* Envio dos formulários das sheets. A chave é o data-form do <form>.
   Assinatura: (fd: FormData, s: ui.sheet) → Promise (ou undefined quando a validação falha). */
import { ui } from '../core/store.js';
import { render } from '../core/render.js';
import { turma, topico, aluno, alunosDe, despesa } from '../services/calc.js';
import { put, run } from '../services/db.js';
import { uid, parseBRL, brl } from '../utils/format.js';
import { openSheet, closeSheet } from '../components/Sheet/Sheet.js';
import { toast } from '../components/Toast/Toast.js';

export const forms = {
  turma(fd, s) {
    const nome = String(fd.get('nome')).trim();
    if (!nome) return;
    if (s.id) {
      const t = turma(s.id);
      return run(() => put('turmas', t.id, { ...t, nome }).then(closeSheet), 'Turma salva');
    }
    const id = uid();
    return run(() => put('turmas', id, { nome, criadoEm: Date.now() }).then(() => {
      closeSheet();
      ui.turma = id;
      ui.tab = 'turmas';
      render();
    }), 'Turma criada');
  },

  topico(fd, s) {
    const nome = String(fd.get('nome')).trim(), teto = parseBRL(fd.get('teto')), prazo = String(fd.get('prazo') || '');
    if (!nome || !(teto > 0)) { toast('Informe o nome e um valor maior que zero.'); return; }
    if (s.id) {
      const t = topico(s.id);
      return run(() => put('topicos', t.id, { ...t, nome, teto, prazo }).then(closeSheet), 'Tópico salvo');
    }
    const id = uid(), todos = fd.get('todos');
    return run(async () => {
      await put('topicos', id, { turmaId: ui.turma, nome, teto, prazo, criadoEm: Date.now() });
      if (todos) for (const a of alunosDe(ui.turma)) await put('alunos', a.id, { ...a, topicos: [...(a.topicos || []), id] });
      closeSheet();
    }, 'Tópico adicionado');
  },

  aluno(fd, s) {
    const tops = fd.getAll('top');
    if (s.id) {
      const a = aluno(s.id);
      const nome = String(fd.get('nome')).trim();
      if (!nome) return;
      return run(() => put('alunos', a.id, { ...a, nome, contato: String(fd.get('contato') || '').trim(), topicos: tops })
        .then(() => openSheet({ type: 'aluno', id: a.id })), 'Aluno salvo');
    }
    const nomes = String(fd.get('nomes')).split(/\n/).map(x => x.trim()).filter(Boolean);
    if (!nomes.length) return;
    return run(async () => {
      for (const nome of nomes) await put('alunos', uid(), { turmaId: ui.turma, nome, contato: '', topicos: tops, criadoEm: Date.now() });
      closeSheet();
    }, nomes.length > 1 ? nomes.length + ' alunos cadastrados' : 'Aluno cadastrado');
  },

  pagar(fd, s) {
    const valor = parseBRL(fd.get('valor')), top = String(fd.get('topico'));
    if (!(valor > 0)) { toast('Informe um valor maior que zero.'); return; }
    const a = aluno(s.aluno);
    return run(() => put('pagamentos', uid(), {
      alunoId: a.id, turmaId: a.turmaId, topicoId: top, valor,
      data: String(fd.get('data')), forma: String(fd.get('forma') || ''), obs: String(fd.get('obs') || '').trim(),
    }).then(() => openSheet({ type: 'aluno', id: a.id })), 'Pagamento de ' + brl(valor) + ' registrado');
  },

  despesa(fd, s) {
    const valor = parseBRL(fd.get('valor'));
    if (!(valor > 0)) { toast('Informe um valor maior que zero.'); return; }
    const campos = {
      descricao: String(fd.get('descricao')).trim(), categoria: String(fd.get('categoria')), valor,
      turmaId: String(fd.get('turma')), topicoId: String(fd.get('topico') || ''), data: String(fd.get('data')),
    };
    if (s.id) {
      const d = despesa(s.id);
      if (!d) { toast('Esta despesa foi excluída.'); closeSheet(); return; }
      return run(() => put('despesas', d.id, { ...d, ...campos }).then(closeSheet), 'Despesa salva');
    }
    return run(() => put('despesas', uid(), campos).then(closeSheet), 'Despesa lançada');
  },
};
