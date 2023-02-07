import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//layout
import AdminLayout from "./layouts/AdminLayout";
import LayoutAuth from "./layouts/LayoutAuth";
//Pages auth
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
//Pages Admin
import Home from "./Pages/admin/Home";
import Error404 from "./Pages/Error404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*Las rutas de inicio de sesion y registro*/}
        <Route path="/auth" element={<LayoutAuth />}>
          <Route index element={<Login />} />
          <Route path="registro" element={<Register />} />
        </Route>
        {/*Rutas dentro del Dashboard*/}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Home />} />
        </Route>
        {/*Las rutas diferentes van a dirigirse a la pagina de Error*/}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
