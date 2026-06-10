import React from "react";
import { Link } from "react-router-dom";

import UserDropdown from "./UserDropdown";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="head-container">
        <div className="head-atmos">
          <h1 className="ms-5" style={{ textTransform: "uppercase" }}>
            ATMOS
          </h1>
        </div>
        <div className="user">
          <UserDropdown />
        </div>
      </div>
      <div className="links ">
        <Link className="link" to="/home">
          Home
        </Link>
        <Link className="link" to="/projects">
          Projects
        </Link>
        <Link className="link" to="/message">
          Messages
        </Link>
        <Link className="link" to="/notes">
          Notes
        </Link>
        <Link className="link" to="/meetings">
          Meetings
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
