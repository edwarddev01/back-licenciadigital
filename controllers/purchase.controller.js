//Importamos archivos y paqutes
const { request, response } = require("express");
const { errorResponse } = require("../utils/error_response.util");
const { Purchase } = require("../models/purchase.model");
const { productController } = require("./product.controller");
const { Product } = require("../models/product.model");

//Creamos la clase controller
class purchaseController {
  //Agregamos una compra
  static async createPurchase(req = request, res = response) {
    try {
      if (!req.body.date) {
        req.body.date = new Date();
      }
      req.body.total_cost = req.body.cost * req.body.quantity;
      const purchase = await Purchase.create(req.body);
      if (purchase) {
        await productController.incrementStock(
          purchase.id_product,
          req.body.quantity
        );
        res.send({
          status: "ok",
          message: "Compra registrada!",
          data: purchase,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Actualizamos una compra
  static async updatePurchase(req = request, res = response) {
    try {
      const purchase = await Purchase.findByPk(req.params.id_purchase);
      if (purchase) {
        let new_stock;
        if (req.body.quantity && req.body.quantity >= purchase.quantity) {
          new_stock = req.body.quantity - purchase.quantity;
          await productController.incrementStock(
            purchase.id_product,
            new_stock
          );
        } else if (req.body.quantity && req.body.quantity < purchase.quantity) {
          new_stock = purchase.quantity - req.body.quantity;
          await productController.decrementStock(purchase.id, new_stock);
        }
        await purchase.update(req.body);
        res.send({
          status: "ok",
          message: "Compra actualizada!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Compra no encontrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Elimnar una compra
  static async deletePurchase(req = request, res = response) {
    try {
      const purchase = await Purchase.findByPk(req.params.id_purchase);
      if (purchase) {
        await productController.decrementStock(
          purchase.id_product,
          purchase.quantity
        );
        await purchase.destroy();
        res.send({
          status: "ok",
          message: "Compra eliminada!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Compra no encontrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener una compra
  static async getPurchase(req = request, res = response) {
    try {
      const purchase = await Purchase.findByPk(req.params.id_purchase,{
        include:{
          model: Product
        }
      });
      if (purchase) {
        res.send({
          status: "ok",
          data: purchase,
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Compra no encontrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener todas la compras
  static async getPurchases(req = request, res = response) {
    try {
      const purchases = await Purchase.findAll({
        order:[["date","DESC"]],
        include:{
          model: Product
        }
      });
      res.send({
        status: "ok",
        data: purchases,
      });
    } catch (error) {
      await errorResponse(res, error);
    }
  }
}

module.exports = { purchaseController };
