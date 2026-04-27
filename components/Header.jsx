import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-bottom bg-white">
      <div className="container py-3 d-flex align-items-center justify-content-between">
        <NavLink to="/" className="text-decoration-none">
          <img
            src="/atd-logo.png"
            alt="Logo ATD"
            className="img-fluid"
            style={{ width: "90px" }}
          />
        </NavLink>

        <nav className="d-flex gap-3 align-items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link fw-semibold ${isActive ? "text-primary" : "text-dark"}`
            }
          >
            Homepage
          </NavLink>

          <NavLink
            to="/contatti"
            className={({ isActive }) =>
              `nav-link fw-semibold ${isActive ? "text-primary" : "text-dark"}`
            }
          >
            Contatti
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
