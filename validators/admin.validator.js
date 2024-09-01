//Importamos JOI para validar
const Joi = require("joi");

//Validador para crear admin
const createAdmin = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/)
    .min(8)
    .required(),
  type: Joi.string().min(3).lowercase().required(),
});

function validateCreateAdmin(req, res, next) {
  const { error } = createAdmin.validate(req.body);
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

//Validador para hacer Login
const adminLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  recaptchaToken: Joi.string().optional(),
});

function validateAdminLogin(req, res, next) {
  const { error } = adminLogin.validate(req.body);
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

//Actualizar administrador
const updateAdmin = Joi.object({
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/)
    .min(8)
    .optional(),
  type: Joi.string().min(3).lowercase().optional(),
});

function validateUpdateAdmin(req, res, next) {
  const { error } = updateAdmin.validate(req.body);
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

module.exports = {
  validateAdminLogin,
  validateCreateAdmin,
  validateUpdateAdmin,
};
