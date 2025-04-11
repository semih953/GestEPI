//********** Imports **********//
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // À définir dans .env en production

// Interface pour étendre Request
interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// Middleware d'authentification
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Middleware pour vérifier les rôles
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Vous n'avez pas les permissions nécessaires" });
    }
    
    next();
  };
};