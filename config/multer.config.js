const multer = require("multer");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()
    cb(null, `${Date.now()}.${ext}`);
  },
});

// Configuración de multer
const upload = multer({
  storage: storage
});

module.exports = { upload };
