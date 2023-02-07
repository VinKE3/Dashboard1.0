import React, { useState } from "react";
import Boton from "../../Components/Boton";
//icons
import {
  RiMailFill,
  RiLockFill,
  RiEyeFill,
  RiEyeOffFill,
} from "react-icons/ri";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="bg-secondary-100 p-8 rounded-xl">
        <h1 className="text-center text-1xl uppercase font-bold tracking-[5px] text-white">
          Pintureria
        </h1>
        <h1 className="text-center text-2xl uppercase font-bold tracking-[5px] text-white mb-8">
          Cikron
        </h1>
        <h1 className="text-3xl uppercase font-bold tracking-[5px] text-white mb-8">
          Iniciar Sesion
        </h1>
        <form action="">
          <div className="relative mb-4">
            <RiMailFill className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type="email"
              className="py-2 pl-8 pr-4 bg-secondary-900 w-full outline-none
            rounded-lg  "
              placeholder="Correo Electronico"
            />
          </div>
          <div className="relative mb-4">
            <RiLockFill className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type={showPassword ? "text" : "password"}
              className="py-2 pl-8 bg-secondary-900 w-full outline-none
            rounded-lg  "
              placeholder="Contraseña"
            />
            {showPassword ? (
              <RiEyeFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer"
              />
            ) : (
              <RiEyeOffFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer"
              />
            )}
          </div>
          <div>
            <Boton />
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
