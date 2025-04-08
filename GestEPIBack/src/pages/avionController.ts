//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import {
    handleGetAllAvions,
    handleDeleteAvion,
    handlePutAvion,
    handleGetAvionsByImmatriculation,
    addAvion,
    handleGetWithFilters
} from "../managers/epiManagers";
import { avionModel } from "../models/avionsModel";
import { EPI } from "gestepiinterfaces-semih";

const router = express.Router();
//********** Routes **********//

// READ MIDDLEWARE
router.get(
  "/",
  async (
    request: Request, 
    response: Response<EPI[] | string>, 
    next: NextFunction 
  ) => {
    try {
      response.status(200).json(await handleGetAllAvions(request, next));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:immatriculation", 
  async (
    request: Request, 
    response: Response<EPI[] | string>, 
    next: NextFunction 
  ) => {
      try {
        const immat = request.params.immatriculation;
        const avions = await handleGetAvionsByImmatriculation(immat, next);

        if (avions && avions.length > 0) {
          response.status(200).json(avions);
        } else {
          response.status(404).json(`Aucun avion trouvé avec l'immatriculation: ${immat}`);
        }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/with/filters",
  async (
    request: Request,
    response: Response<EPI[] | string>,
    next: NextFunction
  ) => {
    try {
      const avions = await handleGetWithFilters(request, next);
      if (avions && avions.length > 0) {
        response.status(200).json(avions);
      } else {
        response.status(404).json("Aucun avion trouvé avec ce filtre.");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/update",
  async (
    request: Request,
    response: Response<EPI | string>,
    next: NextFunction
  ) => {
    try {
      const updatedAvion = await handlePutAvion(request, next);
      if (updatedAvion) {
        response.status(200).json(updatedAvion);
      } else {
        response.status(404).json("Aucun avion trouvé avec l'immatriculation fournie.");
      }
    } catch (error) {
      next(error);
    }
  }
);
  
router.delete(
  "/delete/:immatriculation",
  async (
    request: Request,
    response: Response<string>,
    next: NextFunction
  ) => {
    try {
      const immat = request.params.immatriculation;
      const result = await handleDeleteAvion(immat, next);
      
      if (result) {
        response.status(200).json(result);
      } else {
        response.status(404).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;