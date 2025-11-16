
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";

const InvestmentSimulator = () => {
  const [initialAmount, setInitialAmount] = useState<number>(1000);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(100);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [period, setPeriod] = useState<number>(12);
  const [investmentType, setInvestmentType] = useState<string>("cdi");
  const [results, setResults] = useState<any>(null);

  const investmentTypes = {
    cdi: { name: "CDI", rate: 13.75, risk: "Baixo" },
    lci: { name: "LCI/LCA", rate: 11.5, risk: "Baixo" },
    tesouro: { name: "Tesouro Direto", rate: 12.8, risk: "Baixo" },
    acoes: { name: "Ações", rate: 15.2, risk: "Alto" },
    fundos: { name: "Fundos", rate: 14.1, risk: "Médio" }
  };

  const calculateInvestment = () => {
    const monthlyRate = (interestRate / 100) / 12;
    const months = period;
    
    // Valor inicial com juros compostos
    const futureValueInitial = initialAmount * Math.pow(1 + monthlyRate, months);
    
    // Valor dos aportes mensais
    const futureValueMonthly = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const totalFutureValue = futureValueInitial + futureValueMonthly;
    const totalInvested = initialAmount + (monthlyAmount * months);
    const totalReturn = totalFutureValue - totalInvested;
    const returnPercentage = (totalReturn / totalInvested) * 100;

    setResults({
      totalInvested,
      totalFutureValue,
      totalReturn,
      returnPercentage,
      monthlyRate: interestRate / 12
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card className="financial-card w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-financial-blue" />
            <span>Parâmetros da Simulação</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="investment-type">Tipo de Investimento</Label>
            <Select value={investmentType} onValueChange={setInvestmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(investmentTypes).map(([key, type]) => (
                  <SelectItem key={key} value={key}>
                    {type.name} - {type.rate}% a.a. (Risco {type.risk})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial-amount">Valor Inicial</Label>
              <Input
                id="initial-amount"
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-amount">Aporte Mensal</Label>
              <Input
                id="monthly-amount"
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Taxa de Juros (% a.a.)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                placeholder="12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Período (meses)</Label>
              <Input
                id="period"
                type="number"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                placeholder="12"
              />
            </div>
          </div>

          <Button 
            onClick={calculateInvestment}
            className="w-full bg-financial-gradient hover:opacity-90 text-white"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Calcular Investimento
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="financial-card w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-financial-green" />
              <span>Resultados da Simulação</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Total Investido</p>
                <p className="text-2xl font-bold text-financial-blue">
                  {formatCurrency(results.totalInvested)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Valor Final</p>
                <p className="text-2xl font-bold text-financial-green">
                  {formatCurrency(results.totalFutureValue)}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-financial-blue to-financial-green p-4 rounded-lg text-white">
              <p className="text-sm opacity-90 font-medium">Rendimento Total</p>
              <p className="text-3xl font-bold">
                {formatCurrency(results.totalReturn)}
              </p>
              <p className="text-sm opacity-90">
                {results.returnPercentage.toFixed(2)}% de rentabilidade
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <p className="text-sm text-gray-600">Rentabilidade Mensal</p>
                <p className="text-lg font-semibold text-financial-blue">
                  {results.monthlyRate.toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Período</p>
                <p className="text-lg font-semibold text-financial-blue">
                  {period} meses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestmentSimulator;
