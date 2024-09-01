//Manejo de errores de sequelize
function converSequelizeError(error) {
  let mensajeError =
    "Ocurrió un error inesperado. Por favor, inténtelo nuevamente.";

  if (error.name === "SequelizeUniqueConstraintError") {
    mensajeError = "El valor ingresado ya existe en el sistema.";
  } else if (error.name === "SequelizeValidationError") {
    const erroresValidacion = error.errors.map((err) => err.message);
    mensajeError =
      "La información proporcionada es inválida o incompleta. Errores de validación: " +
      erroresValidacion.join(", ");
  } else if (error.name === "SequelizeForeignKeyConstraintError") {
    mensajeError =
      "No se puede realizar la operación debido a restricciones de clave externa.";
  } else if (error.name === "SequelizeDatabaseError") {
    mensajeError =
      "Error en la base de datos. Por favor, contacte al administrador del sistema.";
  } else if (error.name === "SequelizeConnectionError") {
    mensajeError =
      "Error de conexión con la base de datos. Por favor, inténtelo nuevamente más tarde.";
  } else if (error.name === "SequelizeTimeoutError") {
    mensajeError =
      "Tiempo de espera de la operación agotado. Por favor, inténtelo nuevamente.";
  } else if (error.name === "SequelizeInstanceError") {
    mensajeError =
      "Error en la instancia de Sequelize. Por favor, verifique la configuración.";
  } else if (error.name === "SequelizeHostNotReachableError") {
    mensajeError =
      "No se puede alcanzar el host de la base de datos. Verifique la conexión.";
  } else if (error.name === "SequelizeAccessDeniedError") {
    mensajeError =
      "Acceso denegado. Verifique sus credenciales de acceso a la base de datos.";
  } else if (error.name === "SequelizeInvalidConnectionError") {
    mensajeError =
      "Conexión a la base de datos inválida. Verifique la configuración de conexión.";
  } else if (error.name === "SequelizeConnectionRefusedError") {
    mensajeError =
      "Conexión a la base de datos rechazada. Verifique que la base de datos esté en funcionamiento.";
  }

  return mensajeError;
}

module.exports = { converSequelizeError };
