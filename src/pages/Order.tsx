import { useState } from "react";

const OrdersPage: React.FC = () => {
    const [locationFilter, setLocationFilter] = useState<string>("Tất cả");
    const [statusFilter, setStatusFilter] = useState<string>("Đang chờ");
    const [date, setDate] = useState<string>("22/04/2025");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const ordersData = [
        {
            id: "DH001",
            location: "Tài quầy",
            item: "Latte",
            price: "50K",
            time: "22/04/2025 10:00",
            status: "Đang chờ",
        },
        {
            id: "DH002",
            location: "Tài quầy",
            item: "Cappuccino",
            price: "40K",
            time: "22/04/2025 10:30",
            status: "Đang chờ",
        },
        {
            id: "DH003",
            location: "Tài quầy",
            item: "Cappuccino",
            price: "70K",
            time: "22/04/2025 10:45",
            status: "Đang chờ",
        },
    ];

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    Quản lý đơn hàng - Chi nhánh Đa Năng
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
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="border rounded p-2"
                >
                    <option>Tất cả</option>
                    <option>Tài quầy</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded p-2"
                >
                    <option>Đang chờ</option>
                    <option>Đang giao</option>
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm đơn"
                    className="border rounded p-2"
                />
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">Mã đơn</th>
                        <th className="p-2 text-left">Loại</th>
                        <th className="p-2 text-left">Món</th>
                        <th className="p-2 text-left">Giá</th>
                        <th className="p-2 text-left">Thời gian</th>
                        <th className="p-2 text-left">Trạng thái</th>
                        <th className="p-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {ordersData.map((order, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2">{order.id}</td>
                            <td className="p-2">{order.location}</td>
                            <td className="p-2">{order.item}</td>
                            <td className="p-2">{order.price}</td>
                            <td className="p-2">{order.time}</td>
                            <td className="p-2">
                                <span
                                    className={
                                        order.status === "Đang chờ"
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                    }
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td className="p-2">👁️</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default OrdersPage;
