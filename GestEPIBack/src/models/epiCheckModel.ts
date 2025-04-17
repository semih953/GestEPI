//********** Imports **********/
import { EpiCheck } from "gestepiinterfaces-semih";
import { pool } from "./bdd";

//********** Model **********/
export const epiCheckModel = {
  getAll: async (): Promise<EpiCheck[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epiCheck");
      return rows as EpiCheck[];
    } catch (err) {
      console.error("Error in getAll:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getById: async (id: string): Promise<EpiCheck> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epiCheck WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error(`No check found with id: ${id}`);
      }
      return rows[0] as EpiCheck;
    } catch (err) {
      console.error("Error in getById:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  addOne: async (check: EpiCheck): Promise<EpiCheck> => {
    let conn;
    try {
      // Log les données reçues pour le debugging
      console.log("Données reçues dans addOne:", check);
      
      conn = await pool.getConnection();
      
      // S'assurer que tous les champs requis sont présents
      if (!check.internal_id || !check.check_date || check.status_id === undefined || check.user_id === undefined) {
        console.error("Champs manquants:", { 
          internal_id: check.internal_id, 
          check_date: check.check_date,
          status_id: check.status_id,
          user_id: check.user_id
        });
        throw new Error("Tous les champs requis doivent être fournis");
      }
      
      const result = await conn.query(
        `INSERT INTO epiCheck (
          internal_id, 
          check_date, 
          status_id, 
          user_id
        ) VALUES (?, ?, ?, ?);`,
        [
          check.internal_id,
          check.check_date,
          check.status_id,
          check.user_id
        ]
      );
      
      console.log("Résultat de l'insertion:", result);
      
      const insertedId = result.insertId;
      return { ...check, id: insertedId };
    } catch (err) {
      console.error("Error in addOne:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  update: async (check: EpiCheck): Promise<any> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(
        `UPDATE epiCheck SET 
          internal_id = ?, 
          check_date = ?, 
          status_id = ?, 
          user_id = ?
        WHERE id = ?`,
        [
          check.internal_id,
          check.check_date,
          check.status_id,
          check.user_id,
          check.id
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
      const result = await conn.query("DELETE FROM epiCheck WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        throw new Error(`No check found with id: ${id}`);
      }
      return { message: `Check with id ${id} deleted successfully` };
    } catch (err) {
      console.error("Error in delete:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Méthode pour récupérer tous les contrôles d'un EPI spécifique
  getChecksByEpiId: async (epiInternalId: string): Promise<EpiCheck[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM epiCheck WHERE internal_id = ? ORDER BY check_date DESC", [epiInternalId]);
      return rows as EpiCheck[];
    } catch (err) {
      console.error("Error in getChecksByEpiId:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Méthode pour récupérer tous les statuts de contrôle disponibles
  getAllCheckStatuses: async (): Promise<any[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM checkStatus");
      return rows;
    } catch (err) {
      console.error("Error in getAllCheckStatuses:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Méthode pour récupérer les contrôles à venir (pour les alertes)
  getUpcomingChecks: async (daysThreshold: number = 30): Promise<any[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      // Cette requête est plus complexe et nécessiterait de joindre les tables epi et epiCheck
      // pour calculer quand le prochain contrôle est dû en fonction de la date du dernier contrôle et 
      // de la fréquence d'inspection de l'EPI
      const query = `
        SELECT e.id AS epi_id, e.internal_id, e.model, e.brand, e.inspection_frequency, 
               c.id AS last_check_id, c.check_date, 
               DATEDIFF(
                 DATE_ADD(c.check_date, INTERVAL 
                   CASE 
                     WHEN e.inspection_frequency = '1m' THEN 1 
                     WHEN e.inspection_frequency = '3m' THEN 3 
                     WHEN e.inspection_frequency = '6m' THEN 6 
                     WHEN e.inspection_frequency = '1y' THEN 12 
                     ELSE 6 -- Par défaut 6 mois
                   END MONTH
                 ),
                 CURRENT_DATE()
               ) AS days_until_next_check
        FROM epi e
        JOIN (
          SELECT internal_id, MAX(check_date) as max_date
          FROM epiCheck
          GROUP BY internal_id
        ) latest ON e.internal_id = latest.internal_id
        JOIN epiCheck c ON c.internal_id = latest.internal_id AND c.check_date = latest.max_date
        WHERE DATEDIFF(
                DATE_ADD(c.check_date, INTERVAL 
                  CASE 
                    WHEN e.inspection_frequency = '1m' THEN 1 
                    WHEN e.inspection_frequency = '3m' THEN 3 
                    WHEN e.inspection_frequency = '6m' THEN 6 
                    WHEN e.inspection_frequency = '1y' THEN 12 
                    ELSE 6 -- Par défaut 6 mois
                  END MONTH
                ),
                CURRENT_DATE()
              ) BETWEEN 0 AND ?
        ORDER BY days_until_next_check ASC
      `;
      
      const rows = await conn.query(query, [daysThreshold]);
      return rows;
    } catch (err) {
      console.error("Error in getUpcomingChecks:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
};