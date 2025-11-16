
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Target } from "lucide-react";

const FinancialMetrics = () => {
  const metrics = [
    {
      title: "CDI Atual",
      value: "13,75%",
      change: "+0.25%",
      trend: "up",
      icon: TrendingUp,
      description: "Taxa anual"
    },
    {
      title: "IPCA Anual",
      value: "4,62%",
      change: "-0.18%",
      trend: "down",
      icon: Percent,
      description: "Inflação acumulada"
    },
    {
      title: "Poupança",
      value: "8,33%",
      change: "0.00%",
      trend: "neutral",
      icon: DollarSign,
      description: "Rendimento anual"
    },
    {
      title: "Meta Selic",
      value: "11,25%",
      change: "0.00%",
      trend: "neutral",
      icon: Target,
      description: "Taxa básica"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="financial-card hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                metric.trend === 'up' ? 'bg-green-100' :
                metric.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <metric.icon className={`h-5 w-5 ${
                  metric.trend === 'up' ? 'text-financial-green' :
                  metric.trend === 'down' ? 'text-red-500' : 'text-gray-600'
                }`} />
              </div>
              <div className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-financial-green' :
                metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {metric.change}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialMetrics;
