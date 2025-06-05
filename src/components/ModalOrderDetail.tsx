import React, { useEffect, useState } from "react";
import { getOrderDetailsById } from "../services/order_detail";
import type { Order } from "../utils/Order";

const ModalOrderDetail: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    _order: Order | null;

}> = ({ isOpen, onClose, _order }) => {
    const [order, setOrder] = useState<{
        id: string;
        type: string;
        branch: number;
        time: string;
        items: { name: string; price: string }[];
        total: string;
        status: string;
        customer?: string;
    } | null>(null);

    useEffect(() => {
        if (!isOpen || !_order) return;
        const fetchDetail = async () => {
            const res = await getOrderDetailsById(Number(_order.id));
            if (!res.data) return;
            setOrder({
                id: _order.id.toString(),
                type: _order.customerInfo ? "Online" : "Tại quầy",
                branch: _order.branchId,
                time: _order.createdAt,
                items: (res.data.data || []).map((item: any) => ({
                    name: item.menuItem.name,
                    price: item.unitPrice.toLocaleString("vi-VN") + " VNĐ" + (item.quantity ? ` x${item.quantity}` : ""),
                })),
                total: _order.totalPrice.toLocaleString("vi-VN") + " VNĐ",
                status: _order.status,
                customer: _order.customerInfo || undefined,
            });
        };
        fetchDetail();
    }, [isOpen, _order]);

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4 text-orange-600">
                    Chi tiết đơn
                </h2>
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium">
                            Mã đơn
                        </label>
                        <p className="text-gray-700">{order.id}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Loại
                        </label>
                        <p className="text-gray-700">{order.type}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Chi nhánh
                        </label>
                        <p className="text-gray-700">{order.branch}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Thời gian
                        </label>
                        <p className="text-gray-700">{order.time}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Khách
                        </label>
                        <p className="text-gray-700">{order.customer || "Khách tại quầy"}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Món</label>
                        <ul className="list-decimal list-inside text-gray-700">
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.name} - {item.price}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Tổng
                        </label>
                        <p className="text-gray-700">{order.total}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Trạng thái
                        </label>
                        <p className="text-gray-700">{order.status}</p>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalOrderDetail;
