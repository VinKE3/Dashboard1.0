import store from "store2";

const getStorage = () =>
  store.session("access_token") ? store.session : store.local;

const getToken = () => {
  console.log("getToken");
  const storage = getStorage();
  return storage("access_token");
};

const isAuthenticated = () => {
  const token = getToken();
  return token !== null;
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
    return getToken();
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

function borrarTodosLosTokens() {
  borrarTokens();
}

function login(data) {
  const { token } = data;
  store.local("access_token", token);
  store.session("access_token", token);
  console.log("login");
}

export const authHelper = {
  getAccessToken,
  borrarTodosLosTokens,
  login,
};
