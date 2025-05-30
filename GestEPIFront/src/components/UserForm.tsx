import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Users } from "gestepiinterfaces-semih";

export const UserForm = ({
  onSuccess,
  id: propId,
}: {
  onSuccess?: () => void;
  id?: string | null;
}) => {
  const isEditMode = !!propId;

  const [user, setUser] = useState<Omit<Users, "id"> & { password?: string }>({
    first_name: "",
    last_name: "",
    email: "",
    role: "User",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [debugTimeout, setDebugTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name as string]: value }));
  
    if (errors[name as string]) {
      setErrors((prev) => ({ ...prev, [name as string]: "" }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!user.first_name) newErrors.first_name = "Le prénom est requis";
    if (!user.last_name) newErrors.last_name = "Le nom est requis";
    if (!user.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!isEditMode) {
      if (!user.password) {
        newErrors.password = "Le mot de passe est requis";
      } else if (user.password.length < 6) {
        newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
      }

      if (user.password !== confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userData = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      ...(isEditMode ? {} : { password: user.password }),
    };

    const url = isEditMode
      ? `http://localhost:5555/user/update/${propId}`
      : `http://localhost:5555/user/add`;

    try {
      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Erreur lors de la soumission du formulaire");

      console.log("✅ Utilisateur enregistré :", userData);

      // Trigger success callback without navigating
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrors({ global: "Impossible d'ajouter ou modifier l'utilisateur." });
      console.error("❌ Erreur front :", err);
    }
  };

  // Force l'arrêt du chargement après 5 secondes
  const forceStopLoading = () => {
    if (debugTimeout) clearTimeout(debugTimeout);
    setLoading(false);
  };

  useEffect(() => {
    console.log("UserForm mounted. propId:", propId);
    console.log("isEditMode:", isEditMode);
    
    if (isEditMode && propId) {
      setLoading(true);
      
      // Crée un timeout pour forcer l'arrêt du chargement après 5 secondes
      const timeout = setTimeout(() => {
        console.log("⚠️ Forçage de l'arrêt du chargement après timeout");
        setLoading(false);
      }, 5000);
      
      setDebugTimeout(timeout);
      
      console.log("Fetching user data for id:", propId);
      const apiUrl = `http://localhost:5555/user/getById/${propId}`;
      console.log("API URL:", apiUrl);
      
      fetch(apiUrl)
        .then(res => {
          console.log("Response status:", res.status);
          if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log("Data received:", data);
          setUser({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            role: data.role || "User",
            password: data.password
          });
          clearTimeout(timeout);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching user:", err);
          setErrors({ global: "Erreur lors du chargement de l'utilisateur" });
          clearTimeout(timeout);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    
    return () => {
      if (debugTimeout) clearTimeout(debugTimeout);
    };
  }, [isEditMode, propId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, p: 3 }}>
        <CircularProgress />
        <Typography>Chargement des données utilisateur...</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="error" gutterBottom>
            Le chargement prend trop de temps?
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            size="small" 
            onClick={forceStopLoading}
          >
            Forcer l'arrêt du chargement
          </Button>
        </Box>
        <Box sx={{ mt: 2, bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
          <Typography variant="caption">Informations de debug:</Typography>
          <Typography variant="caption" component="div">ID: {propId || "non défini"}</Typography>
          <Typography variant="caption" component="div">Mode édition: {isEditMode ? "Oui" : "Non"}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? "Modifier un utilisateur" : "Ajouter un nouvel utilisateur"}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        {errors.global && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errors.global}
          </Typography>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={user.role}
                  onChange={handleSelectChange}
                  label="Rôle"
                  required
                >
                  <MenuItem value="Admin">Administrateur</MenuItem>
                  <MenuItem value="Manager">Gestionnaire</MenuItem>
                  <MenuItem value="User">Utilisateur</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {!isEditMode && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={user.password || ""}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={onSuccess}>
                  Annuler
                </Button>
                <Button variant="contained" type="submit">
                  {isEditMode ? "Mettre à jour" : "Ajouter"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};