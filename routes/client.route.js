// Importamos paquetes y archivos
const { Router } = require("express");
const { validateToken } = require("../utils/token.util");
const { clientController } = require("../controllers/client.controller");
const { validateCreateClient, validateUpdateClient } = require("../validators/client.validator");

//Creamos el enrutador
const clientRouter = Router();

//Definimos la rutas
clientRouter.post("/client", [validateToken, validateCreateClient], clientController.createClient);
clientRouter.put("/client/:id_client/update", [validateToken, validateUpdateClient], clientController.updateClient);
clientRouter.delete("/client/:id_client/delete", [validateToken], clientController.deleteClient);
clientRouter.get("/client/:id_client/get", [validateToken], clientController.getClient);
clientRouter.get("/client/list", [validateToken], clientController.getClients);


module.exports = { clientRouter };
