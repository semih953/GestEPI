import { ControlModel, EPIModel } from '../models';
import { Control } from 'gestepiinterfaces-semih';

class ControlService {
  // Récupérer tous les contrôles
  async getAllControls(): Promise<Control[]> {
    return await ControlModel.findAll({
      include: [
        {
          model: EPIModel,
          as: 'epi',
        },
      ],
    });
  }

  // Récupérer un contrôle par son ID
  async getControlById(id: number): Promise<Control | null> {
    return await ControlModel.findByPk(id, {
      include: [
        {
          model: EPIModel,
          as: 'epi',
        },
      ],
    });
  }

  // Récupérer tous les contrôles d'un EPI
  async getControlsByEpiId(epiId: number): Promise<Control[]> {
    return await ControlModel.findAll({
      where: { epiId },
      order: [['controlDate', 'DESC']],
    });
  }

  // Créer un nouveau contrôle
  async createControl(controlData: Omit<Control, 'id'>): Promise<Control> {
    return await ControlModel.create(controlData);
  }

  // Mettre à jour un contrôle
  async updateControl(id: number, controlData: Partial<Control>): Promise<[number, Control[]]> {
    const [affectedCount, affectedRows] = await ControlModel.update(controlData, {
      where: { id },
      returning: true,
    });
    return [affectedCount, affectedRows];
  }

  // Supprimer un contrôle
  async deleteControl(id: number): Promise<number> {
    return await ControlModel.destroy({
      where: { id },
    });
  }
}

export default new ControlService();