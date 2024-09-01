//Importamos archivos y paqutes
const { request, response } = require("express");
const { errorResponse } = require("../utils/error_response.util");
const { Product } = require("../models/product.model");
const { SaleDetails } = require("../models/sale_details.model");
const { Purchase } = require("../models/purchase.model");

//Creamos la clase controller
class productController {
  //Agregamos un producto
  static async createProduct(req = request, res = response) {
    try {
      req.body.image = req.file ? req.file.filename : null;
      const product = await Product.create(req.body);
      if (product) {
        res.send({
          status: "ok",
          message: "Producto registrado!",
          data: product,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Actualizar producto
  static async updateProduct(req = request, res = response) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id_product,
        },
      });
      if (product) {
        if (req.body.image || req.file) {
          req.body.image = req.file ? req.file.filename : null;
        }
        await product.update(req.body);
        res.send({
          status: "ok",
          message: "Producto actualizado!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Producto no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Eliminar producto
  static async deleteProduct(req = request, res = response) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id_product,
        },
        include: {
          model: SaleDetails,
        },
      });
      if (product) {
        if (product.sales_details.length > 0) {
          return res.status(409).send({
            status: "error",
            message: "No se puede eliminar un producto asociado a ventas!",
          });
        }
        await product.destroy();
        res.send({
          status: "ok",
          message: "Producto eliminado!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Producto no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtner un producto
  static async getProduct(req = request, res = response) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id_product,
        },
      });
      if (product) {
        res.send({
          status: "ok",
          data: product,
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Producto no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }
  static async getProductDetails(req = request, res = response) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id_product,
        },
        include: [
          {
            model: SaleDetails,
          },
          {
            model: Purchase,
          },
        ],
      });
      if (product) {
        const total_sold = product.sales_details.reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity, 0);
        const total_purchased = product.purchases.reduce((accumulator, currentValue) => accumulator + currentValue.total_cost, 0);
        const n_sales = product.sales_details.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0);
        const n_purchases = product.purchases.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0);
        res.send({
          status: "ok",
          data: { ...product.toJSON(), total_sold, total_purchased, n_sales, n_purchases },
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Producto no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener todos los productos
  static async getProducts(req = request, res = response) {
    try {
      const products = await Product.findAll();
      res.send({
        status: "ok",
        data: products,
      });
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Incrementar stock
  static async incrementStock(id_product, increment) {
    try {
      const product = await Product.findByPk(id_product);
      if (product) {
        product.stock += increment;
        await this.incrementOffice365(product.id, increment);
        await product.save();
      }
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  //Incrementar stock
  static async decrementStock(id_product, decrement) {
    try {
      const product = await Product.findByPk(id_product);
      if (product) {
        if (product.stock >= decrement) {
          await this.decrementOffice365(product.id, product.stock, decrement);
          product.stock -= decrement;
          await product.save();
        } else {
          product.stock = 0;
          await product.save();
        }
      }

      return product;
    } catch (error) {
      console.log(error);
    }
  }

  //Si el producto es Office 365 Family o Office 365 Personal
  static async incrementOffice365(productId, quantity) {
    const product = await Product.findByPk(productId);
    if (product) {
      if (product.name === "Office 365 Family") {
        const personalProduct = await Product.findOne({
          where: { name: "Office 365 Personal" },
        });
        if (personalProduct) {
          personalProduct.stock += 5 * quantity;
          await personalProduct.save();
        }
      } else if (product.name === "Office 365 Personal") {
        const familyProduct = await Product.findOne({
          where: { name: "Office 365 Family" },
        });
        if (familyProduct) {
          familyProduct.stock += quantity;
          await familyProduct.save();
        }
      }
      product.stock += quantity;
      await product.save();
    }
  }
  static async decrementOffice365(productId, quantity, decrement) {
    const product = await Product.findByPk(productId);
    if (product) {
      if (product.name === "Office 365 Family") {
        const personalProduct = await Product.findOne({
          where: { name: "Office 365 Personal" },
        });
        if (personalProduct) {
          personalProduct.stock -= 5 * decrement;
          await personalProduct.save();
        }
      } else if (product.name === "Office 365 Personal") {
        const familyProduct = await Product.findOne({
          where: { name: "Office 365 Family" },
        });
        if (familyProduct) {
          familyProduct.stock -= Math.floor(
            (familyProduct.stock / quantity) * 5
          );
          await familyProduct.save();
        }
      }
      // product.stock -= quantity;
      // await product.save();
    }
  }
}

module.exports = { productController };
