// Importamos paquetes y archivos
const { Router } = require("express");
const { validateToken } = require("../utils/token.util");
const { purchaseController } = require("../controllers/purchase.controller");
const { validateCreatePurchase, validateUpdatePurchase } = require("../validators/purchase.validator");

// Creamos el enrutador
const purchaseRouter = Router();

//Definimos las rutas
purchaseRouter.post("/purchase", [validateToken, validateCreatePurchase], purchaseController.createPurchase);
purchaseRouter.put("/purchase/:id_purchase/update", [validateToken, validateUpdatePurchase], purchaseController.updatePurchase);
purchaseRouter.delete("/purchase/:id_purchase/delete", [validateToken], purchaseController.deletePurchase);
purchaseRouter.get("/purchase/:id_purchase/get", [validateToken], purchaseController.getPurchase);
purchaseRouter.get("/purchase/list", [validateToken], purchaseController.getPurchases);


module.exports = { purchaseRouter }