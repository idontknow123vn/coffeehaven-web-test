import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getOrdersByIdBranchAndDate } from "../../services/staff_order";
import LogoutButton from "../../components/LogoutButton";
import ModalOrderDetail from "../../components/ModalOrderDetail";
import type { Order } from "../../utils/Order";

interface OrderDetail {
    id: number;
    orderId: number;
    itemName: string;
    price: number;
    quantity: number;
}

interface ApiOrder {
    orderId: number;
    branchId: number;
    status: string;
    totalPrice: number;
    orderDate: string;
    customerInfo?: string;
}

const ViewPreparingOrder: React.FC = () => {
    const { id: branchId } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetail, setOrderDetail] = useState<OrderDetail[]>([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [date, setDate] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (branchId) {
                    const dateStr = date ? (date.includes("/") ? date.split("/").reverse().join("-") : date) : "all";
                    const response = await getOrdersByIdBranchAndDate(branchId, dateStr, page, pageSize, "Preparing");
                    const apiOrders = response.data.data as ApiOrder[];
                    setOrders(apiOrders.map(order => ({
                        id: order.orderId,
                        branchId: order.branchId,
                        status: order.status,
                        totalPrice: order.totalPrice,
                        createdAt: order.orderDate,
                        customerInfo: order.customerInfo,
                    })));
                    if (response.data.totalPages !== undefined) {
                        setTotalPages(response.data.totalPages);
                    } else {
                        setTotalPages(1);
                    }
                }
            } catch (error) {
                console.error("Error fetching preparing orders:", error);
            }
        };
        fetchOrders();
        const interval = setInterval(fetchOrders, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [branchId, date, page, pageSize]);

    // Hàm lấy chi tiết đơn hàng (giả sử có API getOrderDetailByOrderId)
    const handleShowOrderDetail = async (order: Order) => {
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
                    Đơn hàng đang chuẩn bị
                </h2>
                <LogoutButton />
            </div>
            <div className="flex items-center space-x-4 mb-4">
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="border rounded p-2"
                />
                {date && (
                    <button
                        type="button"
                        onClick={() => setDate("")}
                        className="ml-2 px-2 py-1 bg-gray-200 rounded"
                    >
                        X
                    </button>
                )}
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">Mã đơn</th>
                        <th className="p-2 text-left">Chi nhánh</th>
                        <th className="p-2 text-left">Tổng tiền</th>
                        <th className="p-2 text-left">Thời gian</th>
                        <th className="p-2 text-left">Trạng thái</th>
                        <th className="p-2 text-left">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2">{order.id}</td>
                            <td className="p-2">{order.branchId}</td>
                            <td className="p-2">{order.totalPrice}</td>
                            <td className="p-2">{order.createdAt}</td>
                            <td className="p-2">
                                <span className="text-yellow-500">Đang chuẩn bị</span>
                            </td>
                            <td className="p-2 cursor-pointer" onClick={() => handleShowOrderDetail(order)}>👁️</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 rounded bg-gray-200 disabled:bg-gray-100"
                >
                    Trang trước
                </button>
                <span className="px-3 py-1">
                    Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
                </span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 rounded bg-gray-200 disabled:bg-gray-100"
                >
                    Trang sau
                </button>
                <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setPage(0); }}
                    className="ml-4 border rounded px-2 py-1"
                >
                    {[5, 10, 20, 50].map(size => (
                        <option key={size} value={size}>{size} / trang</option>
                    ))}
                </select>
            </div>
            <ModalOrderDetail
                isOpen={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                _order={selectedOrder}
            />
        </div>
    );
};

export default ViewPreparingOrder;
