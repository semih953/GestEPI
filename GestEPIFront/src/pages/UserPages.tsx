import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Chip
} from "@mui/material";
import { Add, Edit, Visibility, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Users } from "gestepiinterfaces-semih";

// Données mockées pour le développement
const mockUsers: Users[] = [
  {
    id: "1",
    first_name: "Jean",
    last_name: "Dupont",
    email: "jean.dupont@example.com",
    role: "Admin"
  },
  {
    id: "2",
    first_name: "Marie",
    last_name: "Martin",
    email: "marie.martin@example.com",
    role: "Manager"
  },
  {
    id: "3",
    first_name: "Pierre",
    last_name: "Durand",
    email: "pierre.durand@example.com",
    role: "User"
  }
];

export const UsersList = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: string) => {
    // Simulation de la suppression
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    // Dans une application réelle, vous feriez un appel API ici
    console.log(`Suppression de l'utilisateur avec l'ID: ${id}`);
  };

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

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestion des Utilisateurs
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/users/new")}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Liste des utilisateurs">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/users/${user.id}`)}>
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => navigate(`/users/${user.id}/edit`)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default UsersList;