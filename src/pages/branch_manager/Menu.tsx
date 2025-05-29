import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
    getMenuItemsByBranch,
} from "../../services/menu-items";
import { getMenuItemsNotInBranch, addItemToBranch } from "../../services/manager";
import LogoutButton from "../../components/LogoutButton";

// Sửa lại type cho menuItems và allMenuItems để có thể có orders/available (nếu có)
type MenuItem = { id: number; name: string; category: string; price: number; orders?: number; available?: boolean };

const MenuPage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const { id: branchId } = useAuth();
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
    const [adding, setAdding] = useState<number | null>(null); // id món đang thêm

    // State cho modal phân trang và lọc category
    const [addModalPage, setAddModalPage] = useState(0);
    const [addModalPageSize] = useState(10);
    const [addModalTotalPages, setAddModalTotalPages] = useState(0);
    const [addModalCategoryId, setAddModalCategoryId] = useState(0);

    useEffect(() => {
        // Fetch menu items based on the selected page and pageSize
        const fetchMenuItems = async () => {
            try {
                if (typeof branchId === 'number') {
                    const result = await getMenuItemsByBranch(
                        branchId,
                        page,
                        pageSize,
                        categoryId
                    );
                    setMenuItems(result.data);
                    setTotalPages(result.totalPages);
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };
        fetchMenuItems();
    }, [branchId, page, pageSize, categoryId]);

    // Lấy danh sách món chưa có trong chi nhánh khi mở modal hoặc khi đổi trang/category
    useEffect(() => {
        if (!showAddModal) return;
        const fetchNotInBranch = async () => {
            if (typeof branchId === 'number') {
                const result = await getMenuItemsNotInBranch(branchId, addModalCategoryId, addModalPage, addModalPageSize);
                setAllMenuItems(result.data?.data ?? []);
                setAddModalTotalPages(result.data?.totalPages ?? 1);
            }
        };
        fetchNotInBranch();
    }, [showAddModal, branchId, addModalCategoryId, addModalPage, addModalPageSize]);

    // Lấy danh sách món chưa có trong chi nhánh khi mở modal
    const handleOpenAddModal = async () => {
        setAddModalPage(0); // Reset về trang đầu khi mở modal
        setShowAddModal(true);
        try {
            if (typeof branchId === 'number') {
                const result = await getMenuItemsNotInBranch(branchId);
                setAllMenuItems(result.data.data ?? []);
            } else {
                setAllMenuItems([]);
            }
        } catch {
            setAllMenuItems([]);
        }
    };
    // Thêm món vào chi nhánh
    const handleAddItem = async (itemId: number) => {
        if (typeof branchId !== 'number') return;
        setAdding(itemId);
        try {
            await addItemToBranch(branchId, itemId);
            // Sau khi thêm, reload menuItems của chi nhánh
            const result = await getMenuItemsByBranch(branchId, page, pageSize, categoryId);
            setMenuItems(result.data);
            setTotalPages(result.totalPages);
            // Reload lại danh sách món chưa có trong chi nhánh
            const notInBranch = await getMenuItemsNotInBranch(branchId);
            setAllMenuItems(notInBranch.data.data ?? []);
        } finally {
            setAdding(null);
        }
    };

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    Quản lý thực đơn
                </h2>
                <LogoutButton />
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <select
                    value={categoryId}
                    onChange={(e) => {
                        setCategoryId(Number(e.target.value));
                        setPage(0); // Reset to the first page when category changes
                    }}
                    className="border rounded p-2"
                >
                    <option value={0}>Tất cả</option>
                    <option value={1}>Cà phê</option>
                    <option value={2}>Đồ ăn nhẹ</option>
                    <option value={3}>Nước ép</option>
                    <option value={4}>Trà</option>
                </select>
                <button
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                    onClick={handleOpenAddModal}
                >
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
                    {menuItems.map((item, index) => (
                        <tr key={item.id || index} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">{item.price}</td>
                            <td className="p-2">{item.orders ?? "-"}</td>
                            <td className="p-2">
                                <span
                                    className={
                                        item.available === true
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }
                                >
                                    {item.available === true ? "Còn hàng" : "Hết hàng"}
                                </span>
                            </td>
                            <td className="p-2">✏️</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-4">
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded ${
                        page === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-orange-500 text-white"
                    }`}
                >
                    Trang trước
                </button>
                <span className="px-4 py-2 bg-orange-500 text-white rounded">
                    Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
                </span>
                <button
                    onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                    className={`px-4 py-2 rounded ${
                        page >= totalPages - 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-orange-500 text-white"
                    }`}
                >
                    Trang sau
                </button>
            </div>

            {/* Modal thêm món */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                Danh sách món chưa có trong chi nhánh
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setPage(0); // Reset về trang đầu khi đóng modal
                                }}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                            <select
                                value={addModalCategoryId}
                                onChange={e => {
                                    setAddModalCategoryId(Number(e.target.value));
                                    setAddModalPage(0);
                                }}
                                className="border rounded p-2"
                            >
                                <option value={0}>Tất cả</option>
                                <option value={1}>Cà phê</option>
                                <option value={2}>Đồ ăn nhẹ</option>
                                <option value={3}>Nước ép</option>
                                <option value={4}>Trà</option>
                            </select>
                        </div>
                        <table className="w-full border-collapse mb-2">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 text-left">Tên món</th>
                                    <th className="p-2 text-left">Danh mục</th>
                                    <th className="p-2 text-left">Giá</th>
                                    <th className="p-2 text-left">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allMenuItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center p-4">
                                            Tất cả món đã có trong chi nhánh
                                        </td>
                                    </tr>
                                ) : (
                                    allMenuItems.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="p-2">{item.name}</td>
                                            <td className="p-2">{item.category}</td>
                                            <td className="p-2">{item.price}</td>
                                            <td className="p-2">
                                                <button
                                                    className="bg-orange-500 text-white px-3 py-1 rounded disabled:opacity-60"
                                                    disabled={adding === item.id}
                                                    onClick={() => handleAddItem(item.id)}
                                                >
                                                    {adding === item.id ? 'Đang thêm...' : 'Thêm món'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {/* Pagination cho modal */}
                        <div className="flex justify-center mt-4 gap-4">
                            <button
                                onClick={() => setAddModalPage(p => Math.max(0, p - 1))}
                                disabled={addModalPage === 0}
                                className={`px-4 py-2 rounded ${addModalPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 text-white'}`}
                            >
                                Trang trước
                            </button>
                            <span className="px-4 py-2 bg-orange-500 text-white rounded">
                                Trang {addModalTotalPages === 0 ? 0 : addModalPage + 1}/{addModalTotalPages}
                            </span>
                            <button
                                onClick={() => setAddModalPage(p => Math.min(addModalTotalPages - 1, p + 1))}
                                disabled={addModalPage >= addModalTotalPages - 1}
                                className={`px-4 py-2 rounded ${addModalPage >= addModalTotalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 text-white'}`}
                            >
                                Trang sau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MenuPage;
