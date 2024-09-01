const Joi = require("joi");

// Validador para crear compra
const createPurchase = Joi.object({
  date: Joi.date().optional(),
  cost: Joi.number().positive().required().default(0),
  id_product: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).required().default(1),
  total_cost: Joi.number().positive().optional().default(0),
  payment_status: Joi.string().valid("pendiente", "completado",).optional().default("pendiente"),
});

// Validador para actualizar compra
const updatePurchase = Joi.object({
  date: Joi.date().optional(),
  cost: Joi.number().positive().optional(),
  id_product: Joi.number().integer().positive().optional(),
  quantity: Joi.number().integer().min(1).optional(),
  total_cost: Joi.number().positive().optional(),
  payment_status: Joi.string().valid("pendiente", "completado").optional(),
});

function validateCreatePurchase(req, res, next) {
  const { error } = createPurchase.validate(req.body);
  if (error) {
    res.status(400).send({
      status: "error",
      message: "Formato o contenido invalido, verifique los parametros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

function validateUpdatePurchase(req, res, next) {
  const { error } = updatePurchase.validate(req.body);
  if (error) {
    res.status(400).send({
      status: "error",
      message: "Formato o contenido invalido, verifique los parametros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

module.exports = {
  validateCreatePurchase,
  validateUpdatePurchase,
};
