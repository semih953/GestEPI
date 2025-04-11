//********** Imports **********/
import { Epi } from "gestepiinterfaces-semih";
import { pool } from "./bdd";


//********** Model **********/
export const epiModel = {
  getAll: async (): Promise<Epi[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epi");
      return rows as Epi[];
    } catch (err) {
      console.error("Error in getAll:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getById: async (id: string): Promise<Epi> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epi WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error(`No EPI found with id: ${id}`);
      }
      return rows[0] as Epi;
    } catch (err) {
      console.error("Error in getById:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  addOne: async (epi: Epi): Promise<Epi> => {
    let conn;
    try {
        conn = await pool.getConnection();
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
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
          epi.internal_id,
          epi.serial_number,
          epi.model,
          epi.brand,
          epi.type_id,
          epi.size,
          epi.color,
          epi.purchase_date,
          epi.service_start_date,
          epi.manufacture_date,
          epi.inspection_frequency
        ]
      );
      
      const insertedId = result.insertId;
      return { ...epi, id: insertedId };
    } catch (err) {
      console.error("Error in addOne:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  update: async (epi: Epi): Promise<any> => {
    let conn;
    try {
      conn = await pool.getConnection();
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
          epi.size,
          epi.color,
          epi.purchase_date,
          epi.service_start_date,
          epi.manufacture_date,
          epi.inspection_frequency,
          epi.id
        ]
      );
      return result;
    } catch (err) {
      console.error("Error in update:", err);
      throw err;
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
        throw new Error(`No EPI found with id: ${id}`);
      }
      return { message: `EPI with id ${id} deleted successfully` };
    } catch (err) {
      console.error("Error in delete:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getEpisByTypeId: async (typeId: number): Promise<Epi[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epi WHERE type_id = ?", [typeId]);
      return rows as Epi[];
    } catch (err) {
      console.error("Error in getEpisByTypeId:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getAllEpiTypes: async (): Promise<any[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epi_types");
      return rows;
    } catch (err) {
      console.error("Error in getAllEpiTypes:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

};