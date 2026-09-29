//============IMPORTS==============
import mysql from 'mysql2/promise'
//mysql2/promise → pour parler à une base de données MySQL (version "promise", ce qui permet d'utiliser async/await)


//=============DATABASE CONFIGURATION===============
//au début on avait :
const db_config = {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}
//Interêt : les données ne sont plus visibles, elles sont en brut dans .env qui ne sera donc pas dans Docker


//============DATABASE CONNECTION===============
const db = mysql.createPool(db_config);
//createPool : permet de créer plusieurs connexions réutilisables, contrairement à createConnection

export default db;
