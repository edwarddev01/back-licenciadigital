// Importamos paquetes y archivos
const { Model, DataTypes } = require("sequelize");
const { connection } = require("../database/connection.database.js");

// Definimos la clase que hereda de Model
class Notification extends Model {}

// Inicializamos y construimos el modelo
Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone_client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_client: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_sale: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
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
    modelName: "notifications",
    freezeTableName: true,
  }
);

module.exports = { Notification }