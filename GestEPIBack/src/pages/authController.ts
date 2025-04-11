//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel";
import { LoginRequest, LoginResponse, Users } from "gestepiinterfaces-semih";
import { pool } from "../models/bdd";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // À définir dans .env en production

//********** Routes **********//

// Login route
router.post(
  "/login",
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = request.body as LoginRequest;
      
      // Valider les entrées
      if (!email || !password) {
        return response.status(400).json({ message: "Email et mot de passe requis" });
      }
      
      // Authentifier l'utilisateur
      const user = await userModel.authenticate(email, password);
      
      if (!user) {
        return response.status(401).json({ message: "Email ou mot de passe incorrect" });
      }
      
      // Mettre à jour la date de dernière connexion
      if (user.id) {
        await userModel.updateLastLogin(user.id);
      }
      
      // Générer un token JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );
      
      // Retourner l'utilisateur et le token
      const loginResponse: LoginResponse = {
        user,
        token
      };
      
      response.status(200).json(loginResponse);
    } catch (error) {
      next(error);
    }
  }
);

// Verify token route
router.get(
  "/verify",
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(401).json({ message: "Token manquant ou invalide" });
      }
      
      const token = authHeader.split(" ")[1];
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await userModel.getById(decoded.userId);
        
        response.status(200).json({ valid: true, user });
      } catch (error) {
        response.status(401).json({ valid: false, message: "Token invalide ou expiré" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;

// Route d'inscription
router.post(
    "/register",
    async (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      try {
        const userData = request.body as Users & { password: string };
        
        // Valider les entrées
        if (!userData.email || !userData.password || !userData.first_name || !userData.last_name) {
          return response.status(400).json({ message: "Tous les champs sont requis" });
        }
        
        // Vérifier si l'email existe déjà
        const conn = await pool.getConnection();
        const existingUsers = await conn.query(
          "SELECT id FROM users WHERE email = ?", 
          [userData.email]
        );
        conn.release();
        
        if (existingUsers.length > 0) {
          return response.status(409).json({ message: "Cet email est déjà utilisé" });
        }
        
        // Si pas de rôle spécifié, définir comme "User"
        if (!userData.role) {
          userData.role = "User";
        }
        
        // Créer l'utilisateur
        const user = await userModel.addOne(userData);
        
        response.status(201).json({ 
          message: "Utilisateur créé avec succès",
          user 
        });
      } catch (error) {
        next(error);
      }
    }
);
  

router.post(
    "/add",
    async (
      request: Request,
      response: Response<Users | { message: string }>,
      next: NextFunction
    ) => {
      // Code pour ajouter un utilisateur
    }
  );