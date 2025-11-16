
import { useState } from "react";
import Header from "@/components/Header";
import InvestmentSimulator from "@/components/InvestmentSimulator";
import InvestmentChart from "@/components/InvestmentChart";
import FinancialMetrics from "@/components/FinancialMetrics";
import InvestmentComparison from "@/components/InvestmentComparison";

const Index = () => {
  const [simulationParams, setSimulationParams] = useState({
    initialAmount: 1000,
    monthlyAmount: 100,
    interestRate: 12,
    period: 12
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-financial-gradient rounded-2xl text-white">
          <h1 className="text-4xl font-bold mb-4">
            Simule seus Investimentos
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Descubra o potencial dos seus investimentos com nossa calculadora avançada.
            Compare diferentes modalidades e tome decisões mais inteligentes.
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
          <InvestmentSimulator />
        </section>

        {/* Investment Chart */}
        <section>
          <InvestmentChart 
            initialAmount={simulationParams.initialAmount}
            monthlyAmount={simulationParams.monthlyAmount}
            interestRate={simulationParams.interestRate}
            period={simulationParams.period}
          />
        </section>

        {/* Investment Comparison */}
        <section id="investment-comparison">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compare Investimentos</h2>
          <InvestmentComparison />
        </section>
      </main>
    </div>
  );
};

export default Index;
