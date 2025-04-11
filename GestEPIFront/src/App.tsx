import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

// Pages
import {Dashboard} from "./pages/Dashboard";
import {EPIList} from "./pages/EPIPages";
import {ControlList} from "./pages/ControlPages";
import {UsersList} from "./pages/UserPages";
import {ControlForm} from "./components/ControlForm";
import {UserForm} from "./components/UserForm";
import {UserDetail} from "./components/UserDetail";
import {Layout} from "./components/Layout";
 
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Route publique pour la connexion */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Routes protégées */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="epi" element={<EPIList />} />
                <Route path="control" element={<ControlList />} />
                {/* Routes pour les utilisateurs */}
                <Route path="users" element={<UsersList />} />
                <Route path="users/new" element={<UserForm />} />
                <Route path="users/:id" element={<UserDetail />} />
                <Route path="users/:id/edit" element={<UserForm />} />
              </Route>
            </Route>
            
            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;