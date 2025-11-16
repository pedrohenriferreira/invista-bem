
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Shield, AlertTriangle, Zap } from "lucide-react";

const InvestmentComparison = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(12);
  const initialInvestment = 10000;

  const investments = [
    {
      name: "Poupança",
      rate: 8.33,
      risk: "Muito Baixo",
      riskLevel: 1,
      liquidity: "Diária",
      icon: Shield,
      color: "bg-gray-500",
      description: "Tradicional e segura"
    },
    {
      name: "CDI",
      rate: 13.75,
      risk: "Baixo",
      riskLevel: 2,
      liquidity: "Diária",
      icon: TrendingUp,
      color: "bg-blue-500",
      description: "Acompanha a taxa básica"
    },
    {
      name: "LCI/LCA",
      rate: 11.5,
      risk: "Baixo",
      riskLevel: 2,
      liquidity: "90 dias",
      icon: Shield,
      color: "bg-green-500",
      description: "Isento de IR"
    },
    {
      name: "Tesouro Selic",
      rate: 12.8,
      risk: "Baixo",
      riskLevel: 2,
      liquidity: "D+1",
      icon: TrendingUp,
      color: "bg-blue-600",
      description: "Governo federal"
    }
  ];

  const calculateReturn = (rate: number, period: number) => {
    const monthlyRate = rate / 100 / 12;
    return initialInvestment * Math.pow(1 + monthlyRate, period);
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
          Simulação com {formatCurrency(initialInvestment)} por {selectedPeriod} meses
        </p>
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
            const profit = finalValue - initialInvestment;
            const profitPercentage = (profit / initialInvestment) * 100;
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
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
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(finalValue)}</p>
                    <p className="text-sm text-financial-green font-medium">
                      +{formatCurrency(profit)} ({profitPercentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      <span className="font-medium">{investment.rate}%</span> a.a.
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
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${investment.color}`}
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
