import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getMenuItems } from "../../services/menu-items";
import ModalAddMenuItem from "../../components/ModalAddItem";

type MenuItem = { id: number; name: string; category: string; price: number; orders?: number; available?: boolean };

const MenuItemPage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const { id: branchId } = useAuth();
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
    const [adding, setAdding] = useState<number | null>(null); // id món đang thêm

    useEffect(() => {
        // Fetch menu items based on the selected page and pageSize
        const fetchMenuItems = async () => {
            try {
                if (typeof branchId === 'number') {
                    const result = await getMenuItems(
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
    // useEffect(() => {
    //     if (!showAddModal) return;
    //     const fetchNotInBranch = async () => {
    //         if (typeof branchId === 'number') {
    //             const result = await getMenuItemsNotInBranch(branchId, addModalCategoryId, addModalPage, addModalPageSize);
    //             setAllMenuItems(result.data?.data ?? []);
    //             setAddModalTotalPages(result.data?.totalPages ?? 1);
    //         }
    //     };
    //     fetchNotInBranch();
    // }, [showAddModal, branchId, addModalCategoryId, addModalPage, addModalPageSize]);

    // Lấy danh sách món chưa có trong chi nhánh khi mở modal
    const handleOpenAddModal = async () => {
        // setAddModalPage(0); // Reset về trang đầu khi mở modal
        setShowAddModal(true);
        // try {
        //     if (typeof branchId === 'number') {
        //         const result = await getMenuItemsNotInBranch(branchId);
        //         setAllMenuItems(result.data.data ?? []);
        //     } else {
        //         setAllMenuItems([]);
        //     }
        // } catch {
        //     setAllMenuItems([]);
        // }
    };
    // Thêm món vào chi nhánh
    const handleAddItem = async (itemId: number) => {
        // if (typeof branchId !== 'number') return;
        // setAdding(itemId);
        // try {
        //     await addItemToBranch(branchId, itemId);
        //     // Sau khi thêm, reload menuItems của chi nhánh
        //     const result = await getMenuItemsByBranch(branchId, page, pageSize, categoryId);
        //     setMenuItems(result.data);
        //     setTotalPages(result.totalPages);
        //     // Reload lại danh sách món chưa có trong chi nhánh
        //     const notInBranch = await getMenuItemsNotInBranch(branchId);
        //     setAllMenuItems(notInBranch.data.data ?? []);
        // } finally {
        //     setAdding(null);
        // }
    };

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
                <ModalAddMenuItem
                    isOpen={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        setPage(0);
                    }}
                    onSave={(newItem) => {
                        // TODO: Gọi API thêm món mới vào hệ thống tại đây
                        console.log('Thêm món mới:', newItem);
                    }}
                />
            )}
        </div>
    );
};

export default MenuItemPage;
