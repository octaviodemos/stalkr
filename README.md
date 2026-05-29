# Stalkr

Web app para descobrir quem qualquer usuário do Instagram segue, classificado por gênero (Homens / Mulheres / Desconhecido). Tudo roda no servidor — sem extensão de navegador.

## Estrutura

```
stalkr/
├── backend/     # Node.js + Express API (porta 3001)
└── landing/     # Next.js 14 + Tailwind (porta 3000)
```

## Pré-requisitos

- Node.js 18+
- Conta [Supabase](https://supabase.com) com as tabelas do schema
- Token [Apify](https://apify.com) (Instagram Following Scraper)
- Conta [Stripe](https://stripe.com) com produtos/preços configurados
- API gratuita [genderize.io](https://genderize.io) (sem chave obrigatória)

## Configuração

### 1. Supabase

Execute o SQL em `backend/sql/schema.sql` no SQL Editor do Supabase.

Use a **service role key** no backend (nunca exponha no frontend).

### 2. Backend

```bash
cd backend
cp .env.example .env
# Preencha todas as variáveis TODO_*
npm install
npm run dev
```

### 3. Frontend

```bash
cd landing
cp .env.example .env.local
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### 4. Stripe Webhook (desenvolvimento)

```bash
stripe listen --forward-to localhost:3001/api/webhook/stripe
```

Copie o `whsec_...` para `STRIPE_WEBHOOK_SECRET` no `.env` do backend.

## API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | — | Cria usuário + 1 crédito grátis |
| POST | `/api/auth/login` | — | Retorna JWT |
| GET | `/api/credits` | JWT | Créditos restantes |
| POST | `/api/credits/use` | JWT | Deduz 1 crédito |
| POST | `/api/credits/checkout` | JWT | Inicia Stripe Checkout |
| POST | `/api/analyze` | JWT | Analisa following + gênero |
| GET | `/api/analyze/history` | JWT | Histórico de análises |
| POST | `/api/webhook/stripe` | Stripe | Adiciona créditos |

JWT: header `Authorization: Bearer <token>` (armazenado no frontend como `stalkr_token`).

## Preços

- R$ 9,90 — 1 crédito
- R$ 34,90 — 5 créditos
- R$ 19,90/mês — ilimitado por 30 dias

Configure os Price IDs no Stripe Dashboard e cole em `STRIPE_PRICE_*` no `.env`.

## Fluxo de análise

1. Usuário autenticado digita username na home
2. Frontend chama `POST /api/credits/use`
3. Frontend chama `POST /api/analyze`
4. Backend busca following via Apify → classifica com genderize.io → salva em `analyses`
5. Resultado exibido em 3 colunas; modal de compra se créditos = 0
