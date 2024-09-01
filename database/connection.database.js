// Importamos paquetes y archivos
const { Sequelize } = require("sequelize");
const { config } = require("./config.database.js");
require("dotenv").config();

// Creamos la conexion a la base de datos
const mode = process.env.MODE || "development";
const connection = new Sequelize(config[mode]);

module.exports = { connection };
