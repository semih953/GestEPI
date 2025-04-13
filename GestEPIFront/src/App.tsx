import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

// Pages
import { Dashboard } from "./pages/Dashboard";
import { EPIList } from "./pages/EPIPages";
import { ControlList } from "./pages/ControlPages";
import { UserPages } from "./pages/UserPages";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { CreateAccount } from "./pages/CreateAccount";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Routes publiques */}
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<CreateAccount />} />

            {/* Routes protégées */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="epi" 
              element={
                <PrivateRoute>
                  <EPIList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="control" 
              element={
                <PrivateRoute>
                  <ControlList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="users" 
              element={
                <PrivateRoute>
                  <UserPages />
                </PrivateRoute>
              } 
            />
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
