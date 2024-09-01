// Importamos paquetes y archivos
const { Router } = require("express");
const { validateToken } = require("../utils/token.util");
const { saleDetailsController } = require("../controllers/sale_details.controller");
const { validateCreateSaleDetails, validateUpdateSaleDetails } = require("../validators/sale_details.validator");

// Creamos el enrutador
const saleDetailsRouter = Router();

//Definimos las rutas
saleDetailsRouter.post("/sale-detail", [validateToken, validateCreateSaleDetails], saleDetailsController.createSaleDetail);
saleDetailsRouter.put("/sale-detail/:id_detail/update", [validateToken, validateUpdateSaleDetails], saleDetailsController.updateSaleDetail);
saleDetailsRouter.delete("/sale-detail/:id_detail/delete", [validateToken], saleDetailsController.deleteSaleDetail);
saleDetailsRouter.get("/sale-detail/:id_detail/get", [validateToken], saleDetailsController.getSaleDetail);
saleDetailsRouter.get("/sale-detail/list", [validateToken], saleDetailsController.getSaleDetails);

module.exports = { saleDetailsRouter };