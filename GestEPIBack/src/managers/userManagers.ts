//********** Imports **********//
import { NextFunction, Request } from "express";
import { Users } from "gestepiinterfaces-semih";
import { userModel } from "../models/userModel";

//********** Managers **********//
export const handleGetAllUsers = async (request: Request, next: NextFunction) => {
  try {
    return await userModel.getAll();
  } catch (e) {
    next(e);
    return [];
  }
};

export const handleGetUserById = async (id: string, next: NextFunction) => {
  try {
    return await userModel.getById(id);
  } catch (e) {
    next(e);
    return null;
  }
};

export const handleAddUser = async (user: Users, next: NextFunction) => {
  try {
    return await userModel.addOne(user);
  } catch (e) {
    next(e);
    return null;
  }
};

export const handleUpdateUser = async (user: Users, next: NextFunction) => {
  try {
    const result = await userModel.update(user);
    if (result.affectedRows === 0) {
      throw new Error(`User with id ${user.id} not found or no changes made`);
    }
    return await userModel.getById(user.id.toString());
  } catch (e) {
    next(e);
    return null;
  }
};

export const handleDeleteUser = async (id: string, next: NextFunction) => {
  try {
    return await userModel.delete(id);
  } catch (e) {
    next(e);
    return { error: "Failed to delete user" };
  }
};

export const handleGetUsersByRole = async (role: string, next: NextFunction) => {
  try {
    return await userModel.getUsersByRole(role);
  } catch (e) {
    next(e);
    return [];
  }
};

export const handleUpdateLastLogin = async (id: string, next: NextFunction) => {
  try {
    await userModel.updateLastLogin(id);
    return { success: true };
  } catch (e) {
    next(e);
    return { success: false };
  }
};