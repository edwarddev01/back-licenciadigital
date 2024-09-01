//Importamos archivos y paqutes
const { request, response } = require("express");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { errorResponse } = require("../utils/error_response.util");
const { Admin } = require("../models/admin.model");
const { hashPassword, validatePassword } = require("../utils/password.util");
const { createTokenLogin } = require("../utils/token.util");
const { Sale } = require("../models/sale.model");

//Creamos la clase controller
class adminController {
  //Agregamos un administrador
  static async createAdmin(req = request, res = response) {
    try {
      req.body.password = await hashPassword(req.body.password);
      const admin = await Admin.create(req.body);
      if (admin) {
        admin.password = undefined;
        admin.secret = undefined;
        res.send({
          status: "ok",
          message: "Usuario creado!",
          data: admin,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Actualizar administrador
  static async updateAdmin(req = request, res = response) {
    try {
      const admin = await Admin.findOne({
        where: {
          id: req.params.id_admin,
        },
      });
      if (admin) {
        if (req.body.password) {
          req.body.password = await hashPassword(req.body.password);
        }
        await admin.update(req.body);
        res.send({
          status: "ok",
          message: "Usuario actualizado!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Usuario no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Eliminar administrador
  static async deleteAdmin(req = request, res = response) {
    try {
      const admin = await Admin.findOne({
        where: {
          id: req.params.id_admin,
        },
      });
      if (admin) {
        await admin.destroy();
        res.send({
          status: "ok",
          message: "Usuario eliminado!",
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "Usuario no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Funcion del inicio de sesión
  static async loginAdmin(req = request, res = response) {
    try {
      const admin = await Admin.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (admin) {
        const isValid = await validatePassword(req.body.password, admin.password);
        if (isValid) {
          admin.password = undefined;
          const token = await createTokenLogin(admin.toJSON());
          res.setHeader("Authorization", `Bearer ${token}`);
          if (admin.secret) {
            res.send({
              status: "ok",
              twoFactor: true,
              message: "Hay que verificar el doble factor!",
            });
          } else {
            res.send({
              status: "ok",
              message: `Bienvenido ${admin.name.split(" ")[0]}!`,
            });
          }
        } else {
          res.status(401).send({
            status: "unauthorized",
            message: "Contraseña incorrecta!",
          });
        }
      } else {
        res.status(401).send({
          status: "unauthorized",
          message: "Usuario no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Validamos segundo factor
  static async validateTwoFactor(req = request, res = response) {
    try {
      const admin = await Admin.findOne({
        where: {
          email: req.user.email,
        },
      });
      if (admin) {
        const validateToken = speakeasy.totp.verify({
          secret: admin.secret,
          encoding: "base32",
          token: req.body.token,
        });
        if (validateToken) {
          if (req.body.test) {
            return res.send({
              status: "ok",
              message: "Validación exitosa!",
            });
          }
          res.send({
            status: "ok",
            message: `Bienvenido ${admin.name.split(" ")[0]}!`,
          });
        } else {
          res.status(401).send({
            status: "unauthorized",
            message: "Verficación de doble factor invalida!!",
          });
        }
      } else {
        res.status(401).send({
          status: "unauthorized",
          message: "Usuario no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Registrar el doble factor
  static async registerTwoFactor(req = request, res = response) {
    try {
      const admin = await Admin.findOne({
        where: {
          email: req.user.email,
        },
      });
      if (admin && !req.body.secret) {
        const secret = speakeasy.generateSecret({
          name: `CMR Licencia Digital: ${admin.email}`,
        });
        const dataUrl = await new Promise((resolve, reject) => {
          QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
            if (err || !dataUrl) {
              reject(err);
            } else {
              resolve(dataUrl);
            }
          });
        });
        res.send({ qrCode: dataUrl, secret: secret });
      } else if (admin && req.body.secret) {
        await admin.update({
          secret: req.body.secret.base32,
        });
        res.send({
          status: "ok",
          message: "Doble factor registrado!",
        });
      } else {
        res.status(401).send({
          status: "unauthorized",
          message: "Usuario no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Desactivar el doble factor
  static async disableTwoFactor(req = request, res = response) {
    try {
      const admin = await Admin.findOne({
        where: {
          email: req.user.email,
        },
      });
      if (admin && admin.secret) {
        await admin.update({
          secret: null,
        });
        res.send({
          status: "ok",
          message: "Doble factor desactivado!",
        });
      } else {
        res.status(401).send({
          status: "unauthorized",
          message: "Usuario no encontrado!",
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener administrador y sus ventas registradas - solo por usuario type = admin
  static async getAdminAndSales(req = request, res = response) {
    try {
      const admin = await Admin.findOne({
        where: {
          id: req.params.id_admin,
        },
        include: {
          model: Sale,
        },
        attributes: {
          exclude: ["password", "secret"],
        },
      });
      if (admin) {
        res.send({
          status: "ok",
          data: admin,
        });
      } else {
        res.status(404).send({
          status: "error",
          message: `Usuario con id: ${req.params.id_admin} no encontrado!!`,
        });
      }
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  //Obtener todos los administradores
  static async getAdmins(req = request, res = response) {
    try {
      const admins = await Admin.findAll({
        attributes: {
          exclude: ["password", "secret"],
        },
      });
      res.send({
        status: "ok",
        data: admins,
      });
    } catch (error) {
      await errorResponse(res, error);
    }
  }

  static async getAdmin(req = request, res = response){
    try {
      const admin = await Admin.findOne({
        where:{
          id:req.user.id
        },
        attributes: {
          exclude: ["password", "secret"],
        },
      });
      res.send({
        status: "ok",
        data: admin,
      });
    } catch (error) {
      await errorResponse(res, error);
    }
  }
}

module.exports = { adminController };
