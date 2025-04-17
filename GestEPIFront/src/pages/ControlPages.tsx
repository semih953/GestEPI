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
  Chip,
  Box,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Add, Edit, Visibility, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { EpiCheck } from "gestepiinterfaces-semih";

export const ControlList = () => {
  const [controls, setControls] = useState<EpiCheck[]>([]);
  const [statuses, setStatuses] = useState<{id: number, label: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Charger les statuts de contrôle
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch("http://localhost:5555/epiCheck/statuses/all");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des statuts");
        }
        const data = await response.json();
        setStatuses(data);
      } catch (err) {
        console.error("Error fetching statuses:", err);
        // Utiliser des statuts par défaut en cas d'erreur
        setStatuses([
          { id: 1, label: "Opérationnel" },
          { id: 2, label: "À réparer" },
          { id: 3, label: "Mis au rebut" }
        ]);
      }
    };

    fetchStatuses();
  }, []);

  // Charger les contrôles depuis l'API
  useEffect(() => {
    const fetchControls = async () => {
      try {
        const response = await fetch("http://localhost:5555/epiCheck/getAll");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des contrôles");
        }
        const data = await response.json();
        setControls(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching controls:", err);
        setError("Impossible de récupérer les données des contrôles.");
        setLoading(false);
      }
    };

    fetchControls();
  }, []);

  // Supprimer un contrôle
  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contrôle ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5555/epiCheck/delete/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Mettre à jour la liste locale des contrôles
      setControls(controls.filter(control => control.id !== id));
    } catch (err) {
      console.error("Error deleting control:", err);
      alert("Erreur lors de la suppression du contrôle");
    }
  };

  const getStatusLabel = (statusId: number): string => {
    const status = statuses.find(s => s.id === statusId);
    return status?.label || "Inconnu";
  };

  const getStatusColor = (statusId: number): "success" | "warning" | "error" | "default" => {
    switch (statusId) {
      case 1: // Opérationnel
        return "success";
      case 2: // À réparer
        return "warning";
      case 3: // Mis au rebut
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Liste des Contrôles
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => navigate("/controls/new")}
        >
          Ajouter un contrôle
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Liste des contrôles">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ID Interne</TableCell>
                <TableCell>Date du contrôle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {controls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucun contrôle trouvé
                  </TableCell>
                </TableRow>
              ) : (
                controls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell>{control.id}</TableCell>
                    <TableCell>{control.internal_id}</TableCell>
                    <TableCell>{formatDate(control.check_date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(control.status_id)}
                        color={getStatusColor(control.status_id)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/controls/${control.id}`)}>
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => navigate(`/controls/${control.id}/edit`)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(control.id)} color="error">
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