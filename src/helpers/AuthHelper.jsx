import store from "store2";

const getStorage = () =>
  store.session("access_token") ? store.session : store.local;
store.session("usuario") ? store.session : store.local;

const getToken = () => {
  const storage = getStorage();
  return storage("access_token");
};

const getUsuario = () => {
  const storage = getStorage();
  return storage("usuario");
};

const isAuthenticated = () => {
  const token = getToken();
  const usuario = getUsuario();
  return token !== null && usuario !== null;
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
    return getUsuario() && getToken();
  }
  if (isTokenExpired()) {
    borrarTokens();
  } else {
    return false;
  }
}

const borrarTokens = () => {
  store.session.remove("access_token");
  store.session.remove("usuario");
  store.session.remove("usuarioId");
  store.session.remove("personalId");
  store.session.remove("afectarStock");
  // store.session.remove("global");

  store.local.remove("access_token");
  store.local.remove("usuario");
  store.local.remove("usuarioId");
  store.local.remove("personalId");
  store.local.remove("afectarStock");
  // store.local.remove("global");
};

function borrarTodosLosTokens() {
  borrarTokens();
}

function login(data) {
  const { token } = data;
  store.local("access_token", token);
  store.session("access_token", token);
}

function usuarioGuardar(data) {
  const { usuario } = data;
  store.local("usuario", usuario);
  store.session("usuario", usuario);
}

function usuarioIdGuardar(data) {
  const { usuarioId } = data;
  store.local("usuarioId", usuarioId);
  store.session("usuarioId", usuarioId);
}

function personalIdGuardar(data) {
  const { personalId } = data;
  store.local("personalId", personalId);
  store.session("personalId", personalId);
}

function afectarStockGuardar(data) {
  const { afectarStock } = data;
  store.local("afectarStock", afectarStock);
  store.session("afectarStock", afectarStock);
}

function globalGuardar(data) {
  const { global } = data;
  store.local("global", global);
  store.session("global", global);
}

export const authHelper = {
  getAccessToken,
  borrarTodosLosTokens,
  login,
  usuarioGuardar,
  usuarioIdGuardar,
  personalIdGuardar,
  afectarStockGuardar,
  globalGuardar
};
