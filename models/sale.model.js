// Importamos paquetes y archivos
const { Model, DataTypes } = require("sequelize");
const { connection } = require("../database/connection.database.js");

// Definimos la clase que hereda de Model
class Sale extends Model {}

// Inicializamos y construimos el modelo
Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    id_client: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    phone_client: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendiente",
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendiente",
    },
    deposit: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    unpaid: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    id_admin:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize: connection,
    modelName: 'sales',
    freezeTableName: true
  }
);

module.exports = { Sale }
