const { request, response } = require("express");
const { reCAPTCHA } = require("../models/recaptcha.model");

async function verifyRecaptchaToken(req = request, res = response, next) {
  try {
    const recaptcha = await reCAPTCHA.findOne({
      where: {
        site_key: req.body.site_key,
      },
    });

    if (recaptcha && recaptcha.status) {
      if (!req.body.recaptchaToken) {
        return res
          .status(400)
          .send({ status: "error", message: "reCAPTCHA: falta el token." });
      }
      const secretKey = recaptcha.secret_key;
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.recaptchaToken}`;

      const fetchResponse = await fetch(url, {
        method: "POST",
      });
      const data = await fetchResponse.json();

      if (!data.success) {
        return res.status(400).send({
          status: "error",
          message: "reCAPTCHA: Fallo en la verificación.",
        });
      }
    } else if (recaptcha.status) {
      return res.status(400).send({
        status: "error",
        message: "reCAPTCHA: Fallo en la verificación.",
      });
    }
    next();
  } catch (error) {
    console.error("Error verificando reCAPTCHA:", error);
    return res
      .status(500)
      .send({ status: "error", message: "Internal server error" });
  }
}

module.exports = { verifyRecaptchaToken };
