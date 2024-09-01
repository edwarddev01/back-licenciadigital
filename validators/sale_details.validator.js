const Joi = require("joi");

// Validador para crear detalles de venta
const createSaleDetails = Joi.object({
  id_sale: Joi.number().integer().positive().optional(),
  price: Joi.number().positive().required(),
  id_product: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
  description: Joi.string().optional(),
  expires: Joi.boolean().required(),
  expiration_date: Joi.date().optional(),
});

// Validador para actualizar detalles de venta
const updateSaleDetails = Joi.object({
  id_sale: Joi.number().integer().positive().optional(),
  price: Joi.number().positive().optional(),
  id_product: Joi.number().integer().positive().optional(),
  quantity: Joi.number().integer().min(1).optional(),
  description: Joi.string().optional().allow(null),
  expires: Joi.boolean().optional(),
  expiration_date: Joi.date().optional().allow(null),
});

function validateCreateSaleDetails(req, res, next) {
  const { error } = createSaleDetails.validate(req.body);
  if (error) {
    res.status(400).send({
      status: "error",
      message:
        "Formato o contenido inválido, verifique los parámetros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

function validateUpdateSaleDetails(req, res, next) {
  const { error } = updateSaleDetails.validate(req.body);
  
  if (error) {
    res.status(400).send({
      status: "error",
      message:
        "Formato o contenido inválido, verifique los parámetros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

module.exports = {
  validateCreateSaleDetails,
  validateUpdateSaleDetails,
};
