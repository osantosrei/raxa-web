# Raxa Web

Webapp do Raxa para organizar peladas, integrado ao backend `raxa-api`.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form + Zod
- Axios
- JWT via `Authorization: Bearer <token>`

## Requisitos

- Node.js 20+
- npm
- Backend `raxa-api` rodando em `http://localhost:8080`

## Configuração local

Crie o arquivo `.env.local` a partir do exemplo:

```bash
cp .env.local.example .env.local
```

Variável local padrão:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Instale as dependências:

```bash
npm install
```

Rode o app:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Integração com a API

O backend esperado expõe:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `POST /api/v1/matches`
- `GET /api/v1/matches`
- `GET /api/v1/matches/{id}`
- `DELETE /api/v1/matches/{id}`
- `POST /api/v1/matches/{id}/join`
- `DELETE /api/v1/matches/{id}/leave`
- `GET /api/v1/matches/{id}/players`
- `GET /api/v1/invites/{code}/resolve`
- `POST /api/v1/invites/{code}/join`

## Deploy

Produção prevista na Vercel.

Configure no painel da Vercel:

```env
NEXT_PUBLIC_API_URL=https://raxa-api-production.up.railway.app/api/v1
```

URL de produção do webapp:

```text
https://raxa-web.vercel.app
```

## Pendência de CORS no backend

Antes do deploy público, o `raxa-api` precisa liberar a origem da Vercel.

Exemplo:

```java
config.setAllowedOrigins(List.of(
    "http://localhost:3000",
    "https://raxa-web.vercel.app"
));
```

Substitua `https://raxa-web.vercel.app` pela URL real gerada na Vercel.
