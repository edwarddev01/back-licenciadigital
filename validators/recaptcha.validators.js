const Joi = require("joi");

// Validador para crear reCAPTCHA
const createReCAPTCHA = Joi.object({
  site_key: Joi.string().required(),
  secret_key: Joi.string().required(),
  status: Joi.boolean().optional().default(true),
});

// Validador para actualizar reCAPTCHA
const updateReCAPTCHA = Joi.object({
  site_key: Joi.string().optional(),
  secret_key: Joi.string().optional(),
  status: Joi.boolean().optional(),
});

function validateCreateReCAPTCHA(req, res, next) {
  const { error } = createReCAPTCHA.validate(req.body);
  if (error) {
    res.status(400).send({
      status: "error",
      message: "Formato o contenido inválido, verifique los parámetros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

function validateUpdateReCAPTCHA(req, res, next) {
  const { error } = updateReCAPTCHA.validate(req.body);
  if (error) {
    res.status(400).send({
      status: "error",
      message: "Formato o contenido inválido, verifique los parámetros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

module.exports = {
  validateCreateReCAPTCHA,
  validateUpdateReCAPTCHA,
};
