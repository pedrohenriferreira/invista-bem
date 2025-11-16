import axios from 'axios';

// Códigos das séries do SGS (Sistema Gerenciador de Séries Temporais)
const SELIC_META_ANUAL = 1178;
const CDI_DIARIO = 12;
const POUPANCA_MENSAL = 195;
const IPCA_MENSAL = 433;

/**
 * Função auxiliar para buscar dados de uma série temporal do SGS
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

    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar série ${codigoSerie}:`, error.message);
    return [];
  }
}

/**
 * Busca os valores mais recentes da Selic, CDI, Poupança e IPCA e os anualiza
 */
export async function getCurrentIndicators() {
  try {
    console.log('🔍 Buscando indicadores do Banco Central...');
    
    // Buscar dados em paralelo
    // IPCA precisa de 365 dias para ter 12 meses de dados mensais
    const [selicData, cdiData, poupancaData, ipcaData] = await Promise.all([
      fetchSgsData(SELIC_META_ANUAL),
      fetchSgsData(CDI_DIARIO),
      fetchSgsData(POUPANCA_MENSAL),
      fetchSgsData(IPCA_MENSAL, 365)
    ]);

    // SELIC - A série 1178 já retorna a meta anual em porcentagem
    const selicUltimo = selicData[selicData.length - 1];
    const selicAnual = selicData.length > 0 ? parseFloat(selicUltimo.valor) : 0;

    // CDI - Série diária, precisa anualizar
    const cdiUltimo = cdiData[cdiData.length - 1];
    const cdiDiario = cdiData.length > 0 ? parseFloat(cdiUltimo.valor) : 0;
    const cdiAnual = (Math.pow(1 + (cdiDiario / 100), 252) - 1) * 100;

    // POUPANÇA - Série mensal, precisa anualizar
    const poupancaUltimo = poupancaData[poupancaData.length - 1];
    const poupancaMensal = poupancaData.length > 0 ? parseFloat(poupancaUltimo.valor) : 0;
    const poupancaAnual = (Math.pow(1 + (poupancaMensal / 100), 12) - 1) * 100;

    // IPCA - Série mensal, calcular acumulado 12 meses
    let ipcaAcumulado12Meses = 0;
    if (ipcaData.length >= 12) {
      const ultimos12Meses = ipcaData.slice(-12);
      ipcaAcumulado12Meses = ultimos12Meses.reduce((acc, item) => {
        return (1 + acc / 100) * (1 + parseFloat(item.valor) / 100) * 100 - 100;
      }, 0);
    }
    const ipcaUltimo = ipcaData[ipcaData.length - 1];

    console.log('✅ Indicadores obtidos com sucesso:');
    console.log(`   Selic: ${selicAnual.toFixed(2)}% (data: ${selicUltimo?.data})`);
    console.log(`   CDI: ${cdiAnual.toFixed(2)}% (data: ${cdiUltimo?.data})`);
    console.log(`   Poupança: ${poupancaAnual.toFixed(2)}% (data: ${poupancaUltimo?.data})`);
    console.log(`   IPCA 12m: ${ipcaAcumulado12Meses.toFixed(2)}% (data: ${ipcaUltimo?.data})`);

    return {
      selic: {
        nome: "Taxa Selic",
        valor_anual: parseFloat(selicAnual.toFixed(2)),
        ultima_atualizacao: selicUltimo?.data
      },
      cdi: {
        nome: "Taxa CDI",
        valor_anual: parseFloat(cdiAnual.toFixed(2)),
        ultima_atualizacao: cdiUltimo?.data
      },
      poupanca: {
        nome: "Poupança",
        valor_anual: parseFloat(poupancaAnual.toFixed(2)),
        ultima_atualizacao: poupancaUltimo?.data
      },
      ipca: {
        nome: "IPCA",
        valor_anual: parseFloat(ipcaAcumulado12Meses.toFixed(2)),
        ultima_atualizacao: ipcaUltimo?.data
      }
    };
  } catch (error) {
    console.error('❌ Erro ao buscar indicadores:', error);
    throw error;
  }
}
