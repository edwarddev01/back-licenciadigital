const Joi = require("joi");

// Validador para detalles de venta
const saleDetailSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  id_product: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
  description: Joi.string().optional().allow(null),
  expires: Joi.boolean().required(),
  expiration_date: Joi.date().optional().allow(null),
});

// Validador para crear venta
const createSale = Joi.object({
  date: Joi.date().optional(),
  total_price: Joi.number().positive().required().default(0),
  id_client: Joi.number().integer().positive().optional().allow(null),
  phone_client: Joi.string().optional().allow(null),
  status: Joi.string()
    .valid("pendiente", "completado", "entregado")
    .optional()
    .default("pendiente"),
  payment_status: Joi.string()
    .valid("pendiente", "completado", "abonado")
    .optional()
    .default("pendiente"),
  deposit: Joi.number().optional().default(0),
  unpaid: Joi.number().optional().default(0),
  saleDetails: Joi.array().items(saleDetailSchema).required(),
});

// Validador para actualizar venta
const updateSale = Joi.object({
  date: Joi.date().optional(),
  total_price: Joi.number().positive().optional(),
  id_client: Joi.number().integer().positive().optional().allow(null),
  phone_client: Joi.string().optional().allow(null),
  status: Joi.string().valid("pendiente", "completado", "entregado").optional(),
  payment_status: Joi.string()
    .valid("pendiente", "completado", "abonado")
    .optional(),
  deposit: Joi.number().positive().optional().allow(0),
  unpaid: Joi.number().positive().optional().allow(0),
  saleDetails: Joi.array().items(saleDetailSchema).optional(),
});

function validateCreateSale(req, res, next) {
  const { error } = createSale.validate(req.body);
  if (error) {
    console.log(error)
    res.status(400).send({
      status: "error",
      message:
        "Formato o contenido inválido, verifique los parámetros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

function validateUpdateSale(req, res, next) {
  const { error } = updateSale.validate(req.body);
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
  validateCreateSale,
  validateUpdateSale,
};
