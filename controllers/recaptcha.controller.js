//Importamos archivos y paqutes
const { request, response } = require("express");
const { errorResponse } = require("../utils/error_response.util");
const { reCAPTCHA } = require("../models/recaptcha.model");

//Creamos la clase controller
class recaptchaController {
  //Agregamos recaptcha
  static async createRecaptcha(req = request, res = response) {
    try {
      const recaptcha = await reCAPTCHA.create(req.body);
      if (recaptcha) {
        res.send({
          status: "ok",
          message: "reCAPTCHA registrado!",
          data: recaptcha,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Actualizar recaptcha
  static async updateRecaptcha(req = request, res = response) {
    try {
      const recaptcha = await reCAPTCHA.findByPk(req.params.id_recaptcha);
      if (recaptcha) {
        await recaptcha.update(req.body);
        res.send({
          status: "ok",
          message: "reCAPTCHA actualizado!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "reCAPTCHA no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Eliminar recaptcha
  static async deleteRecaptcha(req = request, res = response) {
    try {
      const recaptcha = await reCAPTCHA.findByPk(req.params.id_recaptcha);
      if (recaptcha) {
        await recaptcha.destroy();
        res.send({
          status: "ok",
          message: "reCAPTCHA eliminado!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "reCAPTCHA no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener recaptcha
  static async getRecaptcha(req = request, res = response) {
    try {
      const recaptcha = await reCAPTCHA.findAll({
        limit: 1,
        attributes: {
          exclude: ["secret_key"],
        },
      });
      if (recaptcha) {
        res.send({
          status: "ok",
          data: recaptcha,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }
}

module.exports = { recaptchaController };
