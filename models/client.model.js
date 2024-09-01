// Importamos paquetes y archivos
const { Model, DataTypes } = require("sequelize");
const { connection } = require("../database/connection.database.js");

// Definimos la clase que hereda de Model
class Client extends Model {}

// Inicializamos y construimos el modelo
Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "resseller",
    },
  },
  {
    sequelize: connection,
    modelName: "clients",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        unique: true,
        fields: ["phone"],
      },
    ],
  }
);

module.exports = { Client };
