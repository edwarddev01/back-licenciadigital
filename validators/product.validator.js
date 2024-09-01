const Joi = require("joi");

// Validador para crear producto
const createProduct = Joi.object({
  name: Joi.string().min(1).required(),
  normal_price: Joi.number().positive().required(),
  resseller_price: Joi.number().positive().required(),
  image: Joi.optional(),
  stock: Joi.number().integer().min(0).optional().default(0),
});

// Validador para actualizar producto
const updateProduct = Joi.object({
  name: Joi.string().min(1).optional(),
  normal_price: Joi.number().positive().optional(),
  resseller_price: Joi.number().positive().optional(),
  image: Joi.string().optional(),
  stock: Joi.number().integer().min(0).optional(),
});

function validateCreateProduct(req, res, next) {
  const { error } = createProduct.validate(req.body);
  if (error) {
    res.status(400).send({
      status: "error",
      message: "Formato o contenido invalido, verifique los parametros y vuelva a intentar!",
    });
  } else {
    next();
  }
}

function validateUpdateProduct(req, res, next) {
  const { error } = updateProduct.validate(req.body);
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
  validateCreateProduct,
  validateUpdateProduct,
};
