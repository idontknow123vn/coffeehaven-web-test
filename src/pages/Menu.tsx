import { useState } from "react";

const MenuPage: React.FC = () => {
    const [branch, setBranch] = useState<string>("Tất cả");

    const menuData = [
        {
            name: "Latte",
            category: "Cà phê",
            price: "50K",
            orders: 120,
            status: "Còn Hàng",
        },
        {
            name: "Trà Sữa",
            category: "Trà",
            price: "45K",
            orders: 80,
            status: "Hết Hàng",
        },
        {
            name: "Cà phê Sữa",
            category: "Cà phê",
            price: "20K",
            orders: 70,
            status: "Còn Hàng",
        },
    ];

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    Quản lý thực đơn - Chi nhánh Đa Năng
                </h2>
                <div className="flex items-center space-x-4">
                    <span>Xin chào, User</span>
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        JW
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="border rounded p-2"
                >
                    <option>Tất cả</option>
                    <option>Chi nhánh Đa Năng</option>
                </select>
                <button className="bg-orange-500 text-white px-4 py-2 rounded">
                    Thêm món
                </button>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">Tên món</th>
                        <th className="p-2 text-left">Danh mục</th>
                        <th className="p-2 text-left">Giá</th>
                        <th className="p-2 text-left">Lượt đặt</th>
                        <th className="p-2 text-left">Trạng thái</th>
                        <th className="p-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {menuData.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">{item.price}</td>
                            <td className="p-2">{item.orders}</td>
                            <td className="p-2">
                                <span
                                    className={
                                        item.status === "Còn Hàng"
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }
                                >
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-2">✏️</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default MenuPage;
