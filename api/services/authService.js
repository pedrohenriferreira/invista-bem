import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simulação de banco de dados em memória (substituir por banco real depois)
const users = [];

const JWT_SECRET = 'invista-bem-secret-key-2025'; // Em produção, usar variável de ambiente

// Registrar novo usuário
export const registerUser = async (name, email, phone, password) => {
  // Verificar se usuário já existe
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar novo usuário
  const newUser = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name,
    email,
    phone,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  // Gerar token JWT
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Retornar usuário sem a senha
  const { password: _, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, token };
};

// Login de usuário
export const loginUser = async (email, password) => {
  // Buscar usuário
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  // Verificar senha
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Email ou senha inválidos');
  }

  // Gerar token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Retornar usuário sem a senha
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

// Verificar token JWT
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
};

// Middleware para proteger rotas
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};
