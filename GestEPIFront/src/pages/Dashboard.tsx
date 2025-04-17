import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import { Warning, CheckCircle, LocalOffer, Assignment } from "@mui/icons-material";
import { Epi, EpiCheck } from "gestepiinterfaces-semih";

// Interface pour les alertes
interface ControlAlert {
  epi: Epi;
  lastControl: EpiCheck | null;
  daysUntilNextCheck: number;
}

export const Dashboard = () => {
  const [alerts, setAlerts] = useState<ControlAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEpis: 0,
    totalControls: 0,
    pendingControls: 0
  });

  useEffect(() => {
    // Fonction pour charger les statistiques et les alertes
    const fetchData = async () => {
      try {
        // Charger les EPIs pour les stats
        const episResponse = await fetch("http://localhost:5555/epi/getAll");
        if (!episResponse.ok) throw new Error("Erreur lors du chargement des EPIs");
        const episData = await episResponse.json();
        
        // Charger les contrôles
        const checksResponse = await fetch("http://localhost:5555/epiCheck/getAll");
        if (!checksResponse.ok) throw new Error("Erreur lors du chargement des contrôles");
        const checksData = await checksResponse.json();
        
        // Charger les alertes pour les contrôles à venir (30 jours)
        const alertsResponse = await fetch("http://localhost:5555/epiCheck/upcoming/30");
        let alertsData: ControlAlert[] = [];
        
        if (alertsResponse.ok) {
          alertsData = await alertsResponse.json();
        } else {
          console.error("Error loading alerts, using fallback");
          // Si l'API échoue, on utilise les données des EPIs et contrôles pour construire les alertes
          alertsData = calculateAlerts(episData, checksData);
        }
        
        // Définir les statistiques
        setStats({
          totalEpis: episData.length,
          totalControls: checksData.length,
          pendingControls: alertsData.length
        });
        
        setAlerts(alertsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Impossible de charger les données du tableau de bord");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction de calcul des alertes à partir des EPIs et contrôles
  // Cette fonction est utilisée comme fallback si l'API d'alertes échoue
  const calculateAlerts = (epis: Epi[], checks: EpiCheck[]): ControlAlert[] => {
    const result: ControlAlert[] = [];
    
    epis.forEach(epi => {
      // Trouver le dernier contrôle pour cet EPI
      const epiChecks = checks.filter(check => check.internal_id === epi.internal_id);
      let lastCheck: EpiCheck | null = null;
      
      if (epiChecks.length > 0) {
        // Trouver le contrôle le plus récent
        lastCheck = epiChecks.reduce((latest, current) => {
          const latestDate = new Date(latest.check_date);
          const currentDate = new Date(current.check_date);
          return currentDate > latestDate ? current : latest;
        });
      }
      
      // Calculer quand le prochain contrôle est dû
      if (lastCheck) {
        const lastCheckDate = new Date(lastCheck.check_date);
        let nextCheckDate = new Date(lastCheckDate);
        
        // Déterminer la période en fonction de la fréquence d'inspection
        switch (epi.inspection_frequency) {
          case '1m':
            nextCheckDate.setMonth(nextCheckDate.getMonth() + 1);
            break;
          case '3m':
            nextCheckDate.setMonth(nextCheckDate.getMonth() + 3);
            break;
          case '6m':
            nextCheckDate.setMonth(nextCheckDate.getMonth() + 6);
            break;
          case '1y':
          default:
            nextCheckDate.setFullYear(nextCheckDate.getFullYear() + 1);
            break;
        }
        
        // Calculer le nombre de jours jusqu'au prochain contrôle
        const today = new Date();
        const diffTime = nextCheckDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Si le contrôle est prévu dans les 30 prochains jours, l'ajouter aux alertes
        if (diffDays <= 30 && diffDays >= 0) {
          result.push({
            epi,
            lastControl: lastCheck,
            daysUntilNextCheck: diffDays
          });
        }
      } else {
        // Si l'EPI n'a jamais été contrôlé, le signaler comme urgent
        result.push({
          epi,
          lastControl: null,
          daysUntilNextCheck: 0
        });
      }
    });
    
    // Trier par urgence (nombre de jours restants)
    return result.sort((a, b) => a.daysUntilNextCheck - b.daysUntilNextCheck);
  };

  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "Jamais";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Tableau de bord
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Statistiques */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <LocalOffer sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">Total EPI</Typography>
              <Typography variant="h3">{stats.totalEpis}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6">Contrôles effectués</Typography>
              <Typography variant="h3">{stats.totalControls}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
              <Typography variant="h6">Contrôles à faire</Typography>
              <Typography variant="h3">{stats.pendingControls}</Typography>
            </Paper>
          </Grid>

          {/* Alertes */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Alertes de contrôle à venir
                </Typography>
              </Box>
              
              {alerts.length === 0 ? (
                <Typography>Aucune alerte pour les 30 prochains jours</Typography>
              ) : (
                <List>
                  {alerts.map((alert, index) => (
                    <React.Fragment key={alert.epi.id}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText
                          primary={`${alert.epi.internal_id} - ${alert.epi.brand} ${alert.epi.model}`}
                          secondary={`Dernier contrôle: ${alert.lastControl ? formatDate(alert.lastControl.check_date) : "Jamais contrôlé"}`}
                        />
                        <Chip 
                          label={alert.lastControl 
                            ? `Contrôle dans ${alert.daysUntilNextCheck} jours` 
                            : "Contrôle urgent"}
                          color={alert.daysUntilNextCheck <= 7 ? "error" : "warning"}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};