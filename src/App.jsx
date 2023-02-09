import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        <Route path="/login" element={<Login />} />
        <Route path="/olvide-password" element={<ForgetPassword />} />
        <Route path="/" element={<LayoutAdmin />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
