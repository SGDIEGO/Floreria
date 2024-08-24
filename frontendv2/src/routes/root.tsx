import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/navbar";

export default function Root() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
