import React, { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import ApiMasy from "../../api/ApiMasy";
import { useNavigate } from "react-router";
// Icons
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";

const LOGIN_URL = "api/Sesion/Iniciar";
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef(null);
  const errRef = useRef(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiMasy.post(
        LOGIN_URL,
        JSON.stringify({ usuario: user, clave: pwd }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, pwd, accessToken, roles });
      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Error de conexión");
      } else if (err?.response?.status === 400) {
        setErrMsg("Usuario o contraseña incorrectos");
      } else if (err?.response?.status === 401) {
        setErrMsg("Usuario no autorizado");
      } else {
        setErrMsg("Error desconocido");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <div>Buenas buenas</div>
      ) : (
        // navigate("/")
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
            <p
              ref={errRef}
              className={
                errMsg
                  ? "errmsg text-center text-1xl uppercase font-bold tracking-[5px] text-red-500"
                  : "offscreen text-center text-1xl uppercase font-bold tracking-[5px] text-red-500"
              }
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1 className="text-center text-1xl uppercase font-bold tracking-[5px] text-white">
              Pintureria
            </h1>
            <h1 className="text-center text-2xl uppercase font-bold tracking-[5px] text-yellow-300 mb-8">
              Cikron
            </h1>
            <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
              Iniciar <span className="text-primary">sesión</span>
            </h1>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="relative mb-4">
                <RiMailLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                  placeholder="Usuario"
                  required
                />
              </div>
              <div className="relative mb-8">
                <RiLockLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg"
                  placeholder="Contraseña"
                />
                {showPassword ? (
                  <RiEyeOffLine
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
                  />
                ) : (
                  <RiEyeLine
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
                  />
                )}
              </div>
              <div>
                <button
                  value="Ingresar"
                  type="submit"
                  className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default Login;
