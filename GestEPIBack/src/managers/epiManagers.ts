// import { NextFunction, Request } from "express";
// import { epiModel } from "../models/epiModel";
// import { Epi } from "gestepiinterfaces-semih";


// export const handleGetAllEpi = async (request: Request, next: NextFunction) => {
//     return (await epiModel.getAll()) satisfies Epi[];
// };
  
// export const handleGetAllEpiById = async (id:string, next: NextFunction) => {
//   try {
//     const epi = await epiModel.getById(id);
//     return epi;
//   } catch (e) {
//     next(e);
//   }
// };

// export const addEpi = async (epi: Epi, next: NextFunction) => {
//   try {
//     const epiAjoute = await epiModel.addOne(
//       epi
//     );
//     return epiAjoute;
//   } catch (e) {
//     next(e);
//   }
// };

// export const handleDeleteEpi = async (id:string, next: NextFunction) => {
//   try {
//     const epiSupprimer = await epiModel.delete(id);
//     return epiSupprimer;
//   } catch (e) {
//     next(e);
//   }
// };

// export const handlePutEpi = async (request: Request, next: NextFunction) => {
//   try {
//      const params: Record<string, string | number | undefined> = {};
//      if (request.query.id)
//        params["id"] = Number(request.query.id.toString());
//      if (request.query.name)
//        params["name"] = request.query.name.toString();
//      if (request.query.serial_number)
//        params["serial_number"] = request.query.serial_number.toString();
//      if (request.query.type_id)
//        params["type_id"] = Number(request.query.type_id.toString());
//      if (request.query.model)
//        params["model"] = request.query.model.toString();
//      if (request.query.brand)
//        params["brand"] = request.query.brand.toString();
//      if (request.query.color)
//        params["color"] = request.query.color.toString();
//      if (request.query.size)
//        params["size"] = request.query.size.toString();
//     if (request.query.purchase_date)
//        params["purchase_date"] = request.query.purchase_date.toString();
//      if (request.query.service_start_date)
//        params["service_start_date"] = request.query.service_start_date.toString();
//      if (request.query.manufacture_date)
//        params["manufacture_date"] = request.query.manufacture_date.toString();
 
//      const results = await epiModel.update(params);
//      if (results.affectedRows === 0) {
//        throw new Error(
//          "Erreur"
//        );
//      } else if (params["id"]) {
//        const updatedEpi = await epiModel.getById(
//          params["id"].toString()
//        );
//        return updatedEpi;
//      }
//    } catch (e) {
//      next(e);
//    }
// };


// export const handleGetAllEpiTypes = async (request: Request, next: NextFunction) => {
//   return (await epiModel.getAllEpiTypes()) satisfies Epi[];
// };