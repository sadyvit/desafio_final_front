![](https://i.imgur.com/xG74tOh.png)

# Desafio Final Módulo 5 - FRONTEND

Este repositório deverá servir de base para ser realizado o fork para desenvolvimento da parte de **FRONTEND** do desafio.

A URL deste repositório deverá ser entregue na plataforma de alunos da Cubos Academy na página da parte de FRONTEND do desafio.

A versão final do código de cada sprint deverá estar na branch principal do repositório e sim, a cada semana acumulará as alterações das sprints, portanto a segunda sobrescrevendo a primeira e assim por diante.

---

No fork de vocês, favor alterar este README para adicionar os links correspondentes para os seguintes itens:

**Repositório de Backend**: https://github.com/vsm-dv/back-integral-m05-desafio-t04

**Repositório de Frontend**: https://github.com/vsm-dv/front-integral-m05-desafio-t04

**URL da aplicação funcionando**: https://app-equipe4of.netlify.app/

---

E os itens abaixo, que deverão ser preenchidos apenas após a finalização de todas as sprints do projeto: 

**Pull Request (PR) de Backend**: https://github.com/cubos-academy/back-integral-m05-desafio-t04/pull/16

**Pull Request (PR) de Frontend**: https://github.com/cubos-academy/front-integral-m05-desafio-t04/pull/18

Estes Pull Requests (PRs) deverão ser criados a partir da branch principal do fork correspondente de vocês daquela stack tendo como destino o repositório base da stack do desafio.

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
