//********** Imports **********/
import { Users } from "gestepiinterfaces-semih";
import { pool } from "./bdd";

//********** Model **********/
export const userModel = {
  getAll: async (): Promise<Users[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT id, first_name, last_name, email, role FROM users");
      return rows as Users[];
    } catch (err) {
      console.error("Error in getAll:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getById: async (id: string): Promise<Users> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT id, first_name, last_name, email, role FROM users WHERE id = ?", 
        [id]
      );
      if (rows.length === 0) {
        throw new Error(`No user found with id: ${id}`);
      }
      return rows[0] as Users;
    } catch (err) {
      console.error("Error in getById:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  addOne: async (user: Users & { password: string }): Promise<Users> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const insertQuery = `
        INSERT INTO users (
          first_name, 
          last_name, 
          email, 
          role, 
          password
        ) VALUES (?, ?, ?, ?, ?)`;
      
      const result = await conn.query(
        insertQuery,
        [
          user.first_name,
          user.last_name,
          user.email,
          user.role,
          user.password // Idéalement, ce devrait être un hash du mot de passe
        ]
      );
      
      const insertedId = result.insertId;
      // Ne pas renvoyer le mot de passe
      return { 
        id: insertedId.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      };
    } catch (err) {
      console.error("Error in addOne:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  update: async (user: Users): Promise<any> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const updateQuery = `
        UPDATE users SET 
          first_name = ?, 
          last_name = ?, 
          email = ?, 
          role = ?
        WHERE id = ?`;
      
      const result = await conn.query(
        updateQuery,
        [
          user.first_name,
          user.last_name,
          user.email,
          user.role,
          user.id
        ]
      );
      
      if (result.affectedRows === 0) {
        throw new Error(`User with id ${user.id} not found or no changes made`);
      }
      
      return { message: "User updated successfully" };
    } catch (err) {
      console.error("Error in update:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  updatePassword: async (id: string, hashedPassword: string): Promise<any> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error(`User with id ${id} not found`);
      }
      
      return { message: "Password updated successfully" };
    } catch (err) {
      console.error("Error in updatePassword:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  delete: async (id: string): Promise<any> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query("DELETE FROM users WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        throw new Error(`No user found with id: ${id}`);
      }
      return { message: `User with id ${id} deleted successfully` };
    } catch (err) {
      console.error("Error in delete:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getUsersByRole: async (role: string): Promise<Users[]> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT id, first_name, last_name, email, role FROM users WHERE role = ?", 
        [role]
      );
      return rows as Users[];
    } catch (err) {
      console.error("Error in getUsersByRole:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Fonction pour l'authentification
  authenticate: async (email: string, password: string): Promise<Users | null> => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT id, first_name, last_name, email, role, password FROM users WHERE email = ?", 
        [email]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const user = rows[0];
      
      // Ici, vous devriez comparer le mot de passe fourni avec le hash stocké
      // en utilisant une bibliothèque comme bcrypt
      // Par exemple: const isMatch = await bcrypt.compare(password, user.password);
      
      // Pour la simplicité, nous faisons une comparaison directe
      // (À NE PAS FAIRE EN PRODUCTION)
      if (password === user.password) {
        // Ne pas renvoyer le mot de passe
        return {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        };
      }
      
      return null;
    } catch (err) {
      console.error("Error in authenticate:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
};