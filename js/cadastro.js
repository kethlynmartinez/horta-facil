const form = document.getElementById("formCadastro");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
      mostrarAviso("A senha e a confirmação de senha não coincidem.", "erro");
      return;
    }

    if (senha.length < 6) {
      mostrarAviso("A senha deve ter no mínimo 6 caracteres.", "erro");
      return;
    }

    const resultado = cadastrarUsuarioMock({ nome, username, email, senha });

    if (!resultado.sucesso) {
      mostrarAviso(resultado.mensagem, "erro");
      return;
    }

    mostrarAviso("Cadastro realizado com sucesso! Redirecionando para o login.", "sucesso");
    setTimeout(function () { window.location.href = "login.html"; }, 1600);
  });
}
