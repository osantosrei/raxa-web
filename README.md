<div align="center">

# Raxa

Webapp do **Raxa** — organize peladas sem depender do caos de grupos de WhatsApp.

[![Vercel](https://img.shields.io/badge/Produção-raxa--web.vercel.app-FF6B00?style=flat-square&logo=vercel&logoColor=white)](https://raxa-web.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack-React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)

**[→ Abrir o app](https://raxa-web.vercel.app)**

</div>

---

## Sobre o projeto

O Raxa resolve um problema cotidiano: confirmar presença em peladas pelo WhatsApp é caótico. Confirmações se perdem, ninguém sabe quantas vagas restam e o organizador conta na mão.

Este repositório é o webapp que consome a [raxa-api](https://github.com/osantosrei/raxa-api). Roda no navegador do celular sem precisar instalar nada — basta acessar o link.

**O que o app faz**

- Cadastro e login com JWT
- Criação de partidas com data, local e limite de jogadores
- Listagem e detalhes de partidas com cache automático
- Entrada e saída com feedback em tempo real
- Convites compartilháveis via link (`/invite/{code}`)
- Preview público da partida sem exigir login
- Perfil do usuário com edição de nome e telefone

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS |
| Cache e requisições | TanStack React Query |
| Formulários | React Hook Form + Zod |
| HTTP client | Axios |
| Auth | JWT via cookie |
| Deploy | Vercel |

---

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- Backend [raxa-api](https://github.com/osantosrei/raxa-api) rodando

### 1. Clone o repositório

```bash
git clone https://github.com/osantosrei/raxa-web.git
cd raxa-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

```bash
cp .env.local.example .env.local
```

O arquivo `.env.local.example` já contém o valor padrão para desenvolvimento local:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 4. Inicie o app

```bash
npm run dev
```

Acesse `http://localhost:3000`.

---

## Infraestrutura de produção

| Serviço | Plataforma | URL |
|---|---|---|
| Webapp | Vercel | [raxa-web.vercel.app](https://raxa-web.vercel.app) |
| API | Render | `raxa-api-production.onrender.com` |
| Banco de dados | Supabase | PostgreSQL gerenciado |

Cada `git push` para `main` dispara um novo deploy automático na Vercel.

---

## Páginas

| Rota | Auth | Descrição |
|---|---|---|
| `/login` | — | Login |
| `/register` | — | Cadastro |
| `/matches` | ✓ | Lista de partidas |
| `/matches/new` | ✓ | Criar partida |
| `/matches/{id}` | ✓ | Detalhes, participantes e ações |
| `/invite/{code}` | — | Preview público do convite |
| `/profile` | ✓ | Perfil do usuário |

Rotas marcadas com ✓ redirecionam para `/login` se o usuário não estiver autenticado. O middleware preserva o destino original e retorna ao fluxo após o login.

---

## Fluxo do convite

```
Criador abre /matches/{id}
  └─ vê o widget "Link de convite" (só para criadores)
      └─ copia ou compartilha a URL: raxa-web.vercel.app/invite/{code}

Jogador abre o link no celular
  └─ /invite/{code} carrega o preview da partida (sem login)
      ├─ Logado     → "Confirmar presença" → entra na partida
      └─ Não logado → /login?redirect=/invite/{code} → volta ao convite após autenticar
```

---

## Decisões técnicas

**App Router com Client Components.**
O app usa Client Components (`"use client"`) em todas as páginas interativas. A página `/invite/{code}` poderia ser um Server Component, mas foi mantida como Client Component por simplicidade no MVP — o preview público é resolvido pelo React Query sem exigir autenticação no servidor.

**JWT em cookie.**
O token é armazenado em cookie via `js-cookie` e lido pelo middleware do Next.js para proteger rotas no servidor, sem depender de `localStorage` (inacessível no servidor). O interceptor do Axios injeta o token em todas as requisições autenticadas.

**Middleware para proteção de rotas.**
`src/middleware.ts` intercepta toda navegação, verifica o cookie `raxa_token` e redireciona para `/login` quando necessário — sem lógica de auth espalhada pelas páginas.

**Tipos espelham os DTOs do backend.**
`src/types/api.ts` define as interfaces que refletem exatamente o contrato da `raxa-api`. Mudanças no backend quebram o TypeScript antes de quebrar o app em runtime.

**Web Share API com fallback.**
O botão de compartilhar convite usa `navigator.share` no mobile (abre o sheet nativo do sistema operacional) e cai em cópia para clipboard no desktop, sem dependências externas.

---

## Estrutura do projeto

```
src/
├── app/                   # Rotas (pasta = rota no App Router)
│   ├── layout.tsx         # Layout raiz com providers
│   ├── login/
│   ├── register/
│   ├── matches/
│   │   ├── page.tsx       # Listagem
│   │   ├── new/           # Criação
│   │   └── [id]/          # Detalhes
│   ├── invite/[code]/     # Preview público
│   └── profile/
├── components/
│   ├── layout/            # Header, BottomNav
│   ├── ui/                # Button, Input, Badge, Avatar...
│   └── match/             # MatchCard, MatchActions, InviteShareWidget...
├── hooks/                 # Hooks React Query por recurso
├── api/                   # Funções de chamada HTTP por domínio
├── store/                 # AuthContext
├── lib/                   # cn(), formatMatchDate(), toApiDateTime()
├── middleware.ts           # Proteção de rotas
└── types/
    └── api.ts             # Contratos TypeScript com a raxa-api
```

---

<div align="center">
  <sub>raxa-web · Next.js 15 · Tailwind CSS · Vercel · MVP</sub>
</div>