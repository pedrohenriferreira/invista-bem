import express from 'express';
import cors from 'cors';
import { getCurrentIndicators } from './services/bancoCentralService.js';
import { calculateInvestmentEvolution } from './services/calculatorService.js';

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    status: 'API de Investimentos Node.js no ar!',
    version: '1.0.0'
  });
});

// Rota para buscar indicadores do Banco Central
app.get('/indicators', async (req, res) => {
  try {
    const indicators = await getCurrentIndicators();
    res.json(indicators);
  } catch (error) {
    console.error('Erro ao buscar indicadores:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar indicadores do Banco Central',
      message: error.message 
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
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponíveis:`);
  console.log(`   GET  /indicators - Indicadores do Banco Central`);
  console.log(`   POST /calculate   - Calcular investimento`);
  console.log(`   POST /compare     - Comparar investimentos`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
});
