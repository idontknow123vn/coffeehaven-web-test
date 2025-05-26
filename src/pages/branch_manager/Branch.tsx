import { useState } from "react";

const BranchesPage: React.FC = () => {
    const [branchFilter, setBranchFilter] = useState<string>("Tất cả");

    const branchesData = [
        {
            name: "Haven cs1",
            address: "123 Nguyễn Lương Bằng",
            manager: "Trần Văn A",
            employees: 15,
            revenue: "50M VND",
        },
        {
            name: "Haven cs2",
            address: "23 Lê Lợi",
            manager: "Nguyễn Văn B",
            employees: 12,
            revenue: "20M VND",
        },
        {
            name: "Haven cs3",
            address: "154 Hàm Nghi",
            manager: "Lê Thị C",
            employees: 20,
            revenue: "60M VND",
        },
    ];

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Quản lý chi nhánh</h2>
                <div className="flex items-center space-x-4">
                    <span>Xin chào, User</span>
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        JW
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
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
                        <th className="p-2 text-left">Tên chi nhánh</th>
                        <th className="p-2 text-left">Địa chỉ</th>
                        <th className="p-2 text-left">Quản lý</th>
                        <th className="p-2 text-left">Số nhân viên</th>
                        <th className="p-2 text-left">Doanh thu</th>
                        <th className="p-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {branchesData.map((branch, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2">{branch.name}</td>
                            <td className="p-2">{branch.address}</td>
                            <td className="p-2">{branch.manager}</td>
                            <td className="p-2">{branch.employees}</td>
                            <td className="p-2">{branch.revenue}</td>
                            <td className="p-2">👁️</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default BranchesPage;
