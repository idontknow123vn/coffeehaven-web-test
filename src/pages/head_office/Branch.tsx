import { useCallback, useEffect, useState } from "react";
import { getBranches } from "../../services/head-office";
import ModalCreateBranch from "../../components/ModalCreateBranch";
import LogoutButton from "../../components/LogoutButton";
import ModalAddEmployee from "../../components/ModalAddEmployee";

// Định nghĩa type cho dữ liệu trả về từ API
interface ApiBranch {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    managerName: string;
    totalEmployees: number;
}

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    manager: string;
    employees: number;
}

const BranchesPage: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

    const fetchBranches = useCallback(async () => {
        try {
            const result = await getBranches();
            if (result.data) {
                setBranches((result.data.data as ApiBranch[]).map((branch) => ({
                    id: branch.id,
                    name: branch.name,
                    address: branch.address,
                    phone: branch.phoneNumber,
                    manager: branch.managerName,
                    employees: branch.totalEmployees,
                })));
            }
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Quản lý chi nhánh</h2>
                <LogoutButton />
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={() => setShowCreateModal(true)}>
                    Thêm chi nhánh
                </button>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">ID chi nhánh</th>
                        <th className="p-2 text-left">Tên chi nhánh</th>
                        <th className="p-2 text-left">Địa chỉ</th>
                        <th className="p-2 text-left">Số điện thoại</th>
                        <th className="p-2 text-left">Quản lý</th>
                        <th className="p-2 text-left">Số nhân viên</th>
                        {/* <th className="p-2 text-left">Doanh thu</th> */}
                        <th className="p-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {branches.map((branch, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2">{branch.id}</td>
                            <td className="p-2">{branch.name}</td>
                            <td className="p-2">{branch.address}</td>
                            <td className="p-2">{branch.phone}</td>
                            <td className="p-2">
                                {(!branch.manager || branch.manager === "No Manager Assigned") ? (
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                        onClick={() => {
                                            setSelectedBranchId(branch.id);
                                            setShowAssignManagerModal(true);
                                        }}
                                    >
                                        Bổ nhiệm quản lý
                                    </button>
                                ) : branch.manager}
                            </td>
                            <td className="p-2">{branch.employees}</td>
                            {/* <td className="p-2">{branch.revenue}</td> */}
                            <td className="p-2">👁️</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalCreateBranch
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={async () => {
                    setShowCreateModal(false);
                    await fetchBranches();
                }}
            />

            <ModalAddEmployee
                isOpen={showAssignManagerModal}
                onClose={() => setShowAssignManagerModal(false)}
                addType="Branch_Manager"
                branchId={selectedBranchId || 0}
                onAdd={async () => {
                    setShowAssignManagerModal(false);
                    await fetchBranches();
                }}
            />
        </div>
    );
};
export default BranchesPage;
