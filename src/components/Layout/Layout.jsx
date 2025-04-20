import { NavBar } from "../index";
import "./Layout.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layout">
      <NavBar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
