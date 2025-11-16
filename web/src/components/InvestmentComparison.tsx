
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Shield, AlertTriangle, Zap } from "lucide-react";

interface IndicatorData {
  nome: string;
  valor_anual: number;
  ultima_atualizacao?: string;
}

interface IndicatorsResponse {
  selic: IndicatorData;
  cdi: IndicatorData;
  poupanca: IndicatorData;
  ipca: IndicatorData;
}

interface InvestmentComparisonProps {
  initialAmount?: number;
  monthlyAmount?: number;
  period?: number;
  excludeInvestmentType?: string;
}

const InvestmentComparison = ({ 
  initialAmount: propInitialAmount,
  monthlyAmount: propMonthlyAmount,
  period: propPeriod,
  excludeInvestmentType
}: InvestmentComparisonProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState(propPeriod || 12);
  const [indicators, setIndicators] = useState<IndicatorsResponse | null>(null);
  const initialInvestment = propInitialAmount || 10000;
  const monthlyContribution = propMonthlyAmount || 0;

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await fetch('http://localhost:5000/indicators');
        if (response.ok) {
          const data = await response.json();
          setIndicators(data);
        }
      } catch (error) {
        console.error('Erro ao buscar indicadores:', error);
      }
    };

    fetchIndicators();
  }, []);

  // Atualiza o período quando a prop mudar
  useEffect(() => {
    if (propPeriod) {
      setSelectedPeriod(propPeriod);
    }
  }, [propPeriod]);

  const investments = [
    {
      name: "Poupança",
      type: "poupanca",
      rate: indicators?.poupanca.valor_anual || 8.33,
      risk: "Muito Baixo",
      riskLevel: 1,
      liquidity: "Diária",
      icon: Shield,
      color: "bg-gray-500",
      description: "Tradicional e segura"
    },
    {
      name: "CDI",
      type: "cdi",
      rate: indicators?.cdi.valor_anual || 13.75,
      risk: "Baixo",
      riskLevel: 2,
      liquidity: "Diária",
      icon: TrendingUp,
      color: "bg-blue-500",
      description: "Acompanha a taxa básica"
    },
    {
      name: "LCI/LCA (85% CDI)",
      type: "lci",
      rate: indicators?.cdi.valor_anual ? indicators.cdi.valor_anual * 0.85 : 11.5,
      risk: "Baixo",
      riskLevel: 2,
      liquidity: "90 dias",
      icon: Shield,
      color: "bg-green-500",
      description: "Isento de IR"
    },
    {
      name: "CDB (100% CDI)",
      type: "cdb",
      rate: indicators?.cdi.valor_anual || 12.5,
      risk: "Baixo",
      riskLevel: 2,
      liquidity: "Diária",
      icon: TrendingUp,
      color: "bg-purple-500",
      description: "Renda fixa privada"
    },
    {
      name: "Tesouro Selic",
      type: "tesouro",
      rate: indicators?.selic.valor_anual || 12.8,
      risk: "Baixo",
      riskLevel: 2,
      liquidity: "D+1",
      icon: TrendingUp,
      color: "bg-blue-600",
      description: "Governo federal"
    }
  ].filter(inv => inv.type !== excludeInvestmentType);

  const calculateReturn = (rate: number, period: number) => {
    const monthlyRate = rate / 100 / 12;
    
    // Valor inicial com juros compostos
    const futureValueInitial = initialInvestment * Math.pow(1 + monthlyRate, period);
    
    // Valor dos aportes mensais com juros compostos
    const futureValueMonthly = monthlyContribution > 0 
      ? monthlyContribution * ((Math.pow(1 + monthlyRate, period) - 1) / monthlyRate)
      : 0;
    
    return futureValueInitial + futureValueMonthly;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getRiskColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-blue-100 text-blue-800";
      case 3: return "bg-yellow-100 text-yellow-800";
      case 4: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const periods = [6, 12, 24, 36, 60];

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-financial-blue" />
          <span>Comparação de Investimentos</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {monthlyContribution > 0 
            ? `${formatCurrency(initialInvestment)} + ${formatCurrency(monthlyContribution)}/mês por ${selectedPeriod} meses`
            : `Simulação com ${formatCurrency(initialInvestment)} por ${selectedPeriod} meses`
          }
        </p>
        {propInitialAmount && (
          <p className="text-xs text-blue-600 font-medium mt-1">
            ✓ Usando valores do seu simulador
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          {periods.map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? "bg-financial-gradient text-white" : ""}
            >
              {period}m
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {investments.map((investment, index) => {
            const finalValue = calculateReturn(investment.rate, selectedPeriod);
            const totalInvested = initialInvestment + (monthlyContribution * selectedPeriod);
            const profit = finalValue - totalInvested;
            const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${investment.color.replace('bg-', 'bg-')} bg-opacity-10`}>
                      <investment.icon className={`h-5 w-5 ${investment.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{investment.name}</h3>
                      <p className="text-sm text-gray-600">{investment.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 transition-all duration-500">{formatCurrency(finalValue)}</p>
                    <p className="text-sm text-financial-green font-medium transition-all duration-500">
                      +{formatCurrency(profit)} ({profitPercentage.toFixed(1)}%)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Investido: {formatCurrency(totalInvested)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      <span className="font-medium">{investment.rate.toFixed(2)}%</span> a.a.
                    </span>
                    <Badge className={getRiskColor(investment.riskLevel)}>
                      {investment.risk}
                    </Badge>
                    <span className="text-gray-600">
                      Liquidez: <span className="font-medium">{investment.liquidity}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${investment.color} transition-all duration-1000 ease-out`}
                      style={{ 
                        width: `${Math.min((profitPercentage / 30) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentComparison;
