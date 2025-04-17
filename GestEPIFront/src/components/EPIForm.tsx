import React, { useState, useEffect } from "react";
import { 
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
  SelectChangeEvent,
  Typography,
  Paper,
  Divider,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Epi } from "gestepiinterfaces-semih";
import { ArrowBack, Edit } from "@mui/icons-material";

// Modèle d'un EPI vide par défaut
const DEFAULT_EPI: Epi = {
  id: 0,
  internal_id: "",
  serial_number: "",
  model: "",
  brand: "",
  type_id: 1,
  size: "",
  color: "",
  purchase_date: new Date(),
  service_start_date: new Date(),
  manufacture_date: new Date(),
  inspection_frequency: "6m"
};

interface EPIFormProps {
  epi?: Epi | null;
  epiTypes?: { id: number; label: string }[];
  onSuccess?: () => void;
  viewMode?: boolean; // Nouveau prop pour déterminer s'il s'agit du mode vue ou édition
}

const EPIForm: React.FC<EPIFormProps> = ({ epi, epiTypes = [], onSuccess, viewMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Epi>(epi || DEFAULT_EPI);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [types, setTypes] = useState<{ id: number; label: string }[]>(epiTypes);

  const isEditMode = !!epi || (!!id && !viewMode);

  // Charger les types d'EPI s'ils ne sont pas fournis
  useEffect(() => {
    if (epiTypes.length === 0) {
      const fetchEpiTypes = async () => {
        try {
          const response = await fetch("http://localhost:5555/epi/types/all");
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des types d'EPI.");
          }
          const data = await response.json();
          setTypes(data);
        } catch (err) {
          console.error('Error fetching EPI types:', err);
        }
      };

      fetchEpiTypes();
    }
  }, [epiTypes]);

  // Charger les détails de l'EPI si on est en mode édition ou vue et qu'on a un ID
  useEffect(() => {
    if (id && !epi) {
      const fetchEpiDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5555/epi/getById/${id}`);
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          const data = await response.json();
          
          // S'assurer que les dates sont bien des objets Date
          const formattedData = {
            ...data,
            purchase_date: data.purchase_date instanceof Date ? data.purchase_date : new Date(data.purchase_date),
            service_start_date: data.service_start_date instanceof Date ? data.service_start_date : new Date(data.service_start_date),
            manufacture_date: data.manufacture_date instanceof Date ? data.manufacture_date : new Date(data.manufacture_date)
          };
          
          setFormData(formattedData);
        } catch (err) {
          console.error('Error fetching EPI details:', err);
          setErrors({ general: "Impossible de récupérer les détails de l'EPI" });
        } finally {
          setLoading(false);
        }
      };

      fetchEpiDetails();
    } else if (epi) {
      // S'assurer que les dates sont bien des objets Date
      const formattedEpi = {
        ...epi,
        purchase_date: epi.purchase_date instanceof Date ? epi.purchase_date : new Date(epi.purchase_date),
        service_start_date: epi.service_start_date instanceof Date ? epi.service_start_date : new Date(epi.service_start_date),
        manufacture_date: epi.manufacture_date instanceof Date ? epi.manufacture_date : new Date(epi.manufacture_date)
      };
      setFormData(formattedEpi);
      setLoading(false);
    }
  }, [id, epi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: "" }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      setFormData(prev => ({ 
        ...prev, 
        [name]: new Date(value) 
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.internal_id) newErrors.internal_id = "L'identifiant interne est requis";
    if (!formData.brand) newErrors.brand = "La marque est requise";
    if (!formData.model) newErrors.model = "Le modèle est requis";
    if (!formData.serial_number) newErrors.serial_number = "Le numéro de série est requis";
    if (!formData.inspection_frequency) newErrors.inspection_frequency = "La fréquence d'inspection est requise";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);

    try {
      // Préparer les données pour l'API
      const epiData = {
        ...formData,
        // Convertir les dates au format ISO pour l'API
        purchase_date: formData.purchase_date.toISOString(),
        service_start_date: formData.service_start_date.toISOString(),
        manufacture_date: formData.manufacture_date.toISOString()
      };
      
      const url = isEditMode 
        ? `http://localhost:5555/epi/update/${formData.id}`
        : `http://localhost:5555/epi/add`;

      console.log("Envoi des données:", JSON.stringify(epiData));
      console.log("URL:", url);
      console.log("Méthode:", isEditMode ? 'PUT' : 'POST');

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(epiData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse API:', data);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Si pas de callback, rediriger vers la liste
        navigate("/epi");
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors({ 
        general: isEditMode 
          ? "Erreur lors de la modification de l'EPI" 
          : "Erreur lors de l'ajout de l'EPI" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateForInput = (date: Date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  };

  const getEpiTypeLabel = (typeId: number): string => {
    const type = types.find((type) => type.id === typeId);
    return type ? type.label : "Type inconnu";
  };

  const formatDate = (dateString: Date | null | undefined) => {
    if (!dateString) return "Non spécifiée";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Affichage en mode vue
  if (viewMode) {
    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/epi")}
              sx={{ mr: 2 }}
            >
              Retour
            </Button>
            <Typography variant="h4" component="h1">
              Détails de l'EPI
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/epi/${formData.id}/edit`)}
          >
            Modifier
          </Button>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {formData.brand} {formData.model}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ID interne: {formData.internal_id}
            </Typography>
            <Chip
              label={getEpiTypeLabel(formData.type_id)}
              color="primary"
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informations générales
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Numéro de série
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.serial_number}
                    </Typography>
                  </Box>
                  {formData.size && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Taille
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {formData.size}
                      </Typography>
                    </Box>
                  )}
                  {formData.color && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Couleur
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {formData.color}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dates importantes
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date d'achat
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(formData.purchase_date)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date de fabrication
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(formData.manufacture_date)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date de mise en service
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(formData.service_start_date)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contrôles
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fréquence d'inspection
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.inspection_frequency === "6m" ? "Tous les 6 mois" :
                      formData.inspection_frequency === "3m" ? "Tous les 3 mois" :
                      formData.inspection_frequency === "1y" ? "Tous les ans" :
                      formData.inspection_frequency}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/control?epi=${formData.id}`)}
                    >
                      Voir l'historique des contrôles
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  // Affichage en mode formulaire (ajout/édition)
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/epi")}
          sx={{ mr: 2 }}
        >
          Retour
        </Button>
        <Typography variant="h4" component="h1">
          {isEditMode ? "Modifier un EPI" : "Ajouter un nouvel EPI"}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Identifiant interne"
                name="internal_id"
                value={formData.internal_id}
                onChange={handleChange}
                error={!!errors.internal_id}
                helperText={errors.internal_id}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type_id}>
                <InputLabel>Type d'EPI</InputLabel>
                <Select
                  name="type_id"
                  value={formData.type_id.toString()}
                  onChange={handleSelectChange}
                  label="Type d'EPI"
                  required
                >
                  {types.map(type => (
                    <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
                  ))}
                </Select>
                {errors.type_id && <FormHelperText>{errors.type_id}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marque"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                error={!!errors.brand}
                helperText={errors.brand}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Modèle"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={!!errors.model}
                helperText={errors.model}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro de série"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                error={!!errors.serial_number}
                helperText={errors.serial_number}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date d'achat"
                name="purchase_date"
                value={formatDateForInput(formData.purchase_date)}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.purchase_date}
                helperText={errors.purchase_date}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date de fabrication"
                name="manufacture_date"
                value={formatDateForInput(formData.manufacture_date)}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.manufacture_date}
                helperText={errors.manufacture_date}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date de mise en service"
                name="service_start_date"
                value={formatDateForInput(formData.service_start_date)}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.service_start_date}
                helperText={errors.service_start_date}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fréquence d'inspection"
                name="inspection_frequency"
                value={formData.inspection_frequency}
                onChange={handleChange}
                placeholder="Ex: 3m, 6m, 1y"
                error={!!errors.inspection_frequency}
                helperText={errors.inspection_frequency || "Format: 3m (3 mois), 6m (6 mois), 1y (1 an)"}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Taille"
                name="size"
                value={formData.size || ""}
                onChange={handleChange}
                error={!!errors.size}
                helperText={errors.size}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Couleur"
                name="color"
                value={formData.color || ""}
                onChange={handleChange}
                error={!!errors.color}
                helperText={errors.color}
              />
            </Grid>
            
            {errors.general && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.general}</FormHelperText>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : (isEditMode ? "Mettre à jour" : "Ajouter")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default EPIForm;