# FinTrack — Sistema de Gestão de Clientes e Cobranças

Aplicação web desenvolvida em **React** para gerenciamento completo de clientes e cobranças financeiras. Permite cadastrar e acompanhar clientes, registrar cobranças, visualizar status de inadimplência e controlar pagamentos — tudo em uma interface moderna e responsiva.

---

## Funcionalidades

- **Autenticação**: login seguro com JWT, rotas protegidas e persistência de sessão
- **Dashboard (Home)**: resumo de clientes em dia e inadimplentes, cobranças pagas, previstas e vencidas
- **Gestão de Clientes**: listagem com busca, cadastro, edição e detalhamento completo por cliente
- **Gestão de Cobranças**: listagem com busca, cadastro, edição, exclusão e visualização de detalhes
- **Perfil do Usuário**: edição de dados cadastrais com feedback visual de sucesso
- **Paginação e Filtros**: navegação paginada e filtragem por status nas tabelas

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | React 18 |
| Gerenciamento de estado | Redux Toolkit + RTK Query |
| Roteamento | React Router DOM v7 |
| UI Components | Material UI (MUI) v7 |
| Estilização | CSS Modules |
| HTTP / Cache | RTK Query (`createApi`) |
| Build | Create React App |

---

## Estrutura de Pastas

```
src/
├── pages/          # Páginas principais (Home, Clientes, Cobranças, DetalharCliente, Login)
├── components/     # Componentes reutilizáveis (modais, tabelas, sidebar, menus)
├── store/          # Redux store, apiSlice (RTK Query), authSlice, globalSlice
├── hooks/          # Hooks customizados (useAuth, useGlobal e domínios separados)
├── context/        # AuthContext para controle de autenticação
└── utils/          # Funções utilitárias (ex: verificação de inadimplência)
```

---

## Como rodar localmente

**Pré-requisitos:** Node.js 18+ e npm

```bash
# Clone o repositório
git clone https://github.com/sadyvit/fintrack.git
cd fintrack

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL da sua API backend

# Suba a aplicação
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `REACT_APP_API_URL` | URL base da API backend |

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia em modo de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm test` | Executa os testes |

---

## Links

- **Repositório Backend**: https://github.com/sadyvit/fintrack_api
- **Deploy**: https://desafio-final-front-seven.vercel.app/

Ou seja, o Pull Request de **FRONTEND** deverá ser criado a partir do fork de vocês desse repositório aqui, com destino a este repositório aqui.

E portanto o Pull Request de **BACKEND** deverá ser criado a partir do fork de vocês do repositório base de BACKEND desse desafio, com destino ao [repositório base de BACKEND desse desafio](https://github.com/cubos-academy/back-integral-m05-desafio-t04).

---

## Configuração para consumir API da Vercel

Este frontend usa a variável de ambiente `REACT_APP_API_URL` em todas as chamadas `fetch`.

1. Crie um arquivo `.env.local` na raiz do projeto (pode copiar de `.env.example`).
2. Defina a URL do backend deployado na Vercel:

```bash
REACT_APP_API_URL=https://seu-backend.vercel.app
```

> Use a URL sem barra no final.

3. Reinicie o frontend (`npm start`) para a variável ser recarregada.

### Deploy do frontend na Vercel

Se publicar este frontend na Vercel, as rotas do React Router precisam de rewrite para `index.html`.
Este repositório já inclui `vercel.json` com essa configuração.

### Checklist de compatibilidade (março/2026)

- Build de produção está funcionando (`npm run build`) — sem erros, apenas warnings de lint.
- A configuração obrigatória para funcionar com novo backend é apenas `REACT_APP_API_URL`.
- Garanta também que o backend permita CORS do domínio do frontend (local e produção).
- Atualização de dependências pode ser feita depois; não há bloqueio crítico de execução no estado atual.
