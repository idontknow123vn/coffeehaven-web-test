import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getOrdersByIdBranchAndDate } from "../services/staff_order";
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
    branchName: string;
    status: string;
    totalPrice: number;
    orderDate: string;
    customerInfo?: string;
    employeeId?: number;
    employeeName?: string;
    employeePhone?: string;
    receiverInfo?: string;
    customerConfirm?: boolean;
    deliveryConfirm?: boolean;
}

const OrdersPage: React.FC = () => {
    const [locationFilter, setLocationFilter] = useState<string>("Tất cả");
    const [statusFilter, setStatusFilter] = useState<string>("Tất cả");
    const [date, setDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().slice(0, 10);
    });
    const [customerPhone, setCustomerPhone] = useState<string>("");
    const { id: branchId } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetail, setOrderDetail] = useState<OrderDetail[]>([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTrigger, setSearchTrigger] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (branchId) {
                    // Nếu date rỗng thì truyền 'all' cho API
                    const dateStr = date ? (date.includes("/") ? date.split("/").reverse().join("-") : date) : "all";
                    const statusParam = statusFilter === "Tất cả" ? "all" :
                        statusFilter === "Đang chờ" ? "Pending" :
                        statusFilter === "Đang chuẩn bị" ? "Preparing" :
                        statusFilter === "Đang giao" ? "Delivering" :
                        statusFilter === "Đã giao" ? "Delivered" :
                        statusFilter === "Đã hủy" ? "Cancelled" : statusFilter;
                    const response = await getOrdersByIdBranchAndDate(branchId, dateStr, customerPhone, page, pageSize, statusParam);
                    let apiOrders = response.data.data as ApiOrder[];
                    // Lọc theo location nếu cần
                    if (locationFilter === "Tại quầy") {
                        apiOrders = apiOrders.filter(order => !order.customerInfo);
                    }
                    setOrders(apiOrders.map((order) => ({
                        id: order.orderId,
                        branchId: order.branchId,
                        branchName: order.branchName,
                        status: order.status,
                        totalPrice: order.totalPrice,
                        createdAt: order.orderDate,
                        customerInfo: order.customerInfo,
                        employeeId: order.employeeId,
                        employeeName: order.employeeName,
                        employeePhone: order.employeePhone,
                        receiverInfo: order.receiverInfo,
                        customerConfirm: order.customerConfirm,
                        deliveryConfirm: order.deliveryConfirm,
                    })));
                    // Lấy tổng số trang từ response nếu có
                    if (response.data.totalPages !== undefined) {
                        setTotalPages(response.data.totalPages);
                    } else {
                        setTotalPages(1);
                    }
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [branchId, date, statusFilter, locationFilter, page, pageSize, customerPhone, searchTrigger]);

    // Hàm lấy chi tiết đơn hàng (giả sử có API getOrderDetailByOrderId)
    const handleShowOrderDetail = async (order: Order) => {
        // TODO: Gọi API lấy chi tiết đơn hàng theo order.id
        // const detail = await getOrderDetailByOrderId(order.id);
        // setOrderDetail(detail);
        // setSelectedOrder(order);
        // setShowOrderModal(true);
        // Tạm thời mock dữ liệu:
        // setOrderDetail([
        //     { id: 1, orderId: order.id, itemName: "Latte", price: 50000, quantity: 2 },
        //     { id: 2, orderId: order.id, itemName: "Cappuccino", price: 40000, quantity: 1 },
        // ]);
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    // Nút làm mới
    const handleRefresh = () => {
        setSearchTrigger(t => t + 1);
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
                    <option>Tại quầy</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded p-2"
                >
                    <option>Tất cả</option>
                    <option>Đang chờ</option>
                    <option>Đang chuẩn bị</option>
                    <option>Đang giao</option>
                    <option>Đã giao</option>
                    <option>Đã hủy</option>
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="text"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="Tìm SĐT khách hàng"
                    className="border rounded p-2"
                />
                <button
                    className="px-3 py-1 bg-orange-500 text-white rounded"
                    onClick={() => setSearchTrigger(t => t + 1)}
                >
                    Tìm
                </button>
                <button
                    className="px-3 py-1 bg-gray-300 text-black rounded"
                    onClick={() => setCustomerPhone("")}
                >
                    Hủy
                </button>
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={handleRefresh}
                    title="Làm mới danh sách"
                >
                    Làm mới
                </button>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">Mã đơn</th>
                        <th className="p-2 text-left">Chi nhánh</th>
                        <th className="p-2 text-left">Nhân viên</th>
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
                            <td className="p-2">{order.branchName}</td>
                            <td className="p-2">
                                {(order.employeeName && order.employeePhone)
                                    ? `${order.employeeName} (${order.employeePhone})`
                                    : ''}
                            </td>
                            <td className="p-2">{order.totalPrice}</td>
                            <td className="p-2">{order.createdAt}</td>
                            <td className="p-2">
                                <span
                                    className={
                                        order.status === "Preparing"
                                            ? "text-yellow-500"
                                            : order.status === "Delivering"
                                            ? "text-blue-500"
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
export default OrdersPage;
