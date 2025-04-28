import { NavBar } from "../index";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import Rightbar from "../Rightbar/Rightbar";

const Layout = () => {
  return (
    <div className="layout">
      <NavBar />
      <Rightbar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
