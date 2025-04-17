//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import { EpiCheck } from "gestepiinterfaces-semih";
import {
  handleAddCheck,
  handleDeleteCheck,
  handleGetAllChecks,
  handleGetAllCheckStatuses,
  handleGetCheckById,
  handleGetChecksByEpiId,
  handleGetUpcomingChecks,
  handleUpdateCheck
} from "../managers/epiCheckManagers";

const router = express.Router();

//********** Routes **********//

// GET all checks
router.get(
  "/getAll",
  async (
    request: Request,
    response: Response<EpiCheck[]>,
    next: NextFunction
  ) => {
    try {
      const checks = await handleGetAllChecks(request, next);
      response.status(200).json(checks);
    } catch (error) {
      next(error);
    }
  }
);

// GET check by ID
router.get(
  "/getById/:id",
  async (
    request: Request,
    response: Response<EpiCheck | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const check = await handleGetCheckById(id, next);
      
      if (check) {
        response.status(200).json(check);
      } else {
        response.status(404).json({ message: `No check found with id: ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// POST new check
router.post(
  "/add",
  async (
    request: Request,
    response: Response<EpiCheck | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const newCheck = request.body as EpiCheck;
      
      // Vérification des champs obligatoires
      if (!newCheck.internal_id) {
        return response.status(400).json({ message: "Le champ internal_id est requis" });
      }
      if (!newCheck.check_date) {
        return response.status(400).json({ message: "Le champ check_date est requis" });
      }
      if (newCheck.status_id === undefined || newCheck.status_id === null) {
        return response.status(400).json({ message: "Le champ status_id est requis" });
      }
      if (newCheck.user_id === undefined || newCheck.user_id === null) {
        return response.status(400).json({ message: "Le champ user_id est requis" });
      }
      
      const check = await handleAddCheck(newCheck, next);
      
      if (check) {
        response.status(201).json(check);
      } else {
        response.status(400).json({ message: "Error creating new check" });
      }
    } catch (error) {
      console.error("Error in POST /add:", error);
      next(error);
    }
  }
);

// PUT update check
router.put(
  "/update/:id",
  async (
    request: Request,
    response: Response<EpiCheck | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(request.params.id);
      const checkToUpdate = { ...request.body, id } as EpiCheck;
      const updatedCheck = await handleUpdateCheck(checkToUpdate, next);
      
      if (updatedCheck) {
        response.status(200).json(updatedCheck);
      } else {
        response.status(404).json({ message: `No check found with id: ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE check
router.delete(
  "/delete/:id",
  async (
    request: Request,
    response: Response<{ message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const result = await handleDeleteCheck(id, next);
      
      if (result.error) {
        response.status(404).json({ message: result.error });
      } else {
        response.status(200).json({ message: `Check with id ${id} deleted successfully` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET checks by EPI ID
router.get(
  "/epi/:internalId",
  async (
    request: Request,
    response: Response<EpiCheck[] | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const internalId = request.params.internalId;
      const checks = await handleGetChecksByEpiId(internalId, next);
      
      if (checks && checks.length > 0) {
        response.status(200).json(checks);
      } else {
        response.status(404).json({ message: `No checks found for EPI with internal ID: ${internalId}` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET all check statuses
router.get(
  "/statuses/all",
  async (
    request: Request,
    response: Response<any[]>,
    next: NextFunction
  ) => {
    try {
      const statuses = await handleGetAllCheckStatuses(next);
      response.status(200).json(statuses);
    } catch (error) {
      next(error);
    }
  }
);

// GET upcoming checks (for alerts)
router.get(
  "/upcoming/:days",
  async (
    request: Request,
    response: Response<any[]>,
    next: NextFunction
  ) => {
    try {
      const days = parseInt(request.params.days) || 30;
      const upcomingChecks = await handleGetUpcomingChecks(days, next);
      response.status(200).json(upcomingChecks);
    } catch (error) {
      next(error);
    }
  }
);

export default router;