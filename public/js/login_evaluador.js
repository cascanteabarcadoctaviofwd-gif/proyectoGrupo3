const formLogin = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:2929/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {

            console.log("RESPUESTA DEL SERVIDOR:", data);
            console.log("ROL RECIBIDO:", data.rol);

            if (!data.ok) {
                mensaje.textContent = data.message;
                return;
            }

            if (data.rol !== "evaluador") {
                mensaje.textContent = "Acceso solo para evaluadores";
                return;
            }

            window.location.href = "/evaluador.html";
        });
});