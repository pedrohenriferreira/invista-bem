import express from 'express';
import cors from 'cors';
import { getCurrentIndicators, clearCache } from './services/bancoCentralService.js';
import { calculateInvestmentEvolution } from './services/calculatorService.js';
import { registerUser, loginUser, verifyToken, authenticateToken } from './services/authService.js';

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    status: 'API de Investimentos Node.js no ar!',
    version: '1.0.0',
    endpoints: {
      'POST /auth/register': 'Cadastrar novo usuário',
      'POST /auth/login': 'Fazer login',
      'GET /auth/me': 'Verificar token (protegido)',
      'GET /indicators': 'Indicadores do Banco Central (cache: 1h)',
      'POST /indicators/refresh': 'Forçar atualização dos indicadores',
      'POST /calculate': 'Calcular investimento',
      'POST /compare': 'Comparar investimentos'
    }
  });
});

// ============ ROTAS DE AUTENTICAÇÃO ============

// Rota de cadastro
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Senha muito curta',
        message: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    const result = await registerUser(name, email, phone, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    
    if (error.message === 'Email já cadastrado') {
      return res.status(409).json({ 
        error: 'Email já cadastrado',
        message: 'Este email já está em uso'
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao cadastrar usuário',
      message: error.message 
    });
  }
});

// Rota de login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'Email e senha são obrigatórios'
      });
    }

    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    
    if (error.message === 'Email ou senha inválidos') {
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao fazer login',
      message: error.message 
    });
  }
});

// Rota para verificar token (rota protegida)
app.get('/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ============ ROTAS DE INDICADORES E CÁLCULOS ============

// Rota para buscar indicadores do Banco Central (com cache)
app.get('/indicators', async (req, res) => {
  try {
    console.log('📡 Requisição recebida: GET /indicators');
    const indicators = await getCurrentIndicators();
    res.json(indicators);
  } catch (error) {
    console.error('❌ Erro ao buscar indicadores:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar indicadores do Banco Central',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rota para forçar atualização dos indicadores (limpa cache)
app.post('/indicators/refresh', async (req, res) => {
  try {
    console.log('🔄 Requisição recebida: POST /indicators/refresh - Forçando atualização...');
    clearCache();
    const indicators = await getCurrentIndicators();
    res.json({ 
      success: true,
      message: 'Indicadores atualizados com sucesso do Banco Central',
      data: indicators,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar indicadores:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao atualizar indicadores',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rota para calcular evolução do investimento
app.post('/calculate', (req, res) => {
  try {
    const { valor_inicial, aporte_mensal, taxa_juros_anual, periodo_meses } = req.body;

    // Validação básica
    if (
      valor_inicial === undefined || 
      aporte_mensal === undefined || 
      taxa_juros_anual === undefined || 
      periodo_meses === undefined
    ) {
      return res.status(400).json({ 
        error: 'Parâmetros inválidos',
        message: 'Todos os campos são obrigatórios: valor_inicial, aporte_mensal, taxa_juros_anual, periodo_meses'
      });
    }

    const evolucao = calculateInvestmentEvolution(
      parseFloat(valor_inicial),
      parseFloat(aporte_mensal),
      parseFloat(taxa_juros_anual),
      parseInt(periodo_meses)
    );

    res.json({ evolucao });
  } catch (error) {
    console.error('Erro ao calcular investimento:', error);
    res.status(500).json({ 
      error: 'Erro ao calcular investimento',
      message: error.message 
    });
  }
});

// Rota para comparar investimentos
app.post('/compare', async (req, res) => {
  try {
    const { valor_inicial, aporte_mensal, taxa_juros_anual, periodo_meses } = req.body;

    // Validação básica
    if (
      valor_inicial === undefined || 
      aporte_mensal === undefined || 
      taxa_juros_anual === undefined || 
      periodo_meses === undefined
    ) {
      return res.status(400).json({ 
        error: 'Parâmetros inválidos',
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Buscar indicadores do Banco Central
    const indicators = await getCurrentIndicators();

    // Calcular para cada tipo de investimento
    const simulacaoUsuario = calculateInvestmentEvolution(
      parseFloat(valor_inicial),
      parseFloat(aporte_mensal),
      parseFloat(taxa_juros_anual),
      parseInt(periodo_meses)
    );

    const poupanca = calculateInvestmentEvolution(
      parseFloat(valor_inicial),
      parseFloat(aporte_mensal),
      indicators.poupanca.valor_anual,
      parseInt(periodo_meses)
    );

    const tesouroSelic = calculateInvestmentEvolution(
      parseFloat(valor_inicial),
      parseFloat(aporte_mensal),
      indicators.selic.valor_anual,
      parseInt(periodo_meses)
    );

    const cdb100Cdi = calculateInvestmentEvolution(
      parseFloat(valor_inicial),
      parseFloat(aporte_mensal),
      indicators.cdi.valor_anual,
      parseInt(periodo_meses)
    );

    res.json({
      simulacao_usuario: simulacaoUsuario,
      poupanca,
      tesouro_selic: tesouroSelic,
      cdb_100_cdi: cdb100Cdi
    });
  } catch (error) {
    console.error('Erro ao comparar investimentos:', error);
    res.status(500).json({ 
      error: 'Erro ao comparar investimentos',
      message: error.message 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 ======================================`);
  console.log(`   API Invista Bem - BACKEND OFICIAL`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`======================================`);
  console.log(`\n📊 Endpoints de Indicadores (Banco Central):`);
  console.log(`   GET  /indicators        - Buscar indicadores (cache: 1h)`);
  console.log(`   POST /indicators/refresh - Forçar atualização`);
  console.log(`\n🔐 Endpoints de Autenticação:`);
  console.log(`   POST /auth/register - Cadastrar usuário`);
  console.log(`   POST /auth/login    - Login`);
  console.log(`   GET  /auth/me       - Verificar token`);
  console.log(`\n💰 Endpoints de Cálculos:`);
  console.log(`   POST /calculate - Calcular investimento`);
  console.log(`   POST /compare   - Comparar investimentos`);
  console.log(`\n⏰ Servidor iniciado em: ${new Date().toLocaleString('pt-BR')}`);
  console.log(`✅ Dados 100% REAIS do Banco Central do Brasil\n`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
});
