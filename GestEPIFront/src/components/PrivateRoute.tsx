import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user"); // Vérifie si un utilisateur est connecté

  return user ? <>{children}</> : <Navigate to="/login" />; // Si connecté, afficher les enfants (la page), sinon rediriger
};

