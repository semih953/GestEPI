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

export const UsersList = ({ onEdit }: { onEdit?: (id: string) => void }) => {

// export const UsersList = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Pour gérer les erreurs
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5555/user/getAll"); // API pour récupérer tous les utilisateurs
        console.log('Response:', response); // Log de la réponse brute

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await response.json();
        console.log('Data:', data); // Log des données reçues de l'API

        setUsers(data); // Mettre à jour l'état avec les utilisateurs récupérés
      } catch (err) {
        setError("Impossible de récupérer les données des utilisateurs.");
        console.error('Error fetching data:', err); // Log de l'erreur si ça échoue
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // Appel à la fonction pour récupérer les utilisateurs
  }, []);

  const handleDelete = async (id: string) => {
    // Confirmation avant de supprimer l'utilisateur
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5555/user/delete/${id}`, {
        method: "DELETE", // Méthode DELETE pour supprimer l'utilisateur
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur.");
      }

      // Mettre à jour l'état pour supprimer l'utilisateur localement
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      console.log(`Utilisateur avec l'ID ${id} supprimé.`);
    } catch (err) {
      setError("Impossible de supprimer l'utilisateur.");
      console.error("Error deleting user:", err);
    }
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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Typography color="error">{error}</Typography>
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
                      <IconButton onClick={() => onEdit?.(user.id)}>
                        <Edit />
                      </IconButton> 

                      {/* <IconButton onClick={() => navigate(`/users/${user.id}/edit`)}>
                        <Edit />
                      </IconButton> */}
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
