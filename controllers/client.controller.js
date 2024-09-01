//importamos archivos y paqutes
const { request, response } = require("express");
const { errorResponse } = require("../utils/error_response.util");
const { hashPassword } = require("../utils/password.util");
const { Client } = require("../models/client.model");
const { Sale } = require("../models/sale.model");

//Creamos la clase controller
class clientController {
  //Agregamos un nuevo cliente
  static async createClient(req = request, res = response) {
    try {
      if (req.body.password) {
        req.body.password = await hashPassword(req.body.password);
      }
      const client = await Client.create(req.body);
      if (client) {
        client.password = undefined;
        res.send({
          status: "ok",
          message: "Cliente creado!",
          data: client,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Actualizar cliente
  static async updateClient(req = request, res = response) {
    try {
      const client = await Client.findOne({
        where: {
          id: req.params.id_client,
        },
      });
      if (client) {
        if (req.body.password) {
          req.body.password = hashPassword(req.body.password);
        }
        await client.update(req.body);
        res.send({
          status: "ok",
          message: "Cliente actualizado!",
        });
      } else {
        res.status(404).send({
          status: "ok",
          message: "Cliente no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Eliminar cliente
  static async deleteClient(req = request, res = response) {
    try {
      const client = await Client.findOne({
        where: {
          id: req.params.id_client,
        },
        include: {
          model: Sale,
        },
      });
      if (client) {
        if (client.sales.length <= 0) {
          await client.destroy();
          res.send({
            status: "ok",
            message: "Cliente eliminado!",
          });
        }else{
          res.status(409).send({
            status: "error",
            message: "No podemos eliminar cliente con ventas asociadas!",
          });
        }
      } else {
        res.status(404).send({
          status: "error",
          message: "Cliente no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener cliente y sus compras
  static async getClient(req = request, res = response) {
    try {
      const client = await Client.findOne({
        where: {
          id: req.params.id_client,
        },
        include: {
          model: Sale,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      if (client) {
        res.send({
          status: "ok",
          data: client,
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Cliente no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener todos los clientes
  static async getClients(req = request, res = response) {
    try {
      const clients = await Client.findAll({
        attributes: {
          exclude: ["password"],
        },
      });
      res.send({
        status: "ok",
        data: clients,
      });
    } catch (error) {
      await errorResponse(res, error);
    }
  }
}

module.exports = { clientController };
