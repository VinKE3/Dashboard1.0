import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//layout
//Pages auth
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
//Pages Admin

import Error404 from "./Pages/Error404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*La demas rutas van a rederigirse a su propio path*/}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        {/*La ruta principal se va a dirigir al admin layout*/}

        {/*Las rutas diferentes van a dirigirse a la pagina de Error*/}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
