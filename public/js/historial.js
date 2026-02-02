const cuerpoHistorial = document.getElementById("cuerpoHistorial");
const mensajeHistorial = document.getElementById("mensajeHistorial");
const mensajeSinHistorial = document.getElementById("mensajeSinHistorial");

// Simulamos usuario logueado (luego lo haremos dinámico)
const correoUsuario = localStorage.getItem("correoUsuario");

fetch("http://localhost:2929/api/postulaciones")
    .then(res => res.json())
    .then(data => {

        if (!data.ok) {
            mensajeHistorial.textContent = "Error al cargar el historial.";
            return;
        }

        // Filtrar solo las postulaciones del usuario
        const postulacionesUsuario = data.postulaciones.filter(
            p => p.correo === correoUsuario
        );

        if (postulacionesUsuario.length === 0) {
            mensajeSinHistorial.style.display = "block";
            return;
        }

        postulacionesUsuario.forEach(postulacion => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${postulacion.tipoBeca}</td>
                <td>${new Date(postulacion.fecha).toLocaleDateString()}</td>
                <td>${postulacion.estado}</td>
            `;

            cuerpoHistorial.appendChild(fila);
        });
    })
    .catch(() => {
        mensajeHistorial.textContent = "No se pudo conectar con el servidor.";
    });