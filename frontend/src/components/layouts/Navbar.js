import { Link } from "react-router-dom";
import { useContext } from "react";

import Logo from "../../assets/img/logo.png";
//css
import styles from "./Navbar.module.css";
// Context
import { Context } from "../../context/UserContext";

function Navbar() {
  const { authenticated } = useContext(Context);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Get A Pet" />
        <h2>Get a Pet</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        {authenticated ? (
          <>
            <p>Logado</p>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Cadastrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
