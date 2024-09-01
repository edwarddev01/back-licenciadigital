// Importamos paquetes y archivos
const { Router } = require("express");
const { validateToken } = require("../utils/token.util");
const { notificationController } = require("../controllers/notification.controller");

//Creamos enrutador
const notificationRouter = Router();

//Definimos las rutas
notificationRouter.get("/notification/list", [validateToken], notificationController.getNotifications);
notificationRouter.put("/notification/:id_notification/update", [validateToken], notificationController.getNotifications);
notificationRouter.delete("/notification/:id_notification/delete", [validateToken], notificationController.getNotifications);


module.exports = { notificationRouter };
