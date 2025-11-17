
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Target, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Indicator {
  nome: string;
  valor_anual: number;
  valor_diario?: number;
  valor_mensal?: number;
  ultima_atualizacao: string;
  fonte: string;
}

interface Indicators {
  selic: Indicator;
  cdi: Indicator;
  poupanca: Indicator;
  ipca: Indicator;
}

const FinancialMetrics = () => {
  const [indicators, setIndicators] = useState<Indicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchIndicators = async () => {
    try {
      console.log('🔍 Buscando indicadores REAIS do Banco Central...');
      const response = await fetch('http://localhost:5000/indicators');
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Indicadores OFICIAIS recebidos:', data);
      
      setIndicators(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('❌ Erro ao buscar indicadores:', error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível obter os dados do Banco Central. Verifique se o backend está rodando.",
      });
    }
  };

  useEffect(() => {
    fetchIndicators();
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchIndicators, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!indicators) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Dados indisponíveis</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Não foi possível carregar os indicadores do Banco Central.
          </p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: "Taxa Selic Meta",
      value: `${indicators.selic.valor_anual.toFixed(2)}%`,
      icon: Target,
      description: "Taxa básica de juros",
      lastUpdate: indicators.selic.ultima_atualizacao,
      fonte: indicators.selic.fonte,
      color: "text-primary"
    },
    {
      title: "Taxa CDI",
      value: `${indicators.cdi.valor_anual.toFixed(2)}%`,
      icon: TrendingUp,
      description: indicators.cdi.valor_diario ? `Base: ${indicators.cdi.valor_diario.toFixed(4)}% ao dia` : "Taxa anual",
      lastUpdate: indicators.cdi.ultima_atualizacao,
      fonte: indicators.cdi.fonte,
      color: "text-blue-600"
    },
    {
      title: "Poupança",
      value: `${indicators.poupanca.valor_anual.toFixed(2)}%`,
      icon: DollarSign,
      description: indicators.poupanca.valor_mensal ? `Base: ${indicators.poupanca.valor_mensal.toFixed(2)}% ao mês` : "Rendimento anual",
      lastUpdate: indicators.poupanca.ultima_atualizacao,
      fonte: indicators.poupanca.fonte,
      color: "text-green-600"
    },
    {
      title: "IPCA (12 meses)",
      value: `${indicators.ipca.valor_anual.toFixed(2)}%`,
      icon: Percent,
      description: "Inflação acumulada",
      lastUpdate: indicators.ipca.ultima_atualizacao,
      fonte: indicators.ipca.fonte,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Indicador de dados reais */}
      {lastUpdate && (
        <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-sm font-medium text-green-900">
              ✅ Dados 100% REAIS do Banco Central do Brasil
            </span>
          </div>
          <span className="text-xs text-green-700 font-medium">
            Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="financial-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-muted">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className={`text-2xl font-bold mb-1 ${metric.color}`}>{metric.value}</p>
                <p className="text-xs text-gray-500 mb-2">{metric.description}</p>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    🗓️ {metric.lastUpdate}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 truncate" title={metric.fonte}>
                    {metric.fonte}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialMetrics;
