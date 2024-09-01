// Importamos paquetes y archivos
const { Model, DataTypes } = require("sequelize");
const { connection } = require("../database/connection.database.js");

// Definimos la clase que hereda de Model
class reCAPTCHA extends Model {}

// Inicializamos y construimos el modelo
reCAPTCHA.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    site_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secret_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: connection,
    modelName: "recaptcha",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["site_key", "secret_key"],
      },
      {
        unique: true,
        fields: ["status"],
      },
    ],
  }
);

module.exports = { reCAPTCHA };
