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
  Alert
} from "@mui/material";
import { Add, Edit, Visibility, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Epi } from "gestepiinterfaces-semih";

export const EPIList = () => {
  const [epis, setEpis] = useState<Epi[]>([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<{ id: number; label: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Récupérer les EPIs
  const fetchEpis = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5555/epi/getAll");
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("EPIs récupérés:", data);
      setEpis(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des EPIs:', err);
      setError("Impossible de récupérer les EPIs.");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les types d'EPI
  useEffect(() => {
    const fetchEpiTypes = async () => {
      try {
        const response = await fetch("http://localhost:5555/epi/types/all");
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Types d'EPI récupérés:", data);
        setTypes(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des types:', err);
        setError("Impossible de récupérer les types d'EPI.");
      }
    };

    fetchEpiTypes();
    fetchEpis();
  }, []);

  // Supprimer un EPI
  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet EPI ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5555/epi/delete/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Rafraîchir la liste après suppression
      fetchEpis();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError("Impossible de supprimer l'EPI.");
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const getEpiTypeLabel = (typeId: number): string => {
    const type = types.find((type) => type.id === typeId);
    return type ? type.label : "Inconnu";
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Liste des EPIs
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/epi/new")}
        >
          Ajouter un EPI
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Liste des EPIs">
            <TableHead>
              <TableRow>
                <TableCell>ID Interne</TableCell>
                <TableCell>Marque</TableCell>
                <TableCell>Modèle</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Numéro de série</TableCell>
                <TableCell>Date d'achat</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {epis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Aucun EPI trouvé
                  </TableCell>
                </TableRow>
              ) : (
                epis.map((epi) => (
                  <TableRow key={epi.id}>
                    <TableCell>{epi.internal_id}</TableCell>
                    <TableCell>{epi.brand}</TableCell>
                    <TableCell>{epi.model}</TableCell>
                    <TableCell>{getEpiTypeLabel(epi.type_id)}</TableCell>
                    <TableCell>{epi.serial_number}</TableCell>
                    <TableCell>{formatDate(epi.purchase_date)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/epi/${epi.id}`)}>
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => navigate(`/epi/${epi.id}/edit`)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(epi.id)} color="error">
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

export default EPIList;