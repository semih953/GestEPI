//********** Imports **********/
import mariadb from "mariadb";

//********** Pool **********/
export const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "gestepi",
  connectionLimit: 5,
  dateStrings:true,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connexion réussie !");
    conn.end();
  } catch (err) {
    console.error("❌ Erreur de connexion :", err);
  }
})();
