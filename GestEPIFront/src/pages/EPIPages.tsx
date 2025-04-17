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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material";
import { Add, Edit, Visibility, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Epi } from "gestepiinterfaces-semih";
import EPIForm from "../components/EPIForm";

export const EPIList = () => {
  const [epis, setEpis] = useState<Epi[]>([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<{ id: number; label: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEpi, setSelectedEpi] = useState<Epi | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: "", 
    severity: "success" as "success" | "error" 
  });
  const navigate = useNavigate();

  // Récupérer les types d'EPI depuis l'API
  useEffect(() => {
    const fetchEpiTypes = async () => {
      try {
        const response = await fetch("http://localhost:5555/epi/types/all");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des types d'EPI.");
        }
        const data = await response.json();
        setTypes(data);
      } catch (err) {
        setError("Impossible de récupérer les types d'EPI.");
        console.error('Error fetching EPI types:', err);
      }
    };

    fetchEpiTypes();
  }, []);

  // Récupérer les EPIs
  const fetchEpis = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5555/epi/getAll");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }
      const data = await response.json();
      setEpis(data);
    } catch (err) {
      setError("Impossible de récupérer les données des EPIs.");
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les EPIs au montage du composant
  useEffect(() => {
    fetchEpis();
  }, []);

  const formatDate = (dateString: Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const getEpiTypeLabel = (typeId: number): string => {
    const type = types.find((type) => type.id === typeId);
    return type ? type.label : "Inconnu";
  };

  const handleAddClick = () => {
    setSelectedEpi(null);
    setOpenModal(true);
  };

  const handleEditClick = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5555/epi/getById/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'EPI");
      }
      const data = await response.json();
      setSelectedEpi(data);
      setOpenModal(true);
    } catch (error) {
      console.error("Erreur:", error);
      setNotification({
        open: true,
        message: "Erreur lors de la récupération des données de l'EPI",
        severity: "error"
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5555/epi/delete/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour l'état local en supprimant l'EPI
      setEpis(epis.filter(epi => epi.id !== id));
      setConfirmDelete(null);
      setNotification({
        open: true,
        message: "EPI supprimé avec succès",
        severity: "success"
      });
    } catch (err) {
      console.error('Error deleting EPI:', err);
      setNotification({
        open: true,
        message: "Erreur lors de la suppression de l'EPI",
        severity: "error"
      });
    }
  };

  const handleFormSuccess = () => {
    fetchEpis();
    setOpenModal(false);
    setNotification({
      open: true,
      message: selectedEpi ? "EPI modifié avec succès" : "EPI ajouté avec succès",
      severity: "success"
    });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedEpi(null);
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
          onClick={handleAddClick}
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
                    <TableCell>{getEpiTypeLabel(epi.type_id)}</TableCell>
                    <TableCell>{epi.serial_number}</TableCell>
                    <TableCell>{formatDate(epi.purchase_date)}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => navigate(`/epi/${epi.id}/view`)} 
                        aria-label="Voir les détails"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleEditClick(epi.id)} 
                        aria-label="Modifier"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => setConfirmDelete(epi.id)} 
                        color="error" 
                        aria-label="Supprimer"
                      >
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

      {/* Modal pour ajouter/éditer un EPI */}
      <Dialog
        open={openModal}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedEpi ? "Modifier un EPI" : "Ajouter un nouvel EPI"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <EPIForm
            epi={selectedEpi}
            epiTypes={types}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="error">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet EPI ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Annuler</Button>
          <Button onClick={() => confirmDelete && handleDelete(confirmDelete)} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EPIList;