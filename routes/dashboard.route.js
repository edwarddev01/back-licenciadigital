// Importamos paquetes y archivos
const { Router } = require("express");
const { validateToken } = require("../utils/token.util");
const { DashboardController } = require("../controllers/dashboard.controller");

//Creamos enrutador
const dashboardRouter = Router();

//Definimos las rutas
dashboardRouter.get('/dashboard/current',[validateToken], DashboardController.getCurrentMonthData)
dashboardRouter.get('/dashboard/last-three',[validateToken], DashboardController.getLastThreeMonthsData)
dashboardRouter.get('/dashboard/last-six',[validateToken], DashboardController.getLastSixMonthsData)

module.exports = { dashboardRouter }