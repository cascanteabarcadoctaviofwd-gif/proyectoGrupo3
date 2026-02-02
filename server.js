const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 2929;




// ==================
// Middlewares
// ==================
app.use(cors());
app.use(express.json());



// ==================
// Archivos estáticos
// ==================
app.use(express.static(path.join(__dirname, "public")));



// ==================
// Ruta principal
// ==================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});



// ==================
// REGISTRO
// ==================
app.post("/api/registro", (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));

  const emailExiste = data.usuarios.some(u => u.email === email);

  if (emailExiste) {
    return res.json({
      ok: false,
      message: "El email ya está registrado"
    });
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    apellido,
    email,
    password,
    rol: "postulante"
  };

  data.usuarios.push(nuevoUsuario);
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

  res.json({
    ok: true,
    message: "Registro exitoso"
  });
});



// ==================
// LOGIN
// ==================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));

  const usuario = data.usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.json({
      ok: false,
      message: "Usuario no encontrado"
    });
  }

  if (usuario.password !== password) {
    return res.json({
      ok: false,
      message: "Contraseña incorrecta"
    });
  }

  const rol = usuario.rol || "postulante";

  res.json({
    ok: true,
    message: "Inicio de sesión exitoso",
    rol
  });
});


// ==================
// POSTULACIONES
// ==================
app.post("/api/postulaciones", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));

  const nuevaPostulacion = {
    id: Date.now(),
    ...req.body,
    estado: "pendiente",
    fecha: new Date().toISOString() //toISOString() convierte una fecha en texto estándar internacional, legible por cualquier sistema.
  };

  data.postulaciones.push(nuevaPostulacion);

  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

  res.json({
    ok: true,
    message: "Postulación enviada correctamente"
  });


});

// ==================
// OBTENER POSTULACIONES (HISTORIAL)
// ==================
app.get("/api/postulaciones", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));

  res.json({
    ok: true,
    postulaciones: data.postulaciones || []
  });
});

// ==================
// ACTUALIZAR ESTADO POSTULACIÓN
// ==================
app.put("/api/postulaciones/:id", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));

  const postulacion = data.postulaciones.find(p => p.id == id);

  if (!postulacion) {
    return res.json({
      ok: false,
      message: "Postulación no encontrada"
    });
  }

  postulacion.estado = estado;

  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

  res.json({
    ok: true,
    message: "Estado actualizado correctamente"
  });
});



// ==================
// Servidor
// ==================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});