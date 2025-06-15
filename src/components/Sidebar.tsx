import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

interface SidebarProps {
  isProfile?: boolean;
  name?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isProfile = false, name }) => {
  const location = useLocation();
  const userRole = location.pathname.startsWith("/head-office")
    ? "Head_Office"
    : "Branch_Manager";

  const branchManagerItems = [
    { name: "Tổng quan", icon: "📊", path: "/manager" },
    { name: "Thực đơn", icon: "🍽️", path: "/manager/menu" },
    { name: "Đơn hàng", icon: "📦", path: "/manager/orders" },
    { name: "Chi nhánh", icon: "🏢", path: "/manager/branches" },
    { name: "Nhân viên", icon: "👥", path: "/manager/employees" },
    { name: "Phân ca", icon: "📅", path: "/manager/shift" },
    { name: "Mã giảm giá", icon: "💸", path: "/manager/discounts" },
    { name: "Thông tin cá nhân", icon: "👤", path: "/manager/profile" },
  ];

  const headOfficeItems = [
    { name: "Tổng quan", icon: "📊", path: "/head-office" },
    { name: "Thực đơn", icon: "🍽️", path: "/head-office/menu" },
    { name: "Chi nhánh", icon: "🏢", path: "/head-office/branches" },
    { name: "Nhân sự", icon: "👥", path: "/head-office/employees" },
    { name: "Mã giảm giá", icon: "💸", path: "/head-office/discounts" },
    { name: "Thông tin cá nhân", icon: "👤", path: "/head-office/profile" },
  ];

  const menuItems =
    userRole === "Head_Office" ? headOfficeItems : branchManagerItems;

  return (
    <div className="w-56 h-screen bg-[#D2B48C] flex flex-col items-center py-6 shadow-lg fixed top-0 left-0 z-40">
      <div className="mb-6 flex flex-col items-center">
        <img
          src={logo}
          alt="Coffee Haven Logo"
          className="w-28 h-28 object-contain mb-2"
        />
        <h1 className="text-2xl font-bold text-[#8B4513] tracking-wide">
          Haven
        </h1>
        {!isProfile && name && (
          <span className="text-gray-700 mt-2">Xin chào, {name}</span>
        )}
      </div>
      <ul className="w-full flex-1 flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition-colors duration-200 hover:bg-[#8B4513] hover:text-white ${
                location.pathname === item.path
                  ? "bg-[#8B4513] text-white"
                  : "text-[#4B2E0B]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
