import { Request, Response } from 'express';
import controlService from '../services/control.services';

class ControlController {
  // Récupérer tous les contrôles
  async getAllControls(req: Request, res: Response): Promise<void> {
    try {
      const controls = await controlService.getAllControls();
      res.status(200).json(controls);
    } catch (error) {
      console.error('Error fetching controls:', error);
      res.status(500).json({ message: 'Error fetching controls', error });
    }
  }

  // Récupérer un contrôle par son ID
  async getControlById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const control = await controlService.getControlById(id);
      
      if (!control) {
        res.status(404).json({ message: `Control with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(control);
    } catch (error) {
      console.error(`Error fetching control with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error fetching control', error });
    }
  }

  // Récupérer tous les contrôles d'un EPI
  async getControlsByEpiId(req: Request, res: Response): Promise<void> {
    try {
      const epiId = parseInt(req.params.epiId);
      const controls = await controlService.getControlsByEpiId(epiId);
      res.status(200).json(controls);
    } catch (error) {
      console.error(`Error fetching controls for EPI with ID ${req.params.epiId}:`, error);
      res.status(500).json({ message: 'Error fetching controls for EPI', error });
    }
  }

  // Créer un nouveau contrôle
  async createControl(req: Request, res: Response): Promise<void> {
    try {
      const control = await controlService.createControl(req.body);
      res.status(201).json(control);
    } catch (error) {
      console.error('Error creating control:', error);
      res.status(500).json({ message: 'Error creating control', error });
    }
  }

  // Mettre à jour un contrôle
  async updateControl(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const [affectedCount, affectedRows] = await controlService.updateControl(id, req.body);
      
      if (affectedCount === 0) {
        res.status(404).json({ message: `Control with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(affectedRows[0]);
    } catch (error) {
      console.error(`Error updating control with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error updating control', error });
    }
  }

  // Supprimer un contrôle
  async deleteControl(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deletedCount = await controlService.deleteControl(id);
      
      if (deletedCount === 0) {
        res.status(404).json({ message: `Control with ID ${id} not found` });
        return;
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting control with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error deleting control', error });
    }
  }
}

export default new ControlController();