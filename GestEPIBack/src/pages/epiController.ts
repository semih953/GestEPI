//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import { Epi } from "gestepiinterfaces-semih";
import { handleAddEpi, handleDeleteEpi, handleGetAllEpi, handleGetAllEpiTypes, handleGetEpiById, handleGetEpisByTypeId, handleUpdateEpi } from "../managers/epiManagers";


const router = express.Router();

//********** Routes **********//

// GET all EPIs
router.get(
  "/getAll",
  async (
    request: Request,
    response: Response<Epi[]>,
    next: NextFunction
  ) => {
    try {
      const epis = await handleGetAllEpi(request, next);
      response.status(200).json(epis);
    } catch (error) {
      next(error);
    }
  }
);

// GET EPI by ID
router.get(
  "/getById/:id",
  async (
    request: Request,
    response: Response<Epi | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const epi = await handleGetEpiById(id, next);
      
      if (epi) {
        response.status(200).json(epi);
      } else {
        response.status(404).json({ message: `No EPI found with id: ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }
);



// POST new EPI
router.post(
  "/add",
  async (
    request: Request,
    response: Response<Epi | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const newEpi = request.body as Epi;
      const epi = await handleAddEpi(newEpi, next);
      
      if (epi) {
        response.status(201).json(epi);
      } else {
        response.status(400).json({ message: "Error creating new EPI" });
      }
    } catch (error) {
      next(error);
    }
  }
);

// PUT update EPI
router.put(
  "update/:id",
  async (
    request: Request,
    response: Response<Epi | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(request.params.id);
      const epiToUpdate = { ...request.body, id } as Epi;
      const updatedEpi = await handleUpdateEpi(epiToUpdate, next);
      
      if (updatedEpi) {
        response.status(200).json(updatedEpi);
      } else {
        response.status(404).json({ message: `No EPI found with id: ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE EPI
router.delete(
  "/delete/:id",
  async (
    request: Request,
    response: Response<{ message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const result = await handleDeleteEpi(id, next);
      
      if (result.error) {
        response.status(404).json({ message: result.error });
      } else {
        response.status(200).json({ message: `EPI with id ${id} deleted successfully` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET EPIs by type
router.get(
  "/type/:typeId",
  async (
    request: Request,
    response: Response<Epi[] | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const typeId = parseInt(request.params.typeId);
      const epis = await handleGetEpisByTypeId(typeId, next);
      
      if (epis && epis.length > 0) {
        response.status(200).json(epis);
      } else {
        response.status(404).json({ message: `No EPIs found with type ID: ${typeId}` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET all EPI types
router.get(
  "/types/all",
  async (
    request: Request,
    response: Response<any[]>,
    next: NextFunction
  ) => {
    try {
      const types = await handleGetAllEpiTypes(next);
      response.status(200).json(types);
    } catch (error) {
      next(error);
    }
  }
);



export default router;