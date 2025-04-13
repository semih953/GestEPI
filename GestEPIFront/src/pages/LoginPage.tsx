import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Effectuer une requête pour récupérer l'utilisateur avec l'email
      const response = await fetch(`http://localhost:5555/user/getByEmail/${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error("Utilisateur non trouvé");
      }

      const user = await response.json();

      // Vérifier que le mot de passe correspond
      if (user.password !== password) {
        setError("Mot de passe incorrect.");
        return;
      }

      // Stocker l'utilisateur dans localStorage et rediriger vers /dashboard
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");

      // Affichage du nom de l'utilisateur
      alert(`Bienvenue ${user.first_name} ${user.last_name}`);
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe invalide.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Connexion
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Se connecter
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
