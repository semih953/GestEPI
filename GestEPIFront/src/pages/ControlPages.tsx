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
import { Add, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { EpiCheck } from "gestepiinterfaces-semih";


// Données mockées pour le développement
const mockControls: EpiCheck[] = [
  {
    id: 1,
    internal_id: "EPI-001",
    check_date: new Date("2023-06-15"),
    status_id: 1, // Opérationnel
    user_id: 1
  },
  {
    id: 2,
    internal_id: "EPI-002",
    check_date: new Date("2023-07-10"),
    status_id: 2, // À réparer
    user_id: 2
  },
  {
    id: 3,
    internal_id: "EPI-003",
    check_date: new Date("2023-05-05"),
    status_id: 3, // Mis au rebut
    user_id: 1
  }
];

// Mock statuses
const mockStatuses = [
  { id: 1, label: "Opérationnel" },
  { id: 2, label: "À réparer" },
  { id: 3, label: "Mis au rebut" }
];

export const ControlList = () => {
  const [controls, setControls] = useState<EpiCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setControls(mockControls);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusLabel = (statusId: number): string => {
    const status = mockStatuses.find(s => s.id === statusId);
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