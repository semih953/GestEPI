//********** Imports **********/
import { Epi } from "gestepiinterfaces-semih";
import { pool } from "./bdd";

//********** Helper functions **********/
// Fonction pour formater les dates pour MariaDB
const formatDateForDB = (dateInput: any): string => {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  
  let date: Date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    date = new Date();
  }
  
  return date.toISOString().split('T')[0];
};

//********** Model **********/
export const epiModel = {
  getAll: async (): Promise<Epi[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epi");
      
      // Conversion des données dans le bon format
      const epis = rows.map((row: any) => ({
        id: parseInt(row.id),
        internal_id: row.internal_id,
        serial_number: row.serial_number,
        model: row.model,
        brand: row.brand,
        type_id: parseInt(row.type_id),
        size: row.size || "",
        color: row.color || "",
        purchase_date: row.purchase_date ? new Date(row.purchase_date) : new Date(),
        service_start_date: row.service_start_date ? new Date(row.service_start_date) : new Date(),
        manufacture_date: row.manufacture_date ? new Date(row.manufacture_date) : new Date(),
        inspection_frequency: row.inspection_frequency || "6m"
      }));
      
      return epis as Epi[];
    } catch (err) {
      console.error("Error in getAll:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getById: async (id: string): Promise<Epi | null> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epi WHERE id = ?", [id]);
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      const epi: Epi = {
        id: parseInt(row.id),
        internal_id: row.internal_id,
        serial_number: row.serial_number,
        model: row.model,
        brand: row.brand,
        type_id: parseInt(row.type_id),
        size: row.size || "",
        color: row.color || "",
        purchase_date: row.purchase_date ? new Date(row.purchase_date) : new Date(),
        service_start_date: row.service_start_date ? new Date(row.service_start_date) : new Date(),
        manufacture_date: row.manufacture_date ? new Date(row.manufacture_date) : new Date(),
        inspection_frequency: row.inspection_frequency || "6m"
      };
      
      return epi;
    } catch (err) {
      console.error("Error in getById:", err);
      return null;
    } finally {
      if (conn) conn.release();
    }
  },

  addOne: async (epi: Epi): Promise<Epi | null> => {
    let conn;
    try {
      conn = await pool.getConnection();
      
      // Préparation des dates pour la base de données
      const purchase_date = formatDateForDB(epi.purchase_date);
      const service_start_date = formatDateForDB(epi.service_start_date);
      const manufacture_date = formatDateForDB(epi.manufacture_date);
      
      console.log("Ajout d'un EPI avec les dates:", {
        purchase_date,
        service_start_date,
        manufacture_date
      });
      
      const result = await conn.query(
        `INSERT INTO epi (
          internal_id, 
          serial_number, 
          model, 
          brand, 
          type_id, 
          size, 
          color, 
          purchase_date, 
          service_start_date, 
          manufacture_date,
          inspection_frequency
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          epi.internal_id,
          epi.serial_number,
          epi.model,
          epi.brand,
          epi.type_id,
          epi.size || "",
          epi.color || "",
          purchase_date,
          service_start_date,
          manufacture_date,
          epi.inspection_frequency || "6m"
        ]
      );
      
      if (result && result.insertId) {
        // Retourner l'EPI avec son ID généré
        return {
          ...epi,
          id: result.insertId
        };
      } else {
        throw new Error("Échec de l'insertion");
      }
    } catch (err) {
      console.error("Error in addOne:", err);
      return null;
    } finally {
      if (conn) conn.release();
    }
  },

  update: async (epi: Epi): Promise<any> => {
    let conn;
    try {
      conn = await pool.getConnection();
      
      // Préparation des dates pour la base de données
      const purchase_date = formatDateForDB(epi.purchase_date);
      const service_start_date = formatDateForDB(epi.service_start_date);
      const manufacture_date = formatDateForDB(epi.manufacture_date);
      
      console.log("Mise à jour d'un EPI avec les dates:", {
        purchase_date,
        service_start_date,
        manufacture_date
      });
      
      const result = await conn.query(
        `UPDATE epi SET 
          internal_id = ?, 
          serial_number = ?, 
          model = ?, 
          brand = ?, 
          type_id = ?, 
          size = ?, 
          color = ?, 
          purchase_date = ?, 
          service_start_date = ?, 
          manufacture_date = ?, 
          inspection_frequency = ?
        WHERE id = ?`,
        [
          epi.internal_id,
          epi.serial_number,
          epi.model,
          epi.brand,
          epi.type_id,
          epi.size || "",
          epi.color || "",
          purchase_date,
          service_start_date,
          manufacture_date,
          epi.inspection_frequency || "6m",
          epi.id
        ]
      );
      
      if (result && result.affectedRows > 0) {
        return { success: true, affectedRows: result.affectedRows };
      } else {
        return { success: false, affectedRows: 0 };
      }
    } catch (err) {
      console.error("Error in update:", err);
      return { success: false, error: err };
    } finally {
      if (conn) conn.release();
    }
  },

  delete: async (id: string): Promise<any> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query("DELETE FROM epi WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return { error: `No EPI found with id: ${id}` };
      }
      return { success: true, message: `EPI with id ${id} deleted successfully` };
    } catch (err) {
      console.error("Error in delete:", err);
      return { error: "Failed to delete EPI" };
    } finally {
      if (conn) conn.release();
    }
  },

  getEpisByTypeId: async (typeId: number): Promise<Epi[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epi WHERE type_id = ?", [typeId]);
      
      // Conversion des données dans le bon format
      const epis = rows.map((row: any) => ({
        id: parseInt(row.id),
        internal_id: row.internal_id,
        serial_number: row.serial_number,
        model: row.model,
        brand: row.brand,
        type_id: parseInt(row.type_id),
        size: row.size || "",
        color: row.color || "",
        purchase_date: row.purchase_date ? new Date(row.purchase_date) : new Date(),
        service_start_date: row.service_start_date ? new Date(row.service_start_date) : new Date(),
        manufacture_date: row.manufacture_date ? new Date(row.manufacture_date) : new Date(),
        inspection_frequency: row.inspection_frequency || "6m"
      }));
      
      return epis as Epi[];
    } catch (err) {
      console.error("Error in getEpisByTypeId:", err);
      return [];
    } finally {
      if (conn) conn.release();
    }
  },

  getAllEpiTypes: async (): Promise<any[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      // Vérifier si la table epiTypes existe 
      try {
        const rows = await conn.query("SELECT * FROM epiTypes");
        return rows;
      } catch (e) {
        // Si la table n'existe pas ou une autre erreur se produit, retourner des types par défaut
        console.warn("Table epiTypes non trouvée, retour des types par défaut:", e);
        return [
          { id: 1, label: "Casque" },
          { id: 2, label: "Harnais" },
          { id: 3, label: "Corde" },
          { id: 4, label: "Mousqueton" },
          { id: 5, label: "Longe" }
        ];
      }
    } catch (err) {
      console.error("Error in getAllEpiTypes:", err);
      return [];
    } finally {
      if (conn) conn.release();
    }
  },
};