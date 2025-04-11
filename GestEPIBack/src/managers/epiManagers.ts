//********** Imports **********//
import { NextFunction, Request } from "express";
import { Epi } from "gestepiinterfaces-semih";
import { epiModel } from "../models/epiModel";

//********** Managers **********//
export const handleGetAllEpi = async (request: Request, next: NextFunction) => {
  try {
    return await epiModel.getAll();
  } catch (e) {
    next(e);
    return [];
  }
};

export const handleGetEpiById = async (id: string, next: NextFunction) => {
  try {
    return await epiModel.getById(id);
  } catch (e) {
    next(e);
    return null;
  }
};


export const handleAddEpi = async (epi: Epi, next: NextFunction) => {
  try {
    return await epiModel.addOne(epi);
  } catch (e) {
    next(e);
    return null;
  }
};

export const handleUpdateEpi = async (epi: Epi, next: NextFunction) => {
  try {
    const result = await epiModel.update(epi);
    if (result.affectedRows === 0) {
      throw new Error(`EPI with id ${epi.id} not found or no changes made`);
    }
    return await epiModel.getById(epi.id.toString());
  } catch (e) {
    next(e);
    return null;
  }
};

export const handleDeleteEpi = async (id: string, next: NextFunction) => {
  try {
    return await epiModel.delete(id);
  } catch (e) {
    next(e);
    return { error: "pas de delete" };
  }
};

export const handleGetEpisByTypeId = async (typeId: number, next: NextFunction) => {
  try {
    return await epiModel.getEpisByTypeId(typeId);
  } catch (e) {
    next(e);
    return [];
  }
};

export const handleGetAllEpiTypes = async (next: NextFunction) => {
  try {
    return await epiModel.getAllEpiTypes();
  } catch (e) {
    next(e);
    return [];
  }
};

