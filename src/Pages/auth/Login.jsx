import React, { useState, useEffect, useRef } from "react";
import { Link, Route } from "react-router-dom";
// Icons
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //para setear el focus en el input de usuario
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //
  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, pwd);
    setUser("");
    setPwd("");
    setSuccess(true);
  };

  return (
    <>
      {success ? (
        <section>
          <h1 className="text-center">
            Te logueaste Perro, clickea AKRON para ir al Home
          </h1>
          <button>
            <Link to={"/"}>
              AKRON<span className="text-primary text-4xl">.</span>
            </Link>
          </button>

          {/* <Route path="/" element={<LayoutAdmin />}></Route> */}
        </section>
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
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
                  className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                  placeholder="Usuario"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                />
              </div>
              <div className="relative mb-8">
                <RiLockLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg"
                  placeholder="Contraseña"
                  autoComplete="off"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
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
