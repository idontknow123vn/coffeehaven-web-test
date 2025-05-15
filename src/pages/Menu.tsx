import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getMenuItemsByBranch } from "../services/menu-items";

const MenuPage: React.FC = () => {
    const [branch, setBranch] = useState<string>("Tất cả");
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const { id: branchId } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number>(0);

    useEffect(() => {
        // Fetch menu items based on the selected page and pageSize
        const fetchMenuItems = async () => {
            try {
                if (branchId !== null) {
                    const result = await getMenuItemsByBranch(branchId, page, pageSize, categoryId);
                    setMenuItems(result.data);
                    setTotalPages(result.totalPages);
                }
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };
        fetchMenuItems();
    }, [branchId, page, pageSize, categoryId]);

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
                    onChange={(e) => 
                        {setCategoryId(Number(e.target.value));
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
                    {menuItems.map((item, index) => (
                        <tr key={item.id || index} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">{item.price}</td>
                            <td className="p-2">{item.orders ?? '-'}</td>
                            <td className="p-2">
                                <span
                                    className={
                                        item.available === true
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }
                                >
                                    {"Còn hàng" ?? '-'}
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
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded ${page === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 text-white'}`}
                >
                    Trang trước
                </button>
                <span className="px-4 py-2 bg-orange-500 text-white rounded">
                    Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
                </span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className={`px-4 py-2 rounded ${page >= totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 text-white'}`}
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
};
export default MenuPage;
