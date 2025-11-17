import axios from 'axios';

// Códigos das séries do SGS (Sistema Gerenciador de Séries Temporais) - OFICIAL BANCO CENTRAL
const SELIC_META_ANUAL = 1178;  // Taxa Selic Meta definida pelo Copom
const CDI_DIARIO = 12;          // Taxa CDI diária
const POUPANCA_MENSAL = 195;    // Taxa de rendimento da poupança
const IPCA_MENSAL = 433;        // Índice de preços ao consumidor amplo

// Cache para evitar requisições excessivas à API do Banco Central
let cachedIndicators = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em millisegundos

/**
 * Função auxiliar para buscar dados de uma série temporal do SGS
 * Sempre busca os dados mais recentes disponíveis
 */
async function fetchSgsData(codigoSerie, dias = 90) {
  try {
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigoSerie}/dados?formato=json&dataInicial=${formatDate(dataInicio)}&dataFinal=${formatDate(dataFim)}`;
    
    console.log(`📡 Buscando série ${codigoSerie} do Banco Central...`);
    const response = await axios.get(url, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'InvestaBem/1.0'
      }
    });
    
    if (!response.data || response.data.length === 0) {
      throw new Error(`Série ${codigoSerie} retornou vazia`);
    }
    
    console.log(`✅ Série ${codigoSerie}: ${response.data.length} registros obtidos`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar série ${codigoSerie}:`, error.message);
    throw error;
  }
}

/**
 * Busca os valores mais recentes e REAIS da Selic, CDI, Poupança e IPCA
 * Todos os valores são diretos da API oficial do Banco Central do Brasil
 */
export async function getCurrentIndicators() {
  try {
    // Verificar cache
    const now = Date.now();
    if (cachedIndicators && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('📦 Usando indicadores em cache (atualizados há', Math.round((now - lastFetchTime) / 60000), 'minutos)');
      return cachedIndicators;
    }

    console.log('🔍 Buscando indicadores ATUALIZADOS do Banco Central do Brasil...');
    console.log('📅 Data da consulta:', new Date().toLocaleString('pt-BR'));
    
    // Buscar dados em paralelo direto da fonte oficial
    // IPCA precisa de 365 dias para garantir 12 meses completos de dados mensais
    const [selicData, cdiData, poupancaData, ipcaData] = await Promise.all([
      fetchSgsData(SELIC_META_ANUAL, 90),
      fetchSgsData(CDI_DIARIO, 30),          // CDI é diário, 30 dias são suficientes
      fetchSgsData(POUPANCA_MENSAL, 90),
      fetchSgsData(IPCA_MENSAL, 365)         // 365 dias para garantir 12 meses
    ]);

    // Validar se temos dados
    if (!selicData.length || !cdiData.length || !poupancaData.length || !ipcaData.length) {
      throw new Error('Dados incompletos do Banco Central');
    }

    // ============ SELIC ============
    // Série 1178: Meta Selic anual definida pelo Copom
    // Já vem em % anual, é o valor oficial usado pelo mercado
    const selicUltimo = selicData[selicData.length - 1];
    const selicAnual = parseFloat(selicUltimo.valor);

    // ============ CDI ============
    // Série 12: Taxa CDI diária (% ao dia)
    // Fórmula oficial de anualização: ((1 + taxa_diaria/100)^252 - 1) * 100
    // 252 = número de dias úteis no ano
    const cdiUltimo = cdiData[cdiData.length - 1];
    const cdiDiario = parseFloat(cdiUltimo.valor);
    const cdiAnual = (Math.pow(1 + (cdiDiario / 100), 252) - 1) * 100;

    // ============ POUPANÇA ============
    // Série 195: Rendimento mensal da poupança (% ao mês)
    // Fórmula oficial de anualização: ((1 + taxa_mensal/100)^12 - 1) * 100
    const poupancaUltimo = poupancaData[poupancaData.length - 1];
    const poupancaMensal = parseFloat(poupancaUltimo.valor);
    const poupancaAnual = (Math.pow(1 + (poupancaMensal / 100), 12) - 1) * 100;

    // ============ IPCA ============
    // Série 433: Variação mensal do IPCA (% ao mês)
    // Cálculo do acumulado 12 meses com juros compostos
    if (ipcaData.length < 12) {
      throw new Error(`IPCA: dados insuficientes (${ipcaData.length} meses, necessário 12)`);
    }
    
    const ultimos12Meses = ipcaData.slice(-12);
    let ipcaAcumulado12Meses = ultimos12Meses.reduce((acumulado, item) => {
      const variacao = parseFloat(item.valor);
      return ((1 + acumulado / 100) * (1 + variacao / 100) - 1) * 100;
    }, 0);

    const ipcaUltimo = ipcaData[ipcaData.length - 1];

    // Log detalhado dos valores REAIS obtidos
    console.log('\n✅ ===== INDICADORES OFICIAIS DO BANCO CENTRAL =====');
    console.log(`📊 SELIC Meta: ${selicAnual.toFixed(2)}% a.a. | Data: ${selicUltimo.data}`);
    console.log(`📊 CDI: ${cdiAnual.toFixed(2)}% a.a. (base: ${cdiDiario.toFixed(4)}% ao dia) | Data: ${cdiUltimo.data}`);
    console.log(`📊 POUPANÇA: ${poupancaAnual.toFixed(2)}% a.a. (base: ${poupancaMensal.toFixed(2)}% ao mês) | Data: ${poupancaUltimo.data}`);
    console.log(`📊 IPCA 12 meses: ${ipcaAcumulado12Meses.toFixed(2)}% | Data: ${ipcaUltimo.data}`);
    console.log('================================================\n');

    const indicators = {
      selic: {
        nome: "Taxa Selic Meta",
        valor_anual: parseFloat(selicAnual.toFixed(2)),
        ultima_atualizacao: selicUltimo.data,
        fonte: "Banco Central do Brasil - Série 1178"
      },
      cdi: {
        nome: "Taxa CDI",
        valor_anual: parseFloat(cdiAnual.toFixed(2)),
        valor_diario: parseFloat(cdiDiario.toFixed(4)),
        ultima_atualizacao: cdiUltimo.data,
        fonte: "Banco Central do Brasil - Série 12"
      },
      poupanca: {
        nome: "Rendimento Poupança",
        valor_anual: parseFloat(poupancaAnual.toFixed(2)),
        valor_mensal: parseFloat(poupancaMensal.toFixed(2)),
        ultima_atualizacao: poupancaUltimo.data,
        fonte: "Banco Central do Brasil - Série 195"
      },
      ipca: {
        nome: "IPCA (12 meses)",
        valor_anual: parseFloat(ipcaAcumulado12Meses.toFixed(2)),
        ultima_atualizacao: ipcaUltimo.data,
        fonte: "Banco Central do Brasil - Série 433"
      }
    };

    // Atualizar cache
    cachedIndicators = indicators;
    lastFetchTime = now;

    return indicators;
  } catch (error) {
    console.error('❌ ERRO CRÍTICO ao buscar indicadores:', error.message);
    
    // Se temos cache, usar mesmo que expirado
    if (cachedIndicators) {
      console.warn('⚠️ Usando cache expirado devido a erro na API');
      return cachedIndicators;
    }
    
    throw new Error(`Falha ao obter dados do Banco Central: ${error.message}`);
  }
}

/**
 * Limpa o cache forçando nova busca na próxima chamada
 */
export function clearCache() {
  cachedIndicators = null;
  lastFetchTime = null;
  console.log('🗑️ Cache de indicadores limpo');
}
