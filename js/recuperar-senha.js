// recuperar-senha.js
const form = document.getElementById("formRecuperarSenha");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        
        console.log(`Simulando envio de e-mail para: ${email}`);
        alert("Se o e-mail estiver cadastrado, você receberá instruções em breve!");
        window.location.href = "login.html"; // Redireciona de volta para o login
    });
}