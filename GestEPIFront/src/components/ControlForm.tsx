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
  CircularProgress,
  Autocomplete,
  Alert,
  SelectChangeEvent
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Epi, EpiCheck } from "gestepiinterfaces-semih";

// Interface pour les props du composant
interface ControlFormProps {
  viewMode?: boolean;
}

export const ControlForm: React.FC<ControlFormProps> = ({ viewMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && !!id;

  const [control, setControl] = useState<EpiCheck>({
    id: 0,
    internal_id: "",
    check_date: new Date(),
    status_id: 1,
    user_id: 1
  });
  
  const [epis, setEpis] = useState<Epi[]>([]);
  const [selectedEpi, setSelectedEpi] = useState<Epi | null>(null);
  const [statuses, setStatuses] = useState<{id: number, label: string}[]>([]);
  const [users, setUsers] = useState<{id: number, first_name: string, last_name: string}[]>([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Charger les EPIs, les statuts et les utilisateurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les EPIs
        const episResponse = await fetch("http://localhost:5555/epi/getAll");
        if (!episResponse.ok) throw new Error("Erreur lors du chargement des EPIs");
        const episData = await episResponse.json();
        setEpis(episData);

        // Charger les statuts (fallback si l'API échoue)
        try {
          const statusesResponse = await fetch("http://localhost:5555/epiCheck/statuses/all");
          if (statusesResponse.ok) {
            const statusesData = await statusesResponse.json();
            setStatuses(statusesData);
          } else {
            // Fallback avec des statuts par défaut
            setStatuses([
              { id: 1, label: "Opérationnel" },
              { id: 2, label: "À réparer" },
              { id: 3, label: "Mis au rebut" }
            ]);
          }
        } catch (error) {
          console.error("Error loading statuses:", error);
          // Fallback avec des statuts par défaut
          setStatuses([
            { id: 1, label: "Opérationnel" },
            { id: 2, label: "À réparer" },
            { id: 3, label: "Mis au rebut" }
          ]);
        }

        // Charger les utilisateurs (fallback si l'API échoue)
        try {
          const usersResponse = await fetch("http://localhost:5555/user/getAll");
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setUsers(usersData);
          } else {
            // Fallback avec des utilisateurs par défaut
            setUsers([
              { id: 1, first_name: "Jean", last_name: "Dupont" },
              { id: 2, first_name: "Marie", last_name: "Martin" }
            ]);
          }
        } catch (error) {
          console.error("Error loading users:", error);
          // Fallback avec des utilisateurs par défaut
          setUsers([
            { id: 1, first_name: "Jean", last_name: "Dupont" },
            { id: 2, first_name: "Marie", last_name: "Martin" }
          ]);
        }

        // Si mode édition, charger le contrôle existant
        if (isEditMode) {
          try {
            const controlResponse = await fetch(`http://localhost:5555/epiCheck/getById/${id}`);
            if (controlResponse.ok) {
              const controlData = await controlResponse.json();
              setControl(controlData);
              
              // Trouver l'EPI correspondant
              const epi = episData.find((e: Epi) => e.internal_id === controlData.internal_id);
              if (epi) setSelectedEpi(epi);
            } else {
              throw new Error("Erreur lors du chargement du contrôle");
            }
          } catch (error) {
            console.error("Error loading control:", error);
            setErrors({ global: "Erreur lors du chargement du contrôle" });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ global: "Erreur lors du chargement des données" });
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setControl(prev => ({ ...prev, [name as string]: value }));
    
    // Clear error for this field
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: "" }));
    }
  };
  
  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setControl(prev => ({ ...prev, [name as string]: value }));
    
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: "" }));
    }
  };

  const handleEpiChange = (_event: React.SyntheticEvent, epi: Epi | null) => {
    setSelectedEpi(epi);
    if (epi) {
      setControl(prev => ({ ...prev, internal_id: epi.internal_id }));
      if (errors.internal_id) {
        setErrors(prev => ({ ...prev, internal_id: "" }));
      }
    } else {
      setControl(prev => ({ ...prev, internal_id: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!control.internal_id) newErrors.internal_id = "L'EPI est requis";
    if (!control.user_id) newErrors.user_id = "Le contrôleur est requis";
    if (!control.status_id) newErrors.status_id = "Le statut est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitError(null);
    setSubmitSuccess(null);
    
    if (!validateForm()) return;

    // Format the date properly
    const checkDate = typeof control.check_date === 'string' 
      ? new Date(control.check_date).toISOString().split('T')[0]
      : control.check_date.toISOString().split('T')[0];

    // S'assurer que tous les champs requis sont présents et correctement formatés
    const checkData = {
      internal_id: control.internal_id,
      check_date: checkDate,
      status_id: Number(control.status_id),  // Conversion explicite en nombre
      user_id: Number(control.user_id)       // Conversion explicite en nombre
    };

    console.log('Envoi des données:', checkData);  // Debugging

    try {
      const url = isEditMode 
        ? `http://localhost:5555/epiCheck/update/${id}`
        : "http://localhost:5555/epiCheck/add";
      
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(checkData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la soumission du formulaire");
      }

      setSubmitSuccess(isEditMode 
        ? "Contrôle mis à jour avec succès!" 
        : "Contrôle ajouté avec succès!");
      
      // Rediriger après un court délai
      setTimeout(() => {
        navigate("/control");
      }, 1500);
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'enregistrement du contrôle.");
    }
  };

  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
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
        {viewMode 
          ? "Détails du contrôle" 
          : isEditMode 
            ? "Modifier un contrôle" 
            : "Ajouter un nouveau contrôle"
        }
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {submitSuccess}
        </Alert>
      )}

      {errors.global && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.global}
        </Alert>
      )}

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={epis}
                getOptionLabel={(option) => `${option.internal_id} - ${option.brand} ${option.model}`}
                value={selectedEpi}
                onChange={handleEpiChange}
                disabled={viewMode}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="EPI"
                    error={!!errors.internal_id}
                    helperText={errors.internal_id}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date du contrôle"
                name="check_date"
                value={formatDateForInput(new Date(control.check_date))}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.check_date}
                helperText={errors.check_date}
                required
                disabled={viewMode}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.user_id} required>
                <InputLabel>Contrôleur</InputLabel>
                <Select
                  name="user_id"
                  value={control.user_id}
                  onChange={handleSelectChange}
                  label="Contrôleur"
                  disabled={viewMode}
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.user_id && <FormHelperText>{errors.user_id}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.status_id} required>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status_id"
                  value={control.status_id}
                  onChange={handleSelectChange}
                  label="Statut"
                  disabled={viewMode}
                >
                  {statuses.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status_id && <FormHelperText>{errors.status_id}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarques"
                name="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                multiline
                rows={4}
                disabled={viewMode}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate("/control")}
                >
                  {viewMode ? "Retour" : "Annuler"}
                </Button>
                {!viewMode && (
                  <Button 
                    variant="contained" 
                    type="submit"
                  >
                    {isEditMode ? "Mettre à jour" : "Ajouter"}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ControlForm;