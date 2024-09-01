// Importamos paquetes y archivos
const { Router } = require("express");
const { validateToken } = require("../utils/token.util");
const { saleController } = require("../controllers/sale.controller");
const { validateCreateSale, validateUpdateSale } = require("../validators/sale.validator");

// Creamos el enrutador
const saleRouter = Router();

//Definimos las rutas
saleRouter.post("/sale", [validateToken, validateCreateSale], saleController.createSale);
saleRouter.put("/sale/:id_sale/update", [validateToken, validateUpdateSale], saleController.updateSale);
saleRouter.put("/sale/:id_sale/complete", [validateToken, validateUpdateSale], saleController.completeSale);
saleRouter.delete("/sale/:id_sale/delete", [validateToken], saleController.deleteSale);
saleRouter.get("/sale/:id_sale/get", [validateToken], saleController.getSale);
saleRouter.get("/sale/list", [validateToken], saleController.getSales);

module.exports = { saleRouter };