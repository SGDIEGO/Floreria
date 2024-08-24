import { COOKIE_TOKEN } from "../data/token";
import { Link, Outlet } from "react-router-dom";

import Cookies from "js-cookie";
import { useState } from "react";

export default function Cliente() {
  // Usestate para buscar productos
  const [] = useState();

  return (
    <>
      <Outlet />
    </>
  );
}
