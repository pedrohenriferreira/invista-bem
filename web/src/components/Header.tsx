
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, BarChart3, History, Clock, TrendingDown, ArrowRight, Trash2, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface HeaderProps {
  onLoadAnalysis?: (analysis: Analysis) => void;
}

const Header = ({ onLoadAnalysis }: HeaderProps) => {
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Carregar histórico do localStorage específico do usuário
    if (user) {
      try {
        const saved = localStorage.getItem(`analysisHistory_${user.id}`);
        if (saved) {
          setAnalysisHistory(JSON.parse(saved));
        } else {
          setAnalysisHistory([]);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        setAnalysisHistory([]);
      }
    } else {
      setAnalysisHistory([]);
    }
  }, [user]);

  // Atualizar histórico quando o Sheet abrir
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      if (!isAuthenticated) {
        toast({
          title: "Login necessário",
          description: "Faça login para visualizar e salvar seu histórico de análises",
          variant: "default",
        });
        return;
      }
      if (user) {
        try {
          const saved = localStorage.getItem(`analysisHistory_${user.id}`);
          if (saved) {
            setAnalysisHistory(JSON.parse(saved));
          }
        } catch (error) {
          console.error("Erro ao carregar histórico:", error);
          setAnalysisHistory([]);
        }
      }
    }
  };
  const scrollToComparison = () => {
    const element = document.getElementById('investment-comparison');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getInvestmentName = (type: string) => {
    const names: { [key: string]: string } = {
      cdi: 'CDI 100%',
      tesouro: 'Tesouro Selic',
      lci: 'LCI/LCA',
      cdb: 'CDB',
      poupanca: 'Poupança'
    };
    return names[type] || type;
  };

  const getInvestmentColor = (type: string) => {
    const colors: { [key: string]: string } = {
      cdi: 'bg-blue-100 text-blue-700',
      tesouro: 'bg-indigo-100 text-indigo-700',
      lci: 'bg-green-100 text-green-700',
      cdb: 'bg-purple-100 text-purple-700',
      poupanca: 'bg-gray-100 text-gray-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const handleLoadAnalysis = (analysis: Analysis) => {
    if (onLoadAnalysis) {
      onLoadAnalysis(analysis);
      setIsOpen(false);
      // Aguarda um pouco para garantir que o conteúdo foi renderizado, então scroll até as análises
      setTimeout(() => {
        const chartElement = document.getElementById('investment-results');
        if (chartElement) {
          chartElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const clearHistory = () => {
    if (user) {
      try {
        localStorage.removeItem(`analysisHistory_${user.id}`);
        setAnalysisHistory([]);
        setShowClearDialog(false);
        toast({
          title: "Histórico limpo",
          description: "Todas as análises foram removidas",
        });
      } catch (error) {
        console.error("Erro ao limpar histórico:", error);
        toast({
          title: "Erro",
          description: "Não foi possível limpar o histórico",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-financial-gradient p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invista Bem</h1>
              <p className="text-sm text-gray-600">Simulador de Investimentos</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={handleOpenChange}>
              <SheetTrigger asChild>
                <div className="flex items-center space-x-2 text-gray-700 hover:text-financial-blue transition-colors cursor-pointer">
                  <History className="h-4 w-4" />
                  <span className="font-medium">Histórico</span>
                  {analysisHistory.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {analysisHistory.length}
                    </Badge>
                  )}
                </div>
              </SheetTrigger>
              <SheetContent className="w-[500px] sm:w-[600px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5 text-financial-blue" />
                      Histórico de Análises
                    </div>
                    {analysisHistory.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowClearDialog(true)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] mt-6">
                  {analysisHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">Nenhuma análise realizada ainda</p>
                      <p className="text-sm text-gray-400 mt-2">Suas simulações aparecerão aqui</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pr-4">
                      {analysisHistory.map((analysis) => (
                        <div
                          key={analysis.id}
                          onClick={() => handleLoadAnalysis(analysis)}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-financial-blue cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={getInvestmentColor(analysis.investmentType)}>
                                {getInvestmentName(analysis.investmentType)}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {analysis.date} às {analysis.time}
                              </span>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="h-4 w-4 text-financial-blue" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Valor Inicial</p>
                              <p className="text-sm font-semibold text-gray-900">{formatCurrency(analysis.initialAmount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Aporte Mensal</p>
                              <p className="text-sm font-semibold text-gray-900">{formatCurrency(analysis.monthlyAmount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Período</p>
                              <p className="text-sm font-semibold text-gray-900">{analysis.period} meses</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Taxa</p>
                              <p className="text-sm font-semibold text-gray-900">{analysis.interestRate.toFixed(2)}% a.a.</p>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">Valor Final</p>
                                <p className="text-lg font-bold text-financial-blue">{formatCurrency(analysis.totalValue)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Lucro</p>
                                <p className="text-lg font-bold text-financial-green">+{formatCurrency(analysis.profit)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-3 border-l border-gray-300 pl-4">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-financial-blue focus:ring-offset-2 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-financial-blue">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-financial-gradient text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500 font-normal">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        logout();
                        navigate("/");
                      }} 
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-financial-blue hover:bg-blue-50"
                    onClick={() => navigate("/login")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                  
                  <Button 
                    className="bg-financial-gradient hover:opacity-90 text-white"
                    onClick={() => navigate("/cadastro")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastrar-se
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar histórico de análises?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as suas análises salvas serão removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearHistory}
              className="bg-red-600 hover:bg-red-700"
            >
              Limpar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
