const Jwt = require("jsonwebtoken");
const { request, response } = require("express");

function createTokenLogin(data) {
  try {
    return Jwt.sign(data, process.env.SECRET || "secret_key", {
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("Error al crear el token:", error);
  }
}

function validateToken(req = request, res = response, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).send({
        status: "unauthorized",
        message: "Se requiere autenticación. Falta el token en el encabezado.",
      });
    }
    const token = authorization.replace("Bearer ", "");
    const decodedToken = Jwt.verify(token, process.env.SECRET || "secret_key");
    if (decodedToken) {
      const userData = {
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        twoFactor: decodedToken.secret ? true : false,
        admin: decodedToken.type == 'admin' ? true : false
      };
      req.user = userData;
      next();
    } else {
      res.status(401).send({
        status: "unauthorized",
        message: "Autenticación requerida",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: "unauthorized",
      message: "Error al validar la autenticación " + error.message,
    });
  }
}

async function isUserAdmin(req, res, next) {
  try {
    if (!req.user.admin) {
      res.status(403).send({
        status: "error",
        message: "Acceso denegado",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Error al procesar la solicitud",
    });
  }
}

module.exports = {
  createTokenLogin,
  isUserAdmin,
  validateToken
};
