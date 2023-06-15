import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import GetIsPermitido from "../../../components/funciones/GetIsPermitido";
import Delete from "../../../components/funciones/Delete";
import Imprimir from "../../../components/funciones/Imprimir";
import ModalImprimir from "../../../components/filtro/ModalImprimir";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import { Checkbox } from "primereact/checkbox";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { FaUndoAlt } from "react-icons/fa";
import { faPlus, faPrint } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as G from "../../../components/Global";

const CajaChica = () => {
  return <div></div>;
};

export default CajaChica;
