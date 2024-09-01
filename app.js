//Importamos librerias
const express = require("express");
const path = require('path');
const cron = require("node-cron");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
config();

// Importamos archivos de conexion a la base datos
const { connection } = require("./database/connection.database");
const { creatingRelations } = require("./database/relations.database");

// Importamos rutas
const { adminRouter } = require("./routes/admin.route");
const { clientRouter } = require("./routes/client.route");
const { notificationRouter } = require("./routes/notification.route");
const { productRouter } = require("./routes/product.route");
const { purchaseRouter } = require("./routes/purchase.route");
const { recaptchaRouter } = require("./routes/recaptcha.route");
const { saleDetailsRouter } = require("./routes/sale_details.route");
const { saleRouter } = require("./routes/sale.route");
const { dashboardRouter } = require("./routes/dashboard.route");

//Importamos y ejecutamos crono
// 0 0 * * * - Todos los días a medianoche
// */5 * * * * - Cada 5 minutos
const {
  notificationController,
} = require("./controllers/notification.controller");
cron.schedule("0 0 * * *", async () => {
  console.log("Ejecutando crono 12:AM");
  await notificationController.clientsWithSalesToPay();
});

// Inicializamos express
const app = express();
app.set("trust proxy", true);

// Configuramos middlewares
app.use(cors({ origin: "*", exposedHeaders: ["Authorization"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("short"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuracion de rutas
app.use("/api/v1", adminRouter);
app.use("/api/v1", clientRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", purchaseRouter);
app.use("/api/v1", recaptchaRouter);
app.use("/api/v1", saleDetailsRouter);
app.use("/api/v1", saleRouter);
app.use("/api/v1", dashboardRouter);

// Inicializamos el servidor y la conexion a la base de datos
const port = process.env.PORT || 3300;
app.listen(port, async () => {
  try {
    console.log(`Servidor inicializado en el puerto: ${port}`);
    console.log(`Conectando a la base de datos...`);
    await connection.sync({ alter: true });
    await creatingRelations();
    console.log("Conexion exitosa.");
  } catch (error) {
    console.log(`Error al iniciar el servidor: ${error}`);
  }
});
