//********** Imports **********//
import { NextFunction, Request } from "express";
import { EpiCheck } from "gestepiinterfaces-semih";
import { epiCheckModel } from "../models/epiCheckModel";

//********** Managers **********//
export const handleGetAllChecks = async (request: Request, next: NextFunction) => {
  try {
    return await epiCheckModel.getAll();
  } catch (e) {
    next(e);
    return [];
  }
};

export const handleGetCheckById = async (id: string, next: NextFunction) => {
  try {
    return await epiCheckModel.getById(id);
  } catch (e) {
    next(e);
    return null;
  }
};

export const handleAddCheck = async (check: EpiCheck, next: NextFunction) => {
  try {
    console.log("handleAddCheck - données reçues:", check);
    return await epiCheckModel.addOne(check);
  } catch (e) {
    console.error("Erreur dans handleAddCheck:", e);
    next(e);
    return null;
  }
};

export const handleUpdateCheck = async (check: EpiCheck, next: NextFunction) => {
  try {
    const result = await epiCheckModel.update(check);
    if (result.affectedRows === 0) {
      throw new Error(`Check with id ${check.id} not found or no changes made`);
    }
    return await epiCheckModel.getById(check.id.toString());
  } catch (e) {
    next(e);
    return null;
  }
};

export const handleDeleteCheck = async (id: string, next: NextFunction) => {
  try {
    return await epiCheckModel.delete(id);
  } catch (e) {
    next(e);
    return { error: "Failed to delete check" };
  }
};

export const handleGetChecksByEpiId = async (epiInternalId: string, next: NextFunction) => {
  try {
    return await epiCheckModel.getChecksByEpiId(epiInternalId);
  } catch (e) {
    next(e);
    return [];
  }
};

export const handleGetAllCheckStatuses = async (next: NextFunction) => {
  try {
    return await epiCheckModel.getAllCheckStatuses();
  } catch (e) {
    next(e);
    return [];
  }
};

export const handleGetUpcomingChecks = async (daysThreshold: number, next: NextFunction) => {
  try {
    return await epiCheckModel.getUpcomingChecks(daysThreshold);
  } catch (e) {
    next(e);
    return [];
  }
};