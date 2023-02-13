import React from "react";
import { GiAutoRepair } from "react-icons/gi";

const seccionesPrueba = [
  {
    title: "dashboard",
    id: "dashboard",
    icon: <GiAutoRepair id={seccion.id} className="text-primary" />,
  },
  {
    title: "dashboard",
    id: "dashboard",
    icon: <GiAutoRepair className="text-primary" />,
  },
  {
    title: "dashboard",
    id: "dashboard",
    icon: <GiAutoRepair className="text-primary" />,
    spacing: true,
  },
  {
    title: "Ventas",
    id: "ventas",
    icon: <GiAutoRepair className="text-primary" />,
    submenu: true,
    submenuItems: [
      {
        path: "/ventas/clientes",
        title: "Clientes",
      },
      {
        path: "/ventas/conductores-transportistas",
        title: "Conductores - Transportistas",
      },
      {
        path: "/ventas/documentos-de-venta",
        title: "Documentos de Venta",
      },
      {
        path: "/ventas/guias-de-remision",
        title: "Guias de Remision",
      },
      {
        path: "/ventas/cotizaciones",
        title: "Cotizaciones",
      },
      {
        path: "/ventas/salidas-de-articulos",
        title: "Salidas de Articulos",
      },

      {
        path: "/ventas/registro-de-venta-articulo",
        title: "Registro de Venta - Articulo",
      },
    ],
  },
  {
    title: "Ventas",
    id: "ventas",
    icon: <GiAutoRepair className="text-primary" />,
    submenu: true,
    submenuItems: [
      {
        path: "/ventas/clientes",
        title: "Clientes",
      },
      {
        path: "/ventas/conductores-transportistas",
        title: "Conductores - Transportistas",
      },
      {
        path: "/ventas/documentos-de-venta",
        title: "Documentos de Venta",
      },
      {
        path: "/ventas/guias-de-remision",
        title: "Guias de Remision",
      },
      {
        path: "/ventas/cotizaciones",
        title: "Cotizaciones",
      },
      {
        path: "/ventas/salidas-de-articulos",
        title: "Salidas de Articulos",
      },

      {
        path: "/ventas/registro-de-venta-articulo",
        title: "Registro de Venta - Articulo",
      },
    ],
  },
  {
    title: "dashboard",
    id: "dashboard",
    icon: <GiAutoRepair className="text-primary" />,
    spacing: true,
  },
];

export default seccionesPrueba;
