import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {


    const userRole = location.pathname.startsWith("/head-office")
        ? "Head_Office"
        : "Branch_Manager";

    // const branchManagerItems = [
    //   { name: 'Tổng quan', icon: '📊', path: '/' },
    //   { name: 'Thực đơn', icon: '🍽️', path: '/menu' },
    //   { name: 'Đơn hàng', icon: '📦', path: '/orders' },
    //   { name: 'Kho', icon: '🏬', path: '/' },
    //   { name: 'Chi nhánh', icon: '🏢', path: '/branches' },
    //   { name: 'Nhân viên', icon: '👥', path: '/employees' },
    //   { name: 'Phân ca', icon: '📅', path: '/' },
    // ];

    const branchManagerItems = [
        { name: "Tổng quan", icon: "📊", path: "/manager-dashboard" },
        { name: "Thực đơn", icon: "🍽️", path: "/menu" },
        { name: "Đơn hàng", icon: "📦", path: "/orders" },
        // { name: 'Kho', icon: '🏬', path: '/' },
        { name: "Chi nhánh", icon: "🏢", path: "/branches" },
        { name: "Nhân viên", icon: "👥", path: "/employees" },
        { name: "Phân ca", icon: "📅", path: "/shift" },
    ];

    const headOfficeItems = [
        { name: "Tổng quan", icon: "📊", path: "/head-office" },
        { name: "Thực đơn", icon: "🍽️", path: "/head-office/menu" },
        { name: "Đơn hàng", icon: "📦", path: "/head-office/orders" },
        { name: "Chi nhánh", icon: "🏢", path: "/head-office/branches" },
        { name: "Nhân sự", icon: "👥", path: "/head-office/employees" },
    ];

    const menuItems =
        userRole === "Head_Office" ? headOfficeItems : branchManagerItems;

    return (
        <div className="w-48 h-screen bg-gray-100 p-4">
            <h1 className="text-xl font-bold text-blue-900 mb-6">Haven</h1>
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            to={item.path}
                            className={`flex items-center p-2 ${
                                location.pathname === item.path
                                    ? "bg-blue-200 rounded"
                                    : ""
                            }`}
                        >
                            <span className="mr-2">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
