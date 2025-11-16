import axios from 'axios';

// Códigos das séries do SGS (Sistema Gerenciador de Séries Temporais)
const SELIC_META_ANUAL = 1178;
const CDI_DIARIO = 12;
const POUPANCA_MENSAL = 195;

/**
 * Função auxiliar para buscar dados de uma série temporal do SGS
 */
async function fetchSgsData(codigoSerie, dias = 30) {
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
 * Busca os valores mais recentes da Selic, CDI e Poupança e os anualiza
 */
export async function getCurrentIndicators() {
  try {
    // Buscar dados em paralelo
    const [selicData, cdiData, poupancaData] = await Promise.all([
      fetchSgsData(SELIC_META_ANUAL),
      fetchSgsData(CDI_DIARIO),
      fetchSgsData(POUPANCA_MENSAL)
    ]);

    // SELIC - A série 1178 já retorna a meta anual em porcentagem
    const selicAnual = selicData.length > 0 ? parseFloat(selicData[selicData.length - 1].valor) : 0;

    // CDI - Série diária, precisa anualizar
    const cdiDiario = cdiData.length > 0 ? parseFloat(cdiData[cdiData.length - 1].valor) : 0;
    const cdiAnual = (Math.pow(1 + (cdiDiario / 100), 252) - 1) * 100;

    // POUPANÇA - Série mensal, precisa anualizar
    const poupancaMensal = poupancaData.length > 0 ? parseFloat(poupancaData[poupancaData.length - 1].valor) : 0;
    const poupancaAnual = (Math.pow(1 + (poupancaMensal / 100), 12) - 1) * 100;

    return {
      selic: {
        nome: "Taxa Selic",
        valor_anual: parseFloat(selicAnual.toFixed(2))
      },
      cdi: {
        nome: "Taxa CDI",
        valor_anual: parseFloat(cdiAnual.toFixed(2))
      },
      poupanca: {
        nome: "Poupança",
        valor_anual: parseFloat(poupancaAnual.toFixed(2))
      }
    };
  } catch (error) {
    console.error('Erro ao buscar indicadores:', error);
    throw error;
  }
}
