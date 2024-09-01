//Importamos JOI para validar
const Joi = require("joi");

//Validar para crae client
const createClient = Joi.object({
  name: Joi.string().min(3).required(),
  phone: Joi.string().min(10).required(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/)
    .min(8)
    .optional(),
  balance: Joi.number().min(0).optional(),
  type: Joi.string().lowercase().optional(),
});

function validateCreateClient(req, res, next) {
  const { error } = createClient.validate(req.body);
  if (error) {
    res.status(400).send({
      status: "error",
      message:
        "Formtato o contenido invalido, verifique los parametros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

// Validar para actualizar cliente
const updateClient = Joi.object({
  name: Joi.string().min(3).optional(),
  phone: Joi.string().min(10).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/)
    .min(8)
    .optional(),
  balance: Joi.number().min(0).optional(),
  type: Joi.string().lowercase().optional(),
});

function validateUpdateClient(req, res, next) {
  const { error } = updateClient.validate(req.body);
  if (error) {
    res.status(400).send({
      status: "error",
      message:
        "Formato o contenido invalido, verifique los parametros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

module.exports = {
  validateCreateClient,
  validateUpdateClient,
};
