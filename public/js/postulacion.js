const form = document.getElementById("formPostulacion");
const mensaje = document.getElementById("mensaje");

console.log("JS de postulación cargado");

form.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const postulacion = {
        nombreCompleto: document.getElementById("nombreCompleto").value,
        correo: document.getElementById("correo").value,
        edad: document.getElementById("edad").value,
        tipoBeca: document.getElementById("tipoBeca").value,
        situacion: document.getElementById("situacion").value,
        motivo: document.getElementById("motivo").value
    };

    fetch("http://localhost:2929/api/postulaciones", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postulacion)
    })

    .then(res => res.json())
    .then(data => {
      mensaje.textContent = data.message;

      if (data.ok) {
        form.reset();
      }
    })
    .catch(err => {
      mensaje.textContent = "Error al enviar la postulación";
      console.error(err);
    });

})