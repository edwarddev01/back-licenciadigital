// Importamos modelos
const { reCAPTCHA } = require("../models/recaptcha.model.js");
const { Admin } = require("../models/admin.model.js");
const { Client } = require("../models/client.model.js");
const { Product } = require("../models/product.model.js");
const { Purchase } = require("../models/purchase.model.js");
const { Sale } = require("../models/sale.model.js");
const { SaleDetails } = require("../models/sale_details.model.js");
const { Notification } = require("../models/notification.model.js");

// Creamos las relaciones
async function creatingRelations() {
  console.log("Creando relaciones...");
  
  // Cliente - Notificación
  Client.hasMany(Notification, { foreignKey: "id_client" });
  Notification.belongsTo(Client, { foreignKey: "id_client" });

  // Producto - Notificación
  Product.hasMany(Notification, { foreignKey: "id_product" });
  Notification.belongsTo(Product, { foreignKey: "id_product" });

  // Venta - Notificación
  Sale.hasMany(Notification, { foreignKey: "id_sale" });
  Notification.belongsTo(Sale, { foreignKey: "id_sale" });

  // Cliente - Venta
  Client.hasMany(Sale, { foreignKey: "id_client" });
  Sale.belongsTo(Client, { foreignKey: "id_client" });

  // Admin - Venta
  Admin.hasMany(Sale, { foreignKey: "id_admin" });
  Sale.belongsTo(Admin, { foreignKey: "id_admin" });

  // Venta - Detalles de Venta
  Sale.hasMany(SaleDetails, { foreignKey: "id_sale" });
  SaleDetails.belongsTo(Sale, { foreignKey: "id_sale" });

  // Producto - Detalles de Venta
  Product.hasMany(SaleDetails, { foreignKey: "id_product" });
  SaleDetails.belongsTo(Product, { foreignKey: "id_product" });

  // Producto - Compra
  Product.hasMany(Purchase, { foreignKey: "id_product" });
  Purchase.belongsTo(Product, { foreignKey: "id_product" });

  console.log("Relaciones creadas.");
  
  // Sincronizando Modelos
  console.log("Sincronizando modelos...");
  await reCAPTCHA.sync();
  await Admin.sync();
  await Client.sync();
  await Product.sync();
  await Purchase.sync();
  await Sale.sync();
  await SaleDetails.sync();
  await Notification.sync();
  console.log("Modelos sincronizados.");
}

module.exports = { creatingRelations };
