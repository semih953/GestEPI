import { Request, Response } from 'express';
import epiService from '../services/epi.services';

class EPIController {
  // Récupérer tous les EPI
  async getAllEPIs(req: Request, res: Response): Promise<void> {
    try {
      const epis = await epiService.getAllEPIs();
      res.status(200).json(epis);
    } catch (error) {
      console.error('Error fetching EPIs:', error);
      res.status(500).json({ message: 'Error fetching EPIs', error });
    }
  }

  // Récupérer un EPI par son ID
  async getEPIById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const epi = await epiService.getEPIById(id);
      
      if (!epi) {
        res.status(404).json({ message: `EPI with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(epi);
    } catch (error) {
      console.error(`Error fetching EPI with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error fetching EPI', error });
    }
  }

  // Créer un nouvel EPI
  async createEPI(req: Request, res: Response): Promise<void> {
    try {
      const epi = await epiService.createEPI(req.body);
      res.status(201).json(epi);
    } catch (error) {
      console.error('Error creating EPI:', error);
      res.status(500).json({ message: 'Error creating EPI', error });
    }
  }

  // Mettre à jour un EPI
  async updateEPI(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const [affectedCount, affectedRows] = await epiService.updateEPI(id, req.body);
      
      if (affectedCount === 0) {
        res.status(404).json({ message: `EPI with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(affectedRows[0]);
    } catch (error) {
      console.error(`Error updating EPI with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error updating EPI', error });
    }
  }

  // Supprimer un EPI
  async deleteEPI(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deletedCount = await epiService.deleteEPI(id);
      
      if (deletedCount === 0) {
        res.status(404).json({ message: `EPI with ID ${id} not found` });
        return;
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting EPI with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error deleting EPI', error });
    }
  }

  // Récupérer un EPI avec ses contrôles
  async getEPIWithControls(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const epi = await epiService.getEPIWithControls(id);
      
      if (!epi) {
        res.status(404).json({ message: `EPI with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(epi);
    } catch (error) {
      console.error(`Error fetching EPI with controls (ID ${req.params.id}):`, error);
      res.status(500).json({ message: 'Error fetching EPI with controls', error });
    }
  }

  // Récupérer les EPI dont le contrôle est à faire bientôt
  async getEPIsWithUpcomingControls(req: Request, res: Response): Promise<void> {
    try {
      const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 30;
      const epis = await epiService.getEPIsWithUpcomingControls(daysThreshold);
      res.status(200).json(epis);
    } catch (error) {
      console.error('Error fetching EPIs with upcoming controls:', error);
      res.status(500).json({ message: 'Error fetching EPIs with upcoming controls', error });
    }
  }
}

export default new EPIController();