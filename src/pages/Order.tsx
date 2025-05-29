import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getOrderByIdBranch } from "../services/staff_order";
import LogoutButton from "../components/LogoutButton";
import ModalOrderDetail from "../components/ModalOrderDetail";
import type { Order } from "../utils/Order";



interface OrderDetail {
    id: number;
    orderId: number;
    itemName: string;
    price: number;
    quantity: number;
}

// Định nghĩa type cho dữ liệu trả về từ API
interface ApiOrder {
    orderId: number;
    branchId: number;
    status: string;
    totalPrice: number;
    orderDate: string;
    customerInfo?: string;
}

const OrdersPage: React.FC = () => {
    const [locationFilter, setLocationFilter] = useState<string>("Tất cả");
    const [statusFilter, setStatusFilter] = useState<string>("Đang chờ");
    const [date, setDate] = useState<string>("22/04/2025");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { id: branchId } = useAuth(); // Placeholder for branch ID
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetail, setOrderDetail] = useState<OrderDetail[]>([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        // Fetch orders data based on the selected filters
        // This is a placeholder for actual data fetching logic
        const fetchOrders = async () => {
            try {
                // Simulate an API call
                if (branchId) {
                    const response = await getOrderByIdBranch(branchId);
                    setOrders((response.data.data as ApiOrder[]).map((order) => ({
                        id: order.orderId,
                        branchId: order.branchId,
                        status: order.status,
                        totalPrice: order.totalPrice,
                        createdAt: order.orderDate,
                        customerInfo: order.customerInfo,
                    })));
                    console.log("Orders data:", response.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [branchId]);

    // Hàm lấy chi tiết đơn hàng (giả sử có API getOrderDetailByOrderId)
    const handleShowOrderDetail = async (order: Order) => {
        // TODO: Gọi API lấy chi tiết đơn hàng theo order.id
        // const detail = await getOrderDetailByOrderId(order.id);
        // setOrderDetail(detail);
        // setSelectedOrder(order);
        // setShowOrderModal(true);
        // Tạm thời mock dữ liệu:
        setOrderDetail([
            { id: 1, orderId: order.id, itemName: "Latte", price: 50000, quantity: 2 },
            { id: 2, orderId: order.id, itemName: "Cappuccino", price: 40000, quantity: 1 },
        ]);
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    Quản lý đơn hàng
                </h2>
                <LogoutButton />
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
                        <th className="p-2 text-left">Chi nhánh</th>
                        <th className="p-2 text-left">Món</th>
                        <th className="p-2 text-left">Giá</th>
                        <th className="p-2 text-left">Thời gian</th>
                        <th className="p-2 text-left">Trạng thái</th>
                        <th className="p-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2">{order.id}</td>
                            <td className="p-2">{order.branchId}</td>
                            <td className="p-2">a</td>
                            <td className="p-2">{order.totalPrice}</td>
                            <td className="p-2">{order.createdAt}</td>
                            <td className="p-2">
                                <span
                                    className={
                                        order.status === "Pending"
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                    }
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td className="p-2 cursor-pointer" onClick={() => handleShowOrderDetail(order)}>👁️</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalOrderDetail
                isOpen={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                _order={selectedOrder}
            />
        </div>
    );
};
export default OrdersPage;
