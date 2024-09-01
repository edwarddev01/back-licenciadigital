const { Router } = require("express");
const { validateToken } = require("../utils/token.util");
const { productController } = require("../controllers/product.controller");
const { validateCreateProduct, validateUpdateProduct } = require("../validators/product.validator");
const { upload } = require("../config/multer.config");


// Creamos el enrutador
const productRouter = Router();

// Definimos las rutas
productRouter.post("/product", [validateToken, upload.single('image')], productController.createProduct);
productRouter.put("/product/:id_product/update", [validateToken, upload.single('image')], productController.updateProduct);
productRouter.delete("/product/:id_product/delete", [validateToken], productController.deleteProduct);
productRouter.get("/product/:id_product/get", [validateToken], productController.getProduct);
productRouter.get("/product/:id_product/details", [validateToken], productController.getProductDetails);
productRouter.get("/product/list", [validateToken], productController.getProducts);

module.exports = { productRouter };
