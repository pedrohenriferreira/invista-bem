import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🔐 AuthProvider inicializado');

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    console.log('📦 Carregando usuário do localStorage...');
    try {
      const storedUser = localStorage.getItem("investaBem_user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('✅ Usuário carregado:', userData.email);
        setUser(userData);
      } else {
        console.log('ℹ️ Nenhum usuário armazenado');
      }
    } catch (error) {
      console.error("❌ Erro ao carregar usuário do localStorage:", error);
      localStorage.removeItem("investaBem_user");
    } finally {
      setIsLoading(false);
      console.log('✅ AuthProvider carregado');
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("investaBem_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("investaBem_user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
