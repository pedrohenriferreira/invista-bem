/**
 * Calcula a evolução de um investimento ao longo do tempo
 */
export function calculateInvestmentEvolution(valorInicial, aporteMensal, taxaJurosAnual, periodoMeses) {
  const evolucao = [];
  const taxaMensal = (taxaJurosAnual / 100) / 12;

  for (let mes = 0; mes <= periodoMeses; mes++) {
    // Valor investido acumulado
    const totalInvestido = valorInicial + (aporteMensal * mes);

    // Valor com juros compostos
    const futureValueInicial = valorInicial * Math.pow(1 + taxaMensal, mes);
    const futureValueMensal = mes > 0 
      ? aporteMensal * ((Math.pow(1 + taxaMensal, mes) - 1) / taxaMensal) 
      : 0;
    
    const valorTotal = futureValueInicial + futureValueMensal;
    const rendimento = valorTotal - totalInvestido;

    evolucao.push({
      mes,
      valor_investido: parseFloat(totalInvestido.toFixed(2)),
      valor_total: parseFloat(valorTotal.toFixed(2)),
      rendimento: parseFloat(rendimento.toFixed(2))
    });
  }

  return evolucao;
}

/**
 * Calcula o valor final de um investimento
 */
export function calculateFinalValue(valorInicial, aporteMensal, taxaJurosAnual, periodoMeses) {
  const evolucao = calculateInvestmentEvolution(valorInicial, aporteMensal, taxaJurosAnual, periodoMeses);
  return evolucao[evolucao.length - 1];
}
