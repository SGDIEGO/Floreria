import { Link, useRouteError } from "react-router-dom";
import NavBar from "./components/navbar";

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.error("error: ", error);

  return (
    <div id="error-page">
      <NavBar />
      <div style={{ paddingTop: "5rem" }}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{JSON.stringify(error)}</i>
        </p>
      </div>
      {/* <div>
        <Link to={"/"}>Home</Link> <Link to={"/login"}>Login</Link>
      </div> */}
    </div>
  );
}
