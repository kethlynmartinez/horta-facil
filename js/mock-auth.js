/**
 * mock-auth.js
 *
 * Simula um backend de autenticação usando localStorage como banco de dados.
 * Antes, login.js e cadastro.js faziam fetch() para um json-server rodando
 * em localhost:3000 (backend/db.json). Isso funcionava só localmente e não
 * dava pra testar no site publicado.
 *
 * Agora os usuários cadastrados ficam salvos no navegador, em duas chaves
 * separadas de localStorage:
 *
 *   - "horta_usuarios"   -> lista de todos os usuários cadastrados (o "banco de dados")
 *   - "usuarioLogado"    -> o usuário da sessão atual (já existia antes, mantido igual)
 *
 * Isso é um mock para fins de portfólio/demonstração. Dados ficam só no
 * navegador de quem está testando, não são enviados pra lugar nenhum.
 */

const HORTA_USUARIOS_KEY = "horta_usuarios";

// Usuário de demonstração, criado automaticamente na primeira visita, para
// que qualquer pessoa avaliando o projeto consiga testar o login sem
// precisar se cadastrar antes.
const USUARIO_DEMO = {
  nome: "Usuária Demo",
  username: "demo",
  email: "demo@hortafacil.com",
  senha: "123456",
  perfil: "comum",
};

function obterUsuarios() {
  const dados = localStorage.getItem(HORTA_USUARIOS_KEY);

  if (!dados) {
    // Primeira vez que o site roda neste navegador: semeia a lista com o
    // usuário de demonstração.
    const inicial = [USUARIO_DEMO];
    localStorage.setItem(HORTA_USUARIOS_KEY, JSON.stringify(inicial));
    return inicial;
  }

  try {
    return JSON.parse(dados);
  } catch (erro) {
    // Dado corrompido no localStorage: reseta para a lista inicial.
    const inicial = [USUARIO_DEMO];
    localStorage.setItem(HORTA_USUARIOS_KEY, JSON.stringify(inicial));
    return inicial;
  }
}

function salvarUsuarios(listaDeUsuarios) {
  localStorage.setItem(HORTA_USUARIOS_KEY, JSON.stringify(listaDeUsuarios));
}

/**
 * Tenta cadastrar um novo usuário.
 * Retorna { sucesso: true } ou { sucesso: false, mensagem: "..." }
 */
function cadastrarUsuarioMock({ nome, username, email, senha }) {
  const usuarios = obterUsuarios();

  const emailJaExiste = usuarios.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (emailJaExiste) {
    return {
      sucesso: false,
      mensagem: "Já existe uma conta cadastrada com esse e-mail.",
    };
  }

  const novoUsuario = { nome, username, email, senha, perfil: "comum" };
  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  return { sucesso: true };
}

/**
 * Tenta autenticar um usuário por e-mail e senha.
 * Retorna o objeto do usuário (sem a senha) em caso de sucesso, ou null.
 */
function autenticarUsuarioMock(email, senha) {
  const usuarios = obterUsuarios();

  const encontrado = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
  );

  if (!encontrado) return null;

  // Não guardamos a senha na sessão, só os dados de exibição.
  const { senha: _senha, ...usuarioSemSenha } = encontrado;
  return usuarioSemSenha;
}
