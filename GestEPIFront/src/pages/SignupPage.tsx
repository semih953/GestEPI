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

export const CreateAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Préparer les données à envoyer
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: role
    };

    try {
      const response = await fetch("http://localhost:5555/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du compte.");
      }

      const result = await response.json();
      setSuccessMessage("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      navigate("/login"); // Redirige vers la page de login
    } catch (err) {
      console.error(err);
      setError("Impossible de créer le compte. Veuillez essayer avec un autre email.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Créer un nouveau compte
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <Box component="form" onSubmit={handleCreateAccount}>
          <TextField
            label="Prénom"
            type="text"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Nom"
            type="text"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
          <TextField
            label="Rôle"
            type="text"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Créer le compte
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

