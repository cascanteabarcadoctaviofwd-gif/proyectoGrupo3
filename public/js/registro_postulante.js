const formRegistro = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

console.log("JS de registro cargado");

formRegistro.addEventListener("submit", function (evento) { //(evento es solo el nombre de la función)

    console.log("Formulario enviado");
    evento.preventDefault(); //“NO hagas lo que harías normalmente, recarga la página por defecto”

    //Leer datos
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    //Validar campos vacíos
    if (nombre === "" || apellido === "" || email === "" || password === "") {
        mensaje.textContent = "Completa todos los campos";
        return;
    }

    //Enviar datos al servidor
    fetch("http://localhost:2929/api/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            apellido,
            email,
            password
        })
    })
        .then(res => res.json())
        .then(data => {
            mensaje.textContent = data.message;

            if (data.ok) {
                formRegistro.reset();
                //window.location.href = "login_postulante.html";
            }
        });
});
