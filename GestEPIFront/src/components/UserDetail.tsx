import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Button, 
  Divider, 
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Avatar
} from "@mui/material";
import { Edit, ArrowBack, Email, PersonOutline } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { Users } from "gestepiinterfaces-semih";

export const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  const getRoleColor = (role: string): "primary" | "secondary" | "default" => {
    switch (role) {
      case "Admin":
        return "primary";
      case "Manager":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Utilisateur non trouvé
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate("/users")}
          sx={{ mt: 2 }}
        >
          Retour à la liste
        </Button>
      </Box>
    );
  }

  const getInitials = () => {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => navigate("/users")}
            sx={{ mr: 2 }}
          >
            Retour
          </Button>
          <Typography variant="h4" component="h1">
            Profil Utilisateur
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Edit />}
          onClick={() => navigate(`/users/${user.id}/edit`)}
        >
          Modifier
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, fontSize: 30, bgcolor: 'primary.main', mr: 3 }}>
            {getInitials()}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {user.first_name} {user.last_name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            <Chip 
              label={user.role} 
              color={getRoleColor(user.role)}
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">ID</Typography>
            <Typography variant="body1">{user.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Prénom</Typography>
            <Typography variant="body1">{user.first_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Nom</Typography>
            <Typography variant="body1">{user.last_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Rôle</Typography>
            <Typography variant="body1">{user.role}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserDetail;