
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, Percent, Target, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const FinancialMetrics = () => {
  const [indicators, setIndicators] = useState<IndicatorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await fetch('http://localhost:5000/indicators');
        if (!response.ok) throw new Error('Erro ao buscar indicadores');
        const data = await response.json();
        setIndicators(data);
      } catch (error) {
        console.error('Erro ao buscar indicadores:', error);
        toast({
          title: "Erro ao carregar indicadores",
          description: "Não foi possível carregar os dados do Banco Central. Usando valores de exemplo.",
          variant: "destructive",
        });
        // Valores de fallback
        setIndicators({
          selic: { nome: "Taxa Selic", valor_anual: 11.25, ultima_atualizacao: "01/11/2025" },
          cdi: { nome: "Taxa CDI", valor_anual: 11.15, ultima_atualizacao: "15/11/2025" },
          poupanca: { nome: "Poupança", valor_anual: 8.33, ultima_atualizacao: "01/11/2025" },
          ipca: { nome: "IPCA", valor_anual: 4.62, ultima_atualizacao: "01/11/2025" }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, [toast]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Data não disponível";
    const [day, month, year] = dateStr.split('/');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  };

  const metrics = [
    {
      title: "CDI Atual",
      value: indicators?.cdi.valor_anual || 0,
      period: formatDate(indicators?.cdi.ultima_atualizacao),
      icon: TrendingUp,
      description: "Diário - Anualizado",
      color: "blue"
    },
    {
      title: "IPCA",
      value: indicators?.ipca.valor_anual || 0,
      period: formatDate(indicators?.ipca.ultima_atualizacao),
      icon: Percent,
      description: "Acumulado 12 meses",
      color: "purple"
    },
    {
      title: "Poupança",
      value: indicators?.poupanca.valor_anual || 0,
      period: formatDate(indicators?.poupanca.ultima_atualizacao),
      icon: DollarSign,
      description: "Mensal - Anualizado",
      color: "green"
    },
    {
      title: "Meta Selic",
      value: indicators?.selic.valor_anual || 0,
      period: formatDate(indicators?.selic.ultima_atualizacao),
      icon: Target,
      description: "Taxa básica anual",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
    };
    return colors[color as keyof typeof colors][type];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        return (
          <Card 
            key={index} 
            className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 group cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${getColorClasses(metric.color, 'bg')} group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className={`h-6 w-6 ${getColorClasses(metric.color, 'text')}`} />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-300">
                  {metric.value.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 font-medium mb-1">{metric.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Calendar className="h-3 w-3" />
                  <span>{metric.period}</span>
                </div>
              </div>

              {/* Decorative element */}
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full ${getColorClasses(metric.color, 'bg')} opacity-10 group-hover:scale-150 transition-transform duration-500`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FinancialMetrics;
