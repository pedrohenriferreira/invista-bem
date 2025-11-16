# 💰 Invista Bem

Simulador de Investimentos com dados reais do Banco Central do Brasil.

## 📁 Estrutura do Projeto

```
invista-bem/
├── web/          # Frontend - React + Vite + shadcn/ui
└── api/          # Backend - Node.js + Express
```

## 🚀 Como Executar

### Backend (API)

```bash
cd api
npm install
npm start
```

Servidor rodará em `http://localhost:5000`

### Frontend (Web)

```bash
cd web
npm install
npm run dev
```

Aplicação rodará em `http://localhost:5173`

## 📊 Funcionalidades

- ✅ Simulador de investimentos com juros compostos
- ✅ Dados reais do Banco Central (Selic, CDI, Poupança)
- ✅ Comparação entre diferentes tipos de investimento
- ✅ Gráficos interativos de evolução
- ✅ Interface moderna com shadcn/ui

## 🛠️ Tecnologias

**Frontend:**
- React 18
- TypeScript
- Vite
- shadcn/ui
- TailwindCSS
- Recharts

**Backend:**
- Node.js
- Express
- Axios
- CORS

## 📡 API Endpoints

- `GET /indicators` - Indicadores do Banco Central
- `POST /calculate` - Calcular investimento
- `POST /compare` - Comparar investimentos
