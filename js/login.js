const form = document.getElementById("formLogin");

if (form)
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuario = autenticarUsuarioMock(email, senha);

    if (usuario) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      window.location.href = "logado.html";
    } else {
      alert("E-mail ou senha inválidos");
    }
  });
