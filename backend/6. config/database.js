//============IMPORTS==============
import mysql from 'mysql2/promise'
//mysql2/promise → pour parler à une base de données MySQL (version "promise", ce qui permet d'utiliser async/await)
// import dotenv from 'dotenv'
//
// dotenv.config()
// charge les variables du fichier .env dans process.env

//=============DATABASE CONFIGURATION===============
//au début on avait :
const db_config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'coffee_site_project'
}
// //--> pb : toutes les données sont visibles
// //Pourquoi ce changement compte pour Docker : ton fichier .env local restera DB_HOST=localhost pour continuer à développer normalement sur ta machine. Mais dans ton docker-compose.yml, tu définiras un DB_HOST=db (le nom du service MySQL dans Compose) directement dans la section environment du service app — sans toucher une seule ligne de ce fichier JS. Le code s'adapte automatiquement à son environnement d'exécution.
//
// const db_config = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }

//============DATABASE CONNECTION===============
const db = mysql.createPool(db_config);
//avant on avait const db = await mysql.createConnection(db_config);

export default db;
// on exporte par défaut pour pouvoir l'importer ailleurs plus tard