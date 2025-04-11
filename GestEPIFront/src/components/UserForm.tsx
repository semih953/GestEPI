import React, { useState, useEffect } from "react";
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
  FormHelperText,
  CircularProgress
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Users } from "gestepiinterfaces-semih";

export const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && !!id;

  const [user, setUser] = useState<Users & { password?: string }>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "User",
    password: "" // Seulement pour la création
  });
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      // Simuler la récupération d'un utilisateur
      const timer = setTimeout(() => {
        // Exemple de récupération d'utilisateur par ID
        const mockUser: Users = {
          id: id || "",
          first_name: id === "1" ? "Jean" : id === "2" ? "Marie" : "Pierre",
          last_name: id === "1" ? "Dupont" : id === "2" ? "Martin" : "Durand",
          email: id === "1" ? "jean.dupont@example.com" : id === "2" ? "marie.martin@example.com" : "pierre.durand@example.com",
          role: id === "1" ? "Admin" : id === "2" ? "Manager" : "User"
        };
        
        setUser(mockUser);
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name as string]: value }));
    
    // Clear error for this field
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: "" }));
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
    
    // Validation du mot de passe uniquement lors de la création
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Supprimer le mot de passe si en mode édition
    const userData = isEditMode 
      ? { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role }
      : user;

    // Mock submission
    console.log("Soumission du formulaire utilisateur:", userData);
    
    // Redirect to list after form submission
    navigate("/users");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? "Modifier un utilisateur" : "Ajouter un nouvel utilisateur"}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
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
                  // onChange={handleChange}
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
                    required={!isEditMode}
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
                    required={!isEditMode}
                  />
                </Grid>
              </>
            )}
            
            {isEditMode && (
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  * Pour des raisons de sécurité, la modification du mot de passe se fait sur une page dédiée.
                </Typography>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate("/users")}>
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

export default UserForm;