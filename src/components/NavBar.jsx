import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import "./styles/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    // Remove the token from localStorage
    localStorage.removeItem("jwt");
    // Navigate to the login page
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="navbar__logo">
        <Logo />
      </div>
      <ul className="navbar__nav">
        <li>
          <NavLink to="/ducks" className="navbar__link">
            Ducks
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-profile" className="navbar__link">
            My Profile
          </NavLink>
        </li>
        <li>
          <button
            className="navbar__link navbar__button"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
