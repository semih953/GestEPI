import React, { useState } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Container
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LoginRequest } from "gestepiinterfaces-semih";

export const LoginPage = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev: LoginRequest) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Appel à l'API d'authentification
      const response = await fetch("http://localhost:5501/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }
      
      // Stocker le token dans le localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Rediriger vers la page d'accueil
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        marginTop: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          GestEPI - Connexion
        </Typography>
        
        <Paper sx={{ p: 4, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={credentials.email}
              onChange={handleChange}
              required
              margin="normal"
              autoComplete="email"
              autoFocus
            />
            
            <TextField
              label="Mot de passe"
              name="password"
              type="password"
              fullWidth
              value={credentials.password}
              onChange={handleChange}
              required
              margin="normal"
              autoComplete="current-password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Se connecter"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;