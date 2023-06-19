import store from "store2";

const getStorage = () =>
  store.session("access_token") ? store.session : store.local;
store.session("refresh_token") ? store.session : store.local;
store.session("refresh_token") ? store.session : store.local;
store.session("usuario") ? store.session : store.local;

const getToken = () => {
  const storage = getStorage();
  return storage("access_token");
};

const getRefreshToken = () => {
  const storage = getStorage();
  return storage("refresh_token");
};

const getUsuario = () => {
  const storage = getStorage();
  return storage("usuario");
};

const isAuthenticated = () => {
  const token = getToken();
  const refreshToken = getRefreshToken();
  const usuario = getUsuario();
  return token !== null && usuario !== null && refreshToken !== null;
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
  const { refreshToken } = data;
  store.local("access_token", token);
  store.session("access_token", token);
  store.local("refresh_token", refreshToken);
  store.session("refresh_token", refreshToken);
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

function fechasFiltroGuardar(data) {
  const { fechasFiltro } = data;
  store.local("fechasFiltro", fechasFiltro);
  store.session("fechasFiltro", fechasFiltro);
}

export const authHelper = {
  getAccessToken,
  getRefreshToken,
  borrarTodosLosTokens,
  login,
  usuarioGuardar,
  usuarioIdGuardar,
  personalIdGuardar,
  afectarStockGuardar,
  globalGuardar,
  fechasFiltroGuardar,
};
