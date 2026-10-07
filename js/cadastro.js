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
      alert("Erro: A senha e a confirmação de senha não coincidem.");
      return;
    }

    if (senha.length < 6) {
      alert("Erro: A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    const resultado = cadastrarUsuarioMock({ nome, username, email, senha });

    if (!resultado.sucesso) {
      alert(resultado.mensagem);
      return;
    }

    alert("Cadastro realizado com sucesso! Redirecionando para o login.");
    window.location.href = "login.html";
  });
}
