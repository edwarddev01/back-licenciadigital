// Importamos paquetes y archivos
const { Router } = require("express");
const { validateToken } = require("../utils/token.util");
const { recaptchaController } = require("../controllers/recaptcha.controller");
const { validateCreateReCAPTCHA, validateUpdateReCAPTCHA } = require("../validators/recaptcha.validators");

// Creamos el enrutador
const recaptchaRouter = Router();

//Definimos las rutas
recaptchaRouter.post("/recaptcha", [validateToken, validateCreateReCAPTCHA], recaptchaController.createRecaptcha);
recaptchaRouter.put("/recaptcha/:id_recaptcha/update", [validateToken, validateUpdateReCAPTCHA], recaptchaController.updateRecaptcha);
recaptchaRouter.delete("/recaptcha/:id_recaptcha/delete", [validateToken], recaptchaController.deleteRecaptcha);
recaptchaRouter.get("/recaptcha/list", recaptchaController.getRecaptcha);

module.exports = { recaptchaRouter };