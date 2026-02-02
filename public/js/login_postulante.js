const formLogin = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

console.log("JS de login cargado");

formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        mensaje.textContent = "Completa todos los campos";
        return;
    }

    fetch("http://localhost:2929/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })

        .then(res => res.json())
        .then(data => {
            mensaje.textContent = data.message;

            if (data.ok) {
                localStorage.setItem("correoUsuario", email);
                window.location.href = "/becas.html";
            }
        })
        .catch(err => {
            mensaje.textContent = "Error al conectar con el servidor";
            console.error(err);
        });
});