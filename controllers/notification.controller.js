//importamos archivos y paqutes
const { request, response } = require("express");
const { Op } = require("sequelize");
const { errorResponse } = require("../utils/error_response.util");
const { Notification } = require("../models/notification.model");
const { Product } = require("../models/product.model");
const { Sale } = require("../models/sale.model");
const { Client } = require("../models/client.model");

//Creamos la clase controller
class notificationController {
  //creamos las notificaciones
  static async createNotification(
    id_product,
    phone_client,
    id_client,
    id_sale,
    description
  ) {
    try {
      const notification = await Notification.findOne({
        where: {
          id_product: id_product,
          id_client: id_client,
          phone_client: phone_client,
          id_sale: id_sale,
          description: description,
          status: true,
        },
      });
      if (!notification) {
        await Notification.create({
          id_product: id_product,
          id_client: id_client,
          phone_client: phone_client,
          id_sale: id_sale,
          description: description,
          status: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Actualizamos notificacion
  static async updateNotification(req = request, res = response) {
    try {
      const notificacion = await Notification.findOne({
        where: {
          id: req.params.id_notification,
        },
      });

      if (notificacion) {
        if (notificacion.status) {
          await notificacion.update({
            status: false,
          });
          res.send({
            status: "ok",
            message: "Notificación completada!",
          });
        } else {
          await notificacion.update({
            status: true,
          });
          res.send({
            status: "ok",
            message: "Notificación reactivada!",
          });
        }
      } else {
        res.status(404).send({
          status: "error",
          message: "Notficación no encontrada!!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Eliminar notificacion
  static async deleteNotification(req = request, res = response) {
    try {
      const notificacion = await Notification.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (notificacion) {
        await notificacion.destroy();
        res.send({
          status: "ok",
          message: "Notificación eliminada!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Notficación no encontrada!!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener notificaciones
  static async getNotifications(req = request, res = response) {
    try {
      const notifications = await Notification.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.send({
        status: "ok",
        data: notifications,
      });
    } catch (error) {
      errorResponse(res, error);
    }
  }

  //Verificamos productos sin stock
  static async productsOutOfStock() {
    try {
      const products = await Product.findAll({
        where: {
          stock: 0,
        },
      });
      products.forEach((product) =>
        notificationController.createNotification(
          product.id,
          null,
          null,
          null,
          `Producto ${product.name} sin stock`
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  //Clientes con deudas
  static async clientsWithSalesToPay() {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0); // Establece el inicio del día
      const endOfDay = new Date(sevenDaysAgo);
      endOfDay.setHours(23, 59, 59, 999); // Establece el fin del día

      const sales = await Sale.findAll({
        where: {
          date: {
            [Op.gte]: sevenDaysAgo,
            [Op.lt]: endOfDay,
          },
          payment_status: "pendiente",
          status: "entregado",
        },
      });

      sales.forEach(async (sale) => {
        let infoClient;
        if (sale.id_client) {
          const client = await Client.findOne({
            where: {
              id: sale.id_client,
            },
          });
          infoClient = client.name;
        } else {
          infoClient = sale.phone_client;
        }
        notificationController.createNotification(
          null,
          sale.phone_client,
          sale.id_client,
          sale.id,
          `Pago pendiente por el cliente: ${infoClient} - referencia de venta: LC${sale.id}`
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { notificationController };
