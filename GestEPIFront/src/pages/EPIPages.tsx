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
  CircularProgress
} from "@mui/material";
import { Add, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Epi } from "gestepiinterfaces-semih";

export const EPIList = () => {
  const [epis, setEpis] = useState<Epi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Pour gérer les erreurs
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpis = async () => {
      try {
        const response = await fetch("http://localhost:5501/epi/getAll");
        console.log('Response:', response); // Log de la réponse brute

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await response.json();
        console.log('Data:', data); // Log des données reçues de l'API

        setEpis(data);
      } catch (err) {
        setError("Impossible de récupérer les données des EPIs.");
        console.error('Error fetching data:', err); // Log de l'erreur si ça échoue
      } finally {
        setLoading(false);
      }
    };

    fetchEpis();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
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
          onClick={() => navigate("/epis/new")}
        >
          Ajouter un EPI
        </Button>
      </Box>

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
                    <TableCell>{epi.type_id}</TableCell>
                    <TableCell>{epi.serial_number}</TableCell>
                    {/* <TableCell>{formatDate(epi.purchase_date)}</TableCell> */}
                    <TableCell>
                      <IconButton onClick={() => navigate(`/epis/${epi.id}`)}>
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => navigate(`/epis/${epi.id}/edit`)}>
                        <Edit />
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
