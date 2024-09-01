//Importamos archivos y paqutes
const { request, response } = require("express");
const { errorResponse } = require("../utils/error_response.util");
const { SaleDetails } = require("../models/sale_details.model");
const { productController } = require("./product.controller");
const { Product } = require("../models/product.model");
const { Sale } = require("../models/sale.model");

//Creamos la clase controller
class saleDetailsController {
  //Agregamos detalles de venta
  static async createSaleDetails(detalles, id_sale) {
    try {
      detalles.forEach(async (element) => {
        const saleDetail = await SaleDetails.create({
          ...element,
          id_sale: id_sale,
        });
        if (saleDetail) {
          await productController.decrementStock(
            saleDetail.id_product,
            saleDetail.quantity
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Agregamos un detalle de venta
  static async createSaleDetail(req = request, res = response) {
    try {
      console.log(req.body);
      const saleDetail = await SaleDetails.create(req.body);
      if (saleDetail) {
        await productController.decrementStock(
          saleDetail.id_product,
          saleDetail.quantity
        );
        const sale = await Sale.findByPk(saleDetail.id_sale);
        if (sale) {
          const total_price =
            sale.total_price + saleDetail.price * saleDetail.quantity;
          await sale.update({
            total_price: total_price,
          });
        }

        res.send({
          status: "ok",
          message: "Item registrado!",
          data: saleDetail,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Actualizar detalle de venta
  static async updateSaleDetail(req = request, res = response) {
    try {
      const saleDetail = await SaleDetails.findByPk(req.params.id_detail);
      if (saleDetail) {
        let new_stock;
        if (req.body.quantity && req.body.quantity >= saleDetail.quantity) {
          new_stock = req.body.quantity - saleDetail.quantity;
          await productController.decrementStock(
            saleDetail.id_product,
            new_stock
          );
        } else if (
          req.body.quantity &&
          req.body.quantity < saleDetail.quantity
        ) {
          new_stock = saleDetail - req.body.quantity;
          await productController.incrementStock(
            saleDetail.id_product,
            new_stock
          );
        }
        await saleDetail.update(req.body);
        res.send({
          status: "ok",
          massage: "Item actualizado!",
        });
      } else {
        res.status(404).send({
          status: "ok",
          message: "Item no encontrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Actualizar detalles
  static async updateSaleDetails(detalles) {
    try {
      detalles.forEach(async (element) => {
        const saleDetail = await SaleDetails.findByPk(element.id);
        if (saleDetail) {
          let new_stock;
          if (element.quantity && element.quantity >= saleDetail.quantity) {
            new_stock = element.quantity - saleDetail.quantity;
            await productController.decrementStock(
              saleDetail.id_product,
              new_stock
            );
          } else if (
            element.quantity &&
            element.quantity < saleDetail.quantity
          ) {
            new_stock = saleDetail.quantity - element.quantity;
            await productController.incrementStock(
              saleDetail.id_product,
              new_stock
            );
          }
          await saleDetail.update(element);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Eliminar detalle de venta
  static async deleteSaleDetail(req = request, res = response) {
    try {
      const saleDetail = await SaleDetails.findByPk(req.params.id_detail);
      if (saleDetail) {
        const sale = await Sale.findByPk(saleDetail.id_sale);
        if (sale) {
          const total_price =
            sale.total_price - saleDetail.price * saleDetail.quantity;
          const unpaid = total_price - sale.deposit;
          sale.update({
            total_price: total_price,
            unpaid: unpaid,
          });
        }
        await productController.incrementStock(
          saleDetail.id_product,
          saleDetail.quantity
        );
        await saleDetail.destroy();
        res.send({
          status: "ok",
          message: "Item eliminado!",
        });
      } else {
        res.status(404).send({
          status: "ok",
          message: "Item no encontrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }
  //Eliminar detalles de venta
  static async deleteSaleDetails(detalles) {
    try {
      detalles.forEach(async (element) => {
        const saleDetail = await SaleDetails.findByPk(element.id);
        if (saleDetail) {
          await productController.incrementStock(
            saleDetail.id_product,
            saleDetail.quantity
          );
          await saleDetail.destroy();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Obtener detalle de venta
  static async getSaleDetail(req = request, res = response) {
    try {
      const saleDetail = await SaleDetails.findByPk(req.params.id_detail);
      if (saleDetail) {
        res.send({
          status: "ok",
          data: saleDetail,
        });
      } else {
        res.status(404).send({
          status: "ok",
          message: "Item no encontrada!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener todos los detalles
  static async getSaleDetails(req = request, res = response) {
    try {
      const salesDetails = await SaleDetails.findAll();
      res.send({
        status: "ok",
        data: salesDetails,
      });
    } catch (error) {
      await errorResponse(res, error);
    }
  }
}

module.exports = { saleDetailsController };
