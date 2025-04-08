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


// Données mockées pour le développement
const mockEpis: Epi[] = [
  {
    id: 1,
    internal_id: "EPI-001",
    serial_number: "SN123456",
    model: "Casque Pro",
    brand: "SafetyFirst",
    type_id: 1,
    size: "L",
    color: "Rouge",
    purchase_date: new Date("2023-01-15"),
    service_start_date: new Date("2023-01-20"),
    manufacture_date: new Date("2022-10-05"),
    inspection_frequency: "6m"
  },
  {
    id: 2,
    internal_id: "EPI-002",
    serial_number: "SN789012",
    model: "Harnais Secure",
    brand: "AlpineEquip",
    type_id: 2,
    size: "M",
    color: "Noir",
    purchase_date: new Date("2023-03-10"),
    service_start_date: new Date("2023-03-15"),
    manufacture_date: new Date("2023-01-20"),
    inspection_frequency: "3m"
  },
  {
    id: 3,
    internal_id: "EPI-003",
    serial_number: "SN345678",
    model: "Corde Dynamic",
    brand: "RopesMaster",
    type_id: 3,
    size: "50m",
    color: "Bleu",
    purchase_date: new Date("2022-11-05"),
    service_start_date: new Date("2022-11-10"),
    manufacture_date: new Date("2022-09-15"),
    inspection_frequency: "3m"
  }
];

export const EPIList = () => {
  const [epis, setEpis] = useState<Epi[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setEpis(mockEpis);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: Date) => {
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
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
                    <TableCell>{epi.type_id}</TableCell>
                    <TableCell>{epi.serial_number}</TableCell>
                    <TableCell>{formatDate(epi.purchase_date)}</TableCell>
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