// Importamos paquetes y archivos
const { Model, DataTypes } = require("sequelize");
const { connection } = require("../database/connection.database.js");

// Definimos la clase que hereda de Model
class Purchase extends Model {}

// Inicializamos y construimos el modelo
Purchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    total_cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    sequelize: connection,
    modelName: "purchases",
    freezeTableName: true,
  }
);

module.exports = { Purchase }
