//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import { Users } from "gestepiinterfaces-semih";
import { 
  handleAddUser, 
  handleDeleteUser, 
  handleGetAllUsers, 
  handleGetUserByEmail, 
  handleGetUserById, 
  handleGetUsersByRole, 
  handleUpdateLastLogin, 
  handleUpdateUser 
} from "../managers/userManagers";

const router = express.Router();

//********** Routes **********//

// GET all users
router.get(
  "/getAll",
  async (
    request: Request,
    response: Response<Users[]>,
    next: NextFunction
  ) => {
    try {
      const users = await handleGetAllUsers(request, next);
      response.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// GET user by ID
router.get(
  "/getById/:id",
  async (
    request: Request,
    response: Response<Users | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const user = await handleGetUserById(id, next);
      
      if (user) {
        response.status(200).json(user);
      } else {
        response.status(404).json({ message: `No user found with id: ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }
);


// GET user by Email
router.get(
  "/getByEmail/:email",
  async (
    request: Request,
    response: Response<Users | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const email = request.params.email;
      const user = await handleGetUserByEmail(email, next);
      
      if (user) {
        response.status(200).json(user);
      } else {
        response.status(404).json({ message: `No user found with email: ${email}` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// POST new user
router.post(
  "/add",
  async (
    request: Request,
    response: Response<Users | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const newUser = request.body as Users;
      const user = await handleAddUser(newUser, next);
      
      if (user) {
        response.status(201).json(user);
      } else {
        response.status(400).json({ message: "Error creating new user" });
      }
    } catch (error) {
      next(error);
    }
  }
);

// PUT update user
router.put(
  "/update/:id",  // C'est correct maintenant
  async (
    request: Request,
    response: Response<Users | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const userToUpdate = { ...request.body, id } as Users;
      const updatedUser = await handleUpdateUser(userToUpdate, next);
      
      if (updatedUser) {
        response.status(200).json(updatedUser);
      } else {
        response.status(404).json({ message: `No user found with id: ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE user
router.delete(
  "/delete/:id",
  async (
    request: Request,
    response: Response<{ message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const result = await handleDeleteUser(id, next);
      
      if (result.error) {
        response.status(404).json({ message: result.error });
      } else {
        response.status(200).json({ message: `User with id ${id} deleted successfully` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET users by role
router.get(
  "/byRole/:role",
  async (
    request: Request,
    response: Response<Users[] | { message: string }>,
    next: NextFunction
  ) => {
    try {
      const role = request.params.role;
      const users = await handleGetUsersByRole(role, next);
      
      if (users && users.length > 0) {
        response.status(200).json(users);
      } else {
        response.status(404).json({ message: `No users found with role: ${role}` });
      }
    } catch (error) {
      next(error);
    }
  }
);

// PATCH update last login
router.patch(
  "/updateLastLogin/:id",
  async (
    request: Request,
    response: Response<{ message: string }>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const result = await handleUpdateLastLogin(id, next);
      
      if (result.success) {
        response.status(200).json({ message: "Last login updated successfully" });
      } else {
        response.status(400).json({ message: "Failed to update last login" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;