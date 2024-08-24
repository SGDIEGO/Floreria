import { COOKIE_TOKEN } from "../data/token";
import { Link, Outlet } from "react-router-dom";

import Cookies from "js-cookie";

export default function Florista() {

  return (
    <>
      <Outlet />
    </>
  );
}
