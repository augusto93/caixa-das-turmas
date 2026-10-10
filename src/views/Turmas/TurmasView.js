import { app, ui } from '../../core/store.js';
import { turma, turmasOrdenadas } from '../../services/calc.js';
import { esc } from '../../utils/format.js';
import { PageHead, EmptyState } from '../../components/ui/index.js';
import { TurmaRow } from './TurmaRow.js';
import { TurmaDetail } from './TurmaDetail.js';

const Footer = () =>
  `<div class="foot" style="flex-direction:column;align-items:center;gap:4px"><span class="small muted">Conectado como ${esc(app.me?.email || '')}</span><button class="linkbtn" data-act="backup">Baixar backup dos dados (JSON)</button><button class="linkbtn" data-act="importar">Importar backup</button><button class="x" data-act="apagar-tudo">Apagar todos os dados</button></div>`;

/* Aba Turmas: lista de turmas ou, se houver uma aberta, o detalhe dela. */
export function TurmasView() {
  if (ui.turma && turma(ui.turma)) return TurmaDetail(turma(ui.turma));
  ui.turma = null;
  const ro = app.ro;
  const ts = turmasOrdenadas();
  const h = PageHead({ eyebrow: 'Cadastro', title: 'Turmas', actions: ro ? '' : '<button class="btn primary" data-act="nova-turma">+ Nova turma</button>' });

  if (!ts.length) {
    return h + EmptyState({
      title: 'Nenhuma turma cadastrada',
      text: 'Crie uma turma, depois adicione os tópicos (como Sítio e Formatura) com o valor total de cada um e cadastre os alunos.',
      actions: (ro ? '' : '<button class="btn primary" data-act="nova-turma">Criar primeira turma</button>') + '<button class="linkbtn" data-act="importar">Já tem um backup? Importar arquivo JSON</button>',
    });
  }

  return h + `<div class="list">${ts.map(TurmaRow).join('')}</div>` + Footer();
}
