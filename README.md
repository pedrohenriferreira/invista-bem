# 💰 Invista Bem

> Simulador de investimentos em renda fixa com dados reais do Banco Central do Brasil.

[![Node](https://img.shields.io/badge/Node-v18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)

## 📋 Sobre o Projeto

O **Invista Bem** é uma aplicação web completa para simulação de investimentos em renda fixa, oferecendo:

- 📊 **Dados em tempo real** da API do Banco Central do Brasil
- 💹 **Cálculos precisos** com juros compostos e aportes mensais
- 📈 **Visualizações interativas** da evolução dos investimentos
- 🔄 **Comparação automática** entre diferentes modalidades
- 💾 **Histórico de análises** salvo localmente (até 50 simulações)

## 🎯 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- **Cadastro de usuários** com validação de dados
- **Login seguro** com JWT (JSON Web Token)
- **Senha criptografada** com bcrypt
- **Sessão persistente** com token no localStorage
- **Avatar personalizado** com iniciais do nome
- **Histórico individual** por usuário autenticado

### 📊 Indicadores do Mercado
- **Taxa Selic** - Meta anual do Banco Central
- **CDI** - Taxa diária anualizada (252 dias úteis)
- **Poupança** - Rendimento mensal anualizado
- **IPCA** - Acumulado dos últimos 12 meses

### 💰 Simulador de Investimentos
- **5 modalidades**: CDI 100%, CDB 100% CDI, Tesouro Selic, LCI/LCA 85% CDI, Poupança
- **Cálculos com juros compostos**: valor inicial + aportes mensais
- **Taxas atualizadas automaticamente** via API Banco Central
- **Resultados instantâneos**: valor total, lucro e rentabilidade

### 📈 Visualização de Dados
- **Gráfico de evolução**: área empilhada mostrando valor investido vs lucro
- **Comparação entre investimentos**: todos os produtos lado a lado
- **Métricas detalhadas**: valores formatados em BRL com percentuais

### 🗂️ Histórico de Análises (Autenticado)
- **Salvamento automático** apenas para usuários logados
- **Histórico individual** por usuário (localStorage com chave `analysisHistory_${userId}`)
- **Visualização organizada** com data, hora e badges coloridos
- **Click-to-load**: clique em uma análise para recarregar os dados
- **Scroll automático** para os resultados ao carregar
- **Prevenção de duplicatas**: não salva ao carregar do histórico
- **Botão de limpar** com confirmação para remover histórico do usuário
- **Toast informativo**: avisa quando não autenticado que é necessário login

## 📁 Estrutura do Projeto

```
invista-bem/
├── web/                          # Frontend
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── Header.tsx       # Cabeçalho + Histórico (Sheet)
│   │   │   ├── FinancialMetrics.tsx  # Cards de indicadores
│   │   │   ├── InvestmentSimulator.tsx  # Formulário de simulação
│   │   │   ├── InvestmentChart.tsx      # Gráfico de evolução
│   │   │   └── InvestmentComparison.tsx # Comparação de produtos
│   │   ├── pages/
│   │   │   └── Index.tsx        # Página principal
│   │   ├── lib/
│   │   │   └── utils.ts         # Utilitários
│   │   └── hooks/               # Custom hooks
│   ├── package.json
│   └── vite.config.ts
│
└── api/                          # Backend
    ├── services/
    │   └── bancoCentralService.js  # Integração API BCB
    ├── index.js                 # Servidor Express
    └── package.json
```

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** v18 ou superior
- **npm** ou **yarn**

### 1️⃣ Backend (API)

```bash
# Navegue até a pasta da API
cd api

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

✅ Servidor rodará em `http://localhost:5000`

**Endpoints disponíveis:**
- `GET /indicators` - Retorna Selic, CDI, Poupança e IPCA

### 2️⃣ Frontend (Web)

```bash
# Navegue até a pasta web
cd web

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

✅ Aplicação rodará em `http://localhost:8080`

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| React | 18.x | Biblioteca UI |
| TypeScript | 5.x | Superset JavaScript |
| Vite | 5.x | Build tool |
| shadcn/ui | latest | Componentes acessíveis |
| TailwindCSS | 3.x | Framework CSS |
| Recharts | 2.x | Biblioteca de gráficos |
| Lucide React | latest | Ícones |

### Backend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| Node.js | 18+ | Runtime JavaScript |
| Express | 4.x | Framework web |
| Axios | 1.x | Cliente HTTP |
| CORS | 2.x | Middleware CORS |
| bcryptjs | 2.x | Criptografia de senhas |
| jsonwebtoken | 9.x | Autenticação JWT |

## 📡 Integração com Banco Central

A aplicação consome dados da API pública do Banco Central do Brasil:

**Base URL:** `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados`

### Séries Utilizadas (SGS)
| Indicador | Código SGS | Periodicidade | Dias Consultados |
|-----------|-----------|---------------|------------------|
| SELIC Meta | 1178 | Anual | 90 |
| CDI | 12 | Diário | 90 |
| Poupança | 195 | Mensal | 90 |
| IPCA | 433 | Mensal | 365 |

### Transformações
- **SELIC**: Valor já retorna anual em %
- **CDI**: `((1 + taxa_diaria/100)^252 - 1) * 100`
- **Poupança**: `((1 + taxa_mensal/100)^12 - 1) * 100`
- **IPCA**: Acumulado dos últimos 12 meses com juros compostos

## 💡 Recursos Avançados

### Cálculo de Juros Compostos

```typescript
// Valor futuro do investimento inicial
FV_inicial = VP * (1 + i)^n

// Valor futuro dos aportes mensais
FV_aportes = PMT * [((1 + i)^n - 1) / i]

// Valor total
Valor_Total = FV_inicial + FV_aportes
```

Onde:
- `VP` = Valor Presente (investimento inicial)
- `PMT` = Pagamento (aporte mensal)
- `i` = Taxa mensal (taxa_anual / 12 / 100)
- `n` = Número de meses

### LocalStorage Schema

**Chave de armazenamento:** `analysisHistory_${userId}` (específico por usuário)

```typescript
interface Analysis {
  id: string;                    // timestamp + random
  date: string;                  // dd/MM/yyyy
  time: string;                  // HH:mm
  investmentType: string;        // 'cdi' | 'cdb' | 'tesouro' | 'lci' | 'poupanca'
  initialAmount: number;         // R$
  monthlyAmount: number;         // R$
  period: number;                // meses
  interestRate: number;          // % a.a.
  totalValue: number;            // R$ (valor final)
  profit: number;                // R$ (lucro)
}

// Máximo: 50 análises por usuário
// Ordenação: Mais recente primeiro
```

**Token de Autenticação:** `token` (JWT no localStorage)  
**Dados do Usuário:** `investaBem_user` (objeto JSON com id, name, email)

## 🔐 API de Autenticação

### Endpoints

#### POST `/auth/register`
Cadastrar novo usuário

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "(11) 98765-4321",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user_id_123",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321",
    "createdAt": "2025-11-16T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/auth/login`
Fazer login

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id_123",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/auth/me`
Verificar token (rota protegida)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id_123",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

## 🎨 Design System

### Cores Principais
- **Financial Blue**: `#1e40af` - Investido
- **Financial Green**: `#059669` - Lucro/Rendimento
- **Gradiente**: `from-financial-blue to-financial-green`

### Componentes shadcn/ui
- Card, Button, Input, Label
- Select, Badge, Sheet, ScrollArea
- AlertDialog, Skeleton, Toaster

## 📝 Scripts Disponíveis

### Frontend (web/)
```bash
npm run dev          # Desenvolvimento (http://localhost:8080)
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executar ESLint
```

### Backend (api/)
```bash
npm start            # Inicia servidor (http://localhost:5000)
npm run dev          # Desenvolvimento com nodemon (se configurado)
```

