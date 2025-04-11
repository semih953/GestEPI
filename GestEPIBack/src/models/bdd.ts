//********** Imports **********/
import mariadb from "mariadb";

// //********** Pool **********/
// export const pool = mariadb.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "gestepi",
//   connectionLimit: 10,
//   dateStrings: true,
//   ssl: false
// });

// export const pool = mariadb.createPool({
//   host: "localhost", // ou l'IP spécifique assignée au conteneur
//   port: 3306, // ou le port mappé si différent
//   user: "root",
//   password: "root",
//   database: "gestepi"
// });


export const pool = mariadb.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // Laissez vide si vous n'avez pas défini de mot de passe, sinon mettez votre mot de passe
  database: "gestepi",
  connectionLimit: 2,
  connectTimeout: 5000
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



