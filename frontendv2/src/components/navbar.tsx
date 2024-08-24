import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white">
      <div className="container">
        {/* <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent1"
          aria-controls="navbarSupportedContent1"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button> */}

        <div
          className="  d-flex align-items-center"
          id="navbarSupportedContent1"
        >
          <Link className="navbar-brand mt-2 mt-sm-0" to={"/"}>
            <img
              src="https://scontent.ftru2-3.fna.fbcdn.net/v/t39.30808-6/272744481_1307952329722308_6162683603750679793_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGGUOeIauHd8gA_LcOgBbzJwgvYFv4KZcjCC9gW_gplyFAL6QzgGLnf-eVqIVsCdLdqORq8WwINFgu7LUBeqOI_&_nc_ohc=DuyFbQpzJv0Q7kNvgFXMKfS&_nc_ht=scontent.ftru2-3.fna&oh=00_AYBXdJSbD9uvasrBeRGWRFsmX1BAR53kQlzEYqEpIMZ4Yw&oe=66CE2FF5"
              height="20"
              alt="MDB Logo"
              loading="lazy"
            />
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to={"/login"}>
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/register"}>
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* <div className="d-flex align-items-center">
          <a className="nav-link me-3" href="#">
            <i className="fas fa-shopping-cart"></i>
            <span className="badge rounded-pill badge-notification bg-danger">
              1
            </span>
          </a>

          <a className="nav-link me-3" href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a className="nav-link me-3" href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://github.com/mdbootstrap/bootstrap-material-design"
            className="border rounded px-2 nav-link"
            target="_blank"
          >
            <i className="fab fa-github me-2"></i>MDB GitHub
          </a>
        </div> */}
      </div>
    </nav>
  );
}
