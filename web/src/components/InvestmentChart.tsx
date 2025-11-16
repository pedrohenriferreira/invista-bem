
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface InvestmentChartProps {
  initialAmount: number;
  monthlyAmount: number;
  interestRate: number;
  period: number;
}

const InvestmentChart = ({ initialAmount, monthlyAmount, interestRate, period }: InvestmentChartProps) => {
  const generateChartData = () => {
    const data = [];
    const monthlyRate = (interestRate / 100) / 12;
    
    for (let month = 0; month <= period; month++) {
      // Valor investido acumulado
      const totalInvested = initialAmount + (monthlyAmount * month);
      
      // Valor com juros compostos
      const futureValueInitial = initialAmount * Math.pow(1 + monthlyRate, month);
      const futureValueMonthly = month > 0 ? monthlyAmount * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) : 0;
      const totalValue = futureValueInitial + futureValueMonthly;
      
      data.push({
        month,
        invested: totalInvested,
        total: totalValue,
        profit: totalValue - totalInvested
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="financial-card col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-financial-blue" />
          <span>Evolução do Investimento</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `${value}m`}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'total' ? 'Valor Total' : 
                  name === 'invested' ? 'Valor Investido' : 'Lucro'
                ]}
                labelFormatter={(month) => `Mês ${month}`}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="invested" 
                stackId="1"
                stroke="#1e40af" 
                fillOpacity={1}
                fill="url(#colorInvested)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stackId="1"
                stroke="#059669" 
                fillOpacity={1}
                fill="url(#colorTotal)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-financial-blue rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Valor Investido</span>
            </div>
            <p className="text-lg font-bold text-financial-blue">
              {formatCurrency(chartData[chartData.length - 1]?.invested || 0)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-financial-green rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Lucro</span>
            </div>
            <p className="text-lg font-bold text-financial-green">
              {formatCurrency(chartData[chartData.length - 1]?.profit || 0)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-gradient-to-r from-financial-blue to-financial-green rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Valor Total</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(chartData[chartData.length - 1]?.total || 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentChart;
