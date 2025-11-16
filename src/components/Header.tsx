
import { TrendingUp, BarChart3 } from "lucide-react";

const Header = () => {
  const scrollToComparison = () => {
    const element = document.getElementById('investment-comparison');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          
          <nav className="hidden md:flex items-center space-x-6">
            <div 
              onClick={scrollToComparison}
              className="flex items-center space-x-2 text-gray-700 hover:text-financial-blue transition-colors cursor-pointer"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Análises</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
