import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 pl-56">
      <Outlet />
    </div>
  </div>
);

export default ManagerLayout;
