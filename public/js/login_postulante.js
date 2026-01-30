const btnLogin = document.getElementById("btnLogin");
const mensaje = document.getElementById("mensaje");

btnLogin.addEventListener("click", function () {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if (email === "" || password === ""){
        mensaje.textContent = "Completa todos los campos";
        return;
    }

    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];


    const usuarioValido = usuariosRegistrados.find(
        usuario => usuario.email === email 
        && usuario.password === password
    );

    if (usuarioValido){
        mensaje.textContent = "Inicio de sesion exitoso";
        window.location.href = "../html/home.html";

    }else{
        mensaje.textContent = "Correo o contraseña incorrectos";
    };
})