import store from "store2";

const getStorage = () =>
  store.session("access_token") ? store.session : store.local;

const getUsuarioStorage = () =>
  store.session("usuario") ? store.session : store.local;

const getToken = () => {
  const storage = getStorage();
  return storage("access_token");
};

const getUsuario = () => {
  const storage = getUsuarioStorage();
  return storage("usuario");
};

const isAuthenticated = () => {
  const token = getToken();
  const jwtDecoded = getUsuario();
  return token !== null && jwtDecoded !== null;
};

const isTokenExpired = () => {
  const token = getToken();
  if (token) {
    return console.log(Math.round(new Date().getTime() / 1000));
  }
  return true;
};

function getAccessToken() {
  if (isAuthenticated()) {
    return {
      token: getToken(),
      usuario: getUsuario(),
    };
  }
  if (isTokenExpired()) {
    borrarTokens();
  } else {
    return false;
  }
}

const borrarTokens = () => {
  store.session.remove("access_token");
  store.local.remove("access_token");
};

const borrarUsuario = () => {
  store.session.remove("usuario");
  store.local.remove("usuario");
};

function borrarTodosLosTokens() {
  borrarTokens();
  borrarUsuario();
}

function login(data) {
  const { token } = data;
  store.local("access_token", token);
  store.session("access_token", token);
}

// function loginUsuario(data) {
//   const { usuario } = data;
//   store.local("usuario", usuario);
//   store.session("usuario", usuario);
// }

// function loginUsuario(data) {
//   const { usuario } = data;
//   store.local("usuario", usuario.jwtDecoded);
//   store.session("usuario", usuario.jwtDecoded);
// }
function loginUsuario(data) {
  const { usuario } = data;
  store.local("usuario", usuario);
  store.session("usuario", usuario);
}
export const authHelper = {
  getAccessToken,
  borrarTodosLosTokens,
  login,
  loginUsuario,
};
