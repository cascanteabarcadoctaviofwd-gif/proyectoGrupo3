const tablaPostulaciones = document.getElementById("tablaPostulaciones");
const mensajeEvaluador = document.getElementById("mensajeEvaluador");
const sinPostulaciones = document.getElementById("sinPostulaciones");

fetch("http://localhost:2929/api/postulaciones")
  .then(res => res.json())
  .then(data => {

    if (!data.ok) {
      mensajeEvaluador.textContent = "Error al cargar postulaciones.";
      return;
    }

    if (data.postulaciones.length === 0) {
      sinPostulaciones.style.display = "block";
      return;
    }

    data.postulaciones.forEach(p => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${p.nombreCompleto}</td>
        <td>${p.correo}</td>
        <td>${p.tipoBeca}</td>
        <td>${new Date(p.fecha).toLocaleDateString()}</td>
        <td>${p.estado}</td>
        <td>
          <button class="btn btn-aprobar">Aprobar</button>
          <button class="btn btn-rechazar">Rechazar</button>
        </td>
      `;

      // BOTÓN APROBAR
      fila.querySelector(".btn-aprobar").addEventListener("click", () => {
        actualizarEstado(p.id, "aprobada");
      });

      // BOTÓN RECHAZAR
      fila.querySelector(".btn-rechazar").addEventListener("click", () => {
        actualizarEstado(p.id, "rechazada");
      });

      tablaPostulaciones.appendChild(fila);
    });
  })
  .catch(() => {
    mensajeEvaluador.textContent = "No se pudo conectar con el servidor.";
  });

// FUNCIÓN PARA CAMBIAR ESTADO
function actualizarEstado(id, estado) {
  fetch(`http://localhost:2929/api/postulaciones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ estado })
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        location.reload(); // recarga para ver cambios
      } else {
        alert(data.message);
      }
    });
}