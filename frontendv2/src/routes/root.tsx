import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/navbar";
import { useEffect } from "react";
import { text, image, barcodes } from "@pdfme/schemas";
import { generate } from "@pdfme/generator";

export default function Root() {

  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
