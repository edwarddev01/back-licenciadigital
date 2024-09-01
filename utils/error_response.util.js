//Importamos archivos o paquetes
const { converSequelizeError } = require("./sequelize_errors.util");

//Manejamos los errores
async function errorResponse(res, error) {
  console.log(error);
  let message = error.message;
  if (error instanceof Error) {
    message = converSequelizeError(error);
  }
  res.status(500).send({
    status: "error",
    message: message,
  });
}

module.exports = { errorResponse };
