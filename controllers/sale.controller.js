//Importamos archivos y paqutes
const { request, response } = require("express");
const { errorResponse } = require("../utils/error_response.util");
const { Sale } = require("../models/sale.model");
const { saleDetailsController } = require("./sale_details.controller");
const { SaleDetails } = require("../models/sale_details.model");
const { Client } = require("../models/client.model");
const { Product } = require("../models/product.model");

//Creamos la clase de controller
class saleController {
  //Agregamos venta
  static async createSale(req = request, res = response) {
    try {
      if (!req.body.date) {
        req.body.date = new Date();
      }
      const sale = await Sale.create({ ...req.body, id_admin: req.user.id });
      if (sale) {
        await saleDetailsController.createSaleDetails(
          req.body.saleDetails,
          sale.id
        );
        res.send({
          status: "ok",
          message: "Venta registrada!",
          data: sale,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Actualizar venta
  static async updateSale(req = request, res = response) {
    try {
      const sale = await Sale.findByPk(req.params.id_sale);
      if (sale) {
        //await saleDetailsController.updateSaleDetails(req.body.saleDetails);
        await sale.update(req.body);
        res.send({
          status: "ok",
          message: "Venta de actualizado!",
        });
      } else {
        res.status(404).send({
          status: "ok",
          message: "Venta no econtrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  static async completeSale(req = request, res = response) {
    try {
      const sale = await Sale.findByPk(req.params.id_sale);
      if (sale) {
        if (req.body.payment_status == 'completado' && req.body.status == 'completado') {
          req.body.deposit = sale.total_price;
          req.body.unpaid = 0;
        }
        await sale.update(req.body);
        res.send({
          status: "ok",
          message: "Venta de actualizado!",
        });
      } else {
        res.status(404).send({
          status: "ok",
          message: "Venta no econtrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Eliminar venta
  static async deleteSale(req = request, res = response) {
    try {
      const sale = await Sale.findOne({
        where: {
          id: req.params.id_sale,
        },
        include: {
          model: SaleDetails,
        },
      });
      if (sale) {
        await saleDetailsController.deleteSaleDetails(sale.sales_details);
        await sale.destroy();
        res.send({
          status: "ok",
          message: "Venta eliminada!",
        });
      } else {
        res.status(404).send({
          status: "ok",
          message: "Venta no econtrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener una venta
  static async getSale(req = request, res = response) {
    try {
      const sale = await Sale.findOne({
        where: {
          id: req.params.id_sale,
        },
        include: [
          {
            model: SaleDetails,
            include:{
              model: Product
            }
          },{
            model:Client
          }
        ]
       ,
      });
      if (sale) {
        res.send({
          status: "ok",
          data: sale,
        });
      } else {
        res.status(404).send({
          status: "ok",
          message: "Venta no econtrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener todas la ventas
  static async getSales(req = request, res = response) {
    try {
      const sales = await Sale.findAll({
        include:{
          model:Client,
          attributes:{
            exclude:['password']
          }
        },
        order:[["date","DESC"]]
      });
      res.send({
        status: "ok",
        data: sales,
      });
    } catch (error) {
      await errorResponse(res, error);
    }
  }
}

module.exports = { saleController };
