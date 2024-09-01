// Importamos paquetes y archivos
const { Router } = require("express");
const { validateToken, isUserAdmin } = require("../utils/token.util");
const { verifyRecaptchaToken } = require("../utils/recaptcha.util");
const { adminController } = require("../controllers/admin.controller");
const { validateCreateAdmin, validateAdminLogin, validateUpdateAdmin } = require("../validators/admin.validator");

// Creamos el enrutador
const adminRouter = Router();

// Definimos las rutas
adminRouter.post("/admin", [validateCreateAdmin], adminController.createAdmin);
adminRouter.post("/admin/login", [validateAdminLogin], adminController.loginAdmin);
adminRouter.put("/admin/:id_admin/update", [validateToken, validateUpdateAdmin, isUserAdmin], adminController.updateAdmin);
adminRouter.delete("/admin/:id_admin/delete", [validateToken, isUserAdmin], adminController.deleteAdmin);
adminRouter.get("/admin/:id_admin/get", [validateToken, isUserAdmin], adminController.getAdminAndSales);
adminRouter.get("/admin/list", [validateToken, isUserAdmin], adminController.getAdmins);
adminRouter.get("/admin/get", [validateToken], adminController.getAdmin);
//Doble factor
adminRouter.post("/admin/:id_admin/two-factor", [validateToken], adminController.registerTwoFactor);
adminRouter.post("/admin/:id_admin/two-factor/validate", [validateToken], adminController.validateTwoFactor);
adminRouter.put("/admin/:id_admin/two-factor/disable", [validateToken], adminController.disableTwoFactor);


module.exports = { adminRouter }
