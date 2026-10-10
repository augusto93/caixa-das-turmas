/* Exportar e importar backup em JSON. */
import { COLS, S } from '../core/store.js';
import { hoje } from '../utils/format.js';
import { clean, emLote, falhaEscrita } from './db.js';
import { toast } from '../components/Toast/Toast.js';

export function backup() {
  const blob = new Blob([JSON.stringify({ exportadoEm: new Date().toISOString(), ...S }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'caixa-das-turmas-backup-' + hoje() + '.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

export async function importar(file) {
  let j;
  try { j = JSON.parse(await file.text()); } catch (e) { toast('Arquivo inválido. Use o backup baixado pelo app.'); return; }
  const ops = [];
  for (const c of COLS) {
    for (const row of (Array.isArray(j[c]) ? j[c] : [])) {
      if (row && row.id) ops.push({ col: c, id: String(row.id), data: { ...clean(row), atualizadoEm: Date.now() } });
    }
  }
  if (!ops.length) { toast('Nenhum dado encontrado no arquivo.'); return; }
  toast('Importando ' + ops.length + ' registros…');
  try {
    await emLote(ops);
    toast('Backup importado: ' + ops.length + ' registros.');
  } catch (e) {
    falhaEscrita(e);
  }
}

/* Abre o seletor de arquivo e importa o JSON escolhido. */
export function escolherArquivo() {
  const i = document.createElement('input');
  i.type = 'file';
  i.accept = '.json,application/json';
  i.onchange = () => { if (i.files[0]) importar(i.files[0]); };
  i.click();
}
