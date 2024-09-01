// Importamos paquetes y archivos
const { Model, DataTypes } = require("sequelize");
const { connection } = require("../database/connection.database.js");

// Definimos la clase que hereda de Model
class Product extends Model {}

// Inicializamos y construimos el modelo
Product.init(
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
    normal_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    resseller_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "#",
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

  },
  {
    sequelize: connection,
    modelName: "products",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
    ],
  }
);

module.exports = { Product };
