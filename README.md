# Caixa das Turmas

App de controle de pagamentos por turma. Ele tem três telas:

- **Turmas**: turmas, tópicos (Sítio, Formatura…) com valor total por aluno e data limite, alunos e pagamentos.
- **Saldo**: total arrecadado menos as despesas (frete, enfeites etc.).
- **Estimativas**: meta, quanto já foi arrecadado, quanto falta, alunos quitados, prazo e sugestão de valor mensal.

O app fica hospedado no **GitHub Pages**, os dados ficam no **Firebase Firestore** e o login é feito com **conta Google**.
Ele funciona no navegador e no iPhone, e continua funcionando offline: o que for lançado sem internet sincroniza quando a conexão voltar.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | O app inteiro |
| `firebase-config.js` | Configuração do seu projeto Firebase (**você preenche**) |
| `firestore.rules` | Regras de segurança: quais e-mails podem acessar (**você preenche**) |
| `manifest.webmanifest`, `icon-*.png` | Ícone e nome ao adicionar à tela de início do iPhone |

---

## Passo 1 — Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com e clique em **Criar projeto** (o Google Analytics pode ficar desativado).
2. No menu **Criação → Firestore Database**, clique em **Criar banco de dados**.
   - Local: `southamerica-east1 (São Paulo)`.
   - Modo: **produção**.
3. No menu **Criação → Authentication**, clique em **Vamos começar**. Na aba **Método de login**, ative o **Google** e salve.

## Passo 2 — Copiar a configuração para o app

1. Clique na engrenagem → **Configurações do projeto**. Em **Seus apps**, clique no ícone **`</>`** (Web).
2. Dê um apelido (ex.: `caixa-turmas`). **Não** marque o Firebase Hosting. Clique em **Registrar app**.
3. Copie o objeto `firebaseConfig` que aparecer e cole no arquivo **`firebase-config.js`**, substituindo os valores de exemplo.

> Esses dados não são senha e podem ficar públicos no GitHub. Quem protege os dados são as regras do Passo 3.

## Passo 3 — Liberar quem pode acessar (regras)

1. Abra **Firestore Database → Regras**.
2. Apague tudo, cole o conteúdo de **`firestore.rules`** e troque `seu-email@gmail.com` pelos e-mails liberados. Exemplo:
   ```
   'maria@gmail.com',
   'joao@gmail.com'
   ```
3. Clique em **Publicar**.

Para incluir outra pessoa depois, é só adicionar o e-mail dela nessa lista e publicar de novo.
Quem não estiver na lista consegue fazer login, mas vê a mensagem "Acesso não liberado" e não acessa nenhum dado.

## Passo 4 — Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `caixa-das-turmas`). Ele pode ser público.
2. Envie todos os arquivos desta pasta para a raiz do repositório:
   ```bash
   git init
   git add .
   git commit -m "Caixa das Turmas"
   git branch -M main
   git remote add origin https://github.com/augusto93/caixa-das-turmas.git
   git push -u origin main
   ```
3. No repositório, abra **Settings → Pages**. Em *Source*, escolha **Deploy from a branch**, depois **main** / **(root)**, e salve.
4. Depois de 1 ou 2 minutos, o app estará em `https://augusto93.github.io/caixa-das-turmas/`.

## Passo 5 — Autorizar o domínio do GitHub no login

No Firebase, abra **Authentication → Configurações → Domínios autorizados → Adicionar domínio** e informe:

```
augusto93.github.io
```

Sem isso, o botão "Entrar com Google" mostra o erro de domínio não autorizado.

## Passo 6 — Instalar no iPhone

Abra o endereço no **Safari**, toque em **Compartilhar** e depois em **Adicionar à Tela de Início**. O app ganha ícone próprio e abre em tela cheia.

---

## Custos

O plano gratuito do Firebase (Spark) atende com folga algumas turmas: até 50 mil leituras e 20 mil gravações por dia, e 1 GB armazenado. O GitHub Pages é gratuito.

## Backup

Na tela **Turmas**, o link **Baixar backup dos dados (JSON)** salva uma cópia de tudo. Faça isso de vez em quando, principalmente perto das datas de pagamento.

## Testar localmente (opcional)

O app usa módulos JavaScript, então não abre direto pelo arquivo. Rode um servidor simples na pasta:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`. O domínio `localhost` já vem autorizado no Firebase.
