const btnRegistrar = document.getElementById("btnRegistrar");
const mensaje = document.getElementById("mensaje");

btnRegistrar.addEventListener("click", function () {

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (nombre === "" || apellido === "" || email === "" || password === "") {
        mensaje.textContent = "Completa todos los campos";
        return;
    }

    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    const emailExiste = usuariosRegistrados.some(usuario => usuario.email === email);

    if (emailExiste) {
        mensaje.textContent = "El email ya esta registrado";
        return;
    }

    const usuario = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
    };

    usuariosRegistrados.push(usuario);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));
    mensaje.textContent = "Registro exitoso";

    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";



})