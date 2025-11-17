
import { useState } from "react";
import Header from "@/components/Header";
import InvestmentSimulator from "@/components/InvestmentSimulator";
import InvestmentChart from "@/components/InvestmentChart";
import FinancialMetrics from "@/components/FinancialMetrics";
import InvestmentComparison from "@/components/InvestmentComparison";

interface Analysis {
  id: string;
  date: string;
  time: string;
  investmentType: string;
  initialAmount: number;
  monthlyAmount: number;
  period: number;
  interestRate: number;
  totalValue: number;
  profit: number;
}

const Index = () => {
  console.log('🏠 Index page renderizada');
  
  const [simulationParams, setSimulationParams] = useState({
    initialAmount: 1000,
    monthlyAmount: 100,
    interestRate: 12,
    period: 12,
    investmentType: 'cdi'
  });
  const [showResults, setShowResults] = useState(false);
  const [loadedAnalysis, setLoadedAnalysis] = useState<Analysis | null>(null);

  const handleSimulationUpdate = (params: typeof simulationParams) => {
    setSimulationParams(params);
    setShowResults(true);
  };

  const handleLoadAnalysis = (analysis: Analysis) => {
    // Atualiza os parâmetros com os dados da análise
    const params = {
      initialAmount: analysis.initialAmount,
      monthlyAmount: analysis.monthlyAmount,
      interestRate: analysis.interestRate,
      period: analysis.period,
      investmentType: analysis.investmentType
    };
    setSimulationParams(params);
    setLoadedAnalysis(analysis);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLoadAnalysis={handleLoadAnalysis} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-financial-gradient rounded-2xl text-white">
          <h1 className="text-4xl font-bold mb-4">
            Simule seus Investimentos em Renda Fixa
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Compare CDI, CDB, Tesouro Selic, LCI/LCA e Poupança com taxas reais do mercado.
            Tome decisões mais inteligentes sobre seus investimentos de renda fixa.
          </p>
        </div>

        {/* Financial Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Indicadores do Mercado</h2>
          <FinancialMetrics />
        </section>

        {/* Investment Simulator */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulador de Investimentos</h2>
          <InvestmentSimulator 
            onSimulationUpdate={handleSimulationUpdate}
            loadedAnalysis={loadedAnalysis}
            onAnalysisLoaded={() => setLoadedAnalysis(null)}
          />
        </section>

        {/* Investment Chart - Only show after calculation */}
        {showResults && (
          <section id="investment-results">
            <InvestmentChart 
              initialAmount={simulationParams.initialAmount}
              monthlyAmount={simulationParams.monthlyAmount}
              interestRate={simulationParams.interestRate}
              period={simulationParams.period}
            />
          </section>
        )}

        {/* Investment Comparison - Only show after calculation */}
        {showResults && (
          <section id="investment-comparison">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Compare Investimentos</h2>
            <InvestmentComparison 
              initialAmount={simulationParams.initialAmount}
              monthlyAmount={simulationParams.monthlyAmount}
              period={simulationParams.period}
              excludeInvestmentType={simulationParams.investmentType}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
