const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 2929;

// ==================
// Middlewares
// ==================
app.use(cors());
app.use(express.json());

// ==================
// Archivos estáticos (CSS, JS, imágenes)
// ==================
app.use(express.static(path.join(__dirname, "public")));

// ==================
// Ruta principal
// ==================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login_postulante.html"));
}); 
// ==================
// Servidor
// ==================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
