import { useCallback, useEffect, useState } from "react";
import { getBranches, changeBranchStatus } from "../../services/head-office";
import ModalCreateBranch from "../../components/ModalCreateBranch";
import LogoutButton from "../../components/LogoutButton";
// import ModalAddEmployee from "../../components/ModalAddEmployee";
import ModalChangeBranchManager from "../../components/ModalChangeBranchManager";
import ModalUpdateBranch from "../../components/ModalUpdateBranch";

// Định nghĩa type cho dữ liệu trả về từ API
interface ApiBranch {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    managerName: string;
    totalEmployees: number;
    multiplier?: number;
    isActive?: string; // Thêm trường status nếu cần
}

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    manager: string;
    employees: number;
    multiplier?: number;
    status?: string; // Thêm trường status nếu cần
}

const BranchesPage: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
    const [showChangeManagerModal, setShowChangeManagerModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [branchToUpdate, setBranchToUpdate] = useState<Branch | null>(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [total, setTotal] = useState(0);

    const fetchBranches = useCallback(async () => {
        try {
            const result = await getBranches(statusFilter, page, size);
            console.log('API result:', result.data); // log dữ liệu trả về
            if (result.data && Array.isArray(result.data.data)) {
                setBranches((result.data.data as ApiBranch[]).map((branch) => ({
                    id: branch.id,
                    name: branch.name,
                    address: branch.address,
                    phone: branch.phoneNumber,
                    manager: branch.managerName,
                    employees: branch.totalEmployees,
                    multiplier: branch.multiplier,
                    status: branch.isActive,
                })));
                setTotal(result.data.totalElements || 0);
            } else {
                setBranches([]);
                setTotal(0);
            }
        } catch (error) {
            console.error("Error fetching branches:", error);
            setBranches([]);
            setTotal(0);
        }
    }, [statusFilter, page, size]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const handleStatusClick = async (branch: Branch) => {
        if (branch.status === "Active") {
            if (window.confirm("Bạn có chắc muốn đóng cửa chi nhánh?")) {
                try {
                    await changeBranchStatus(branch.id);
                    await fetchBranches();
                } catch {
                    alert("Có lỗi xảy ra khi thay đổi trạng thái chi nhánh.");
                }
            }
        } else if (branch.status === "Inactive") {
            if (window.confirm("Bạn có chắc muốn mở lại chi nhánh này?")) {
                try {
                    await changeBranchStatus(branch.id);
                    await fetchBranches();
                } catch {
                    alert("Có lỗi xảy ra khi thay đổi trạng thái chi nhánh.");
                }
            }
        }
    };

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
                <select
                    className="border rounded px-2 py-1"
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Active">Đang hoạt động</option>
                    <option value="Inactive">Đã đóng cửa</option>
                </select>
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
                        <th className="p-2 text-left">Hệ số</th>
                        <th className="p-2 text-left">Trạng thái</th>
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
                                        className={`bg-blue-500 text-white px-3 py-1 rounded text-sm ${branch.status === 'Inactive' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => {
                                            if (branch.status === 'Inactive') return;
                                            setSelectedBranchId(branch.id);
                                            setShowAssignManagerModal(true);
                                        }}
                                        disabled={branch.status === 'Inactive'}
                                        title={branch.status === 'Inactive' ? 'Không thể bổ nhiệm quản lý cho chi nhánh đã đóng cửa' : ''}
                                    >
                                        Bổ nhiệm quản lý
                                    </button>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <p>{branch.manager}</p>
                                        <button
                                            className={`ml-2 text-blue-500 underline text-xs ${branch.status === 'Inactive' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => {
                                                if (branch.status === 'Inactive') return;
                                                setSelectedBranchId(branch.id);
                                                setShowChangeManagerModal(true);
                                            }}
                                            disabled={branch.status === 'Inactive'}
                                            title={branch.status === 'Inactive' ? 'Không thể đổi quản lý cho chi nhánh đã đóng cửa' : ''}
                                        >
                                            Đổi quản lý
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="p-2">{branch.employees}</td>
                            <td className="p-2">{branch.multiplier ?? '-'}</td>
                            <td
                                className={`p-2 select-none ${branch.status === 'Active' ? 'cursor-pointer hover:bg-yellow-100 text-green-700' : branch.status === 'Inactive' ? 'cursor-pointer hover:bg-blue-100 text-blue-700' : 'text-gray-400 cursor-not-allowed'}`}
                                onClick={() => (branch.status === 'Active' || branch.status === 'Inactive') && handleStatusClick(branch)}
                                title={branch.status === 'Active' ? 'Đóng cửa chi nhánh này' : branch.status === 'Inactive' ? 'Mở lại chi nhánh này' : 'Không thể thao tác'}
                            >
                                {branch.status || '-'}
                            </td>
                            <td className="p-2 flex gap-2">
                                <button
                                    className={`bg-gray-200 px-2 py-1 rounded text-xs border ${branch.status !== 'Active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={branch.status !== 'Active'}
                                    onClick={() => {
                                        if (branch.status !== 'Active') return;
                                        setBranchToUpdate(branch);
                                        setShowUpdateModal(true);
                                    }}
                                    title={branch.status !== 'Active' ? 'Chỉ sửa được chi nhánh đang hoạt động' : 'Sửa thông tin chi nhánh'}
                                >
                                    Sửa
                                </button>
                                {/* <span>👁️</span> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination UI chỉnh lại cho page bắt đầu từ 0 */}
            <div className="flex justify-center items-center mt-4 space-x-2 w-full">
                <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                >
                    Trang trước
                </button>
                <span>Trang {page + 1} / {Math.max(1, Math.ceil(total / size))}</span>
                <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(total / size) - 1}
                >
                    Trang sau
                </button>
                <select
                    className="border rounded px-2 py-1 ml-2"
                    value={size}
                    onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
                >
                    <option value={5}>5/trang</option>
                    <option value={10}>10/trang</option>
                    <option value={20}>20/trang</option>
                </select>
            </div>

            <ModalCreateBranch
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={async () => {
                    setShowCreateModal(false);
                    await fetchBranches();
                }}
            />

            {/* <ModalAddEmployee
                isOpen={showAssignManagerModal}
                onClose={() => setShowAssignManagerModal(false)}
                addType="Branch_Manager"
                branchId={selectedBranchId || 0}
                onAdd={async () => {
                    setShowAssignManagerModal(false);
                    await fetchBranches();
                }}
                // Truyền thêm danh sách nhân viên hiện tại của chi nhánh (nội bộ)
                employeesInBranch={branches.find(b => b.id === selectedBranchId)?.employees || 0}
                // Truyền thêm props để modal biết hiển thị 2 lựa chọn (nội bộ/ngoại bộ)
                enableInternalExternalOption={true}
            /> */}

            <ModalChangeBranchManager
                isOpen={showAssignManagerModal || showChangeManagerModal}
                branchId={selectedBranchId || 0}
                onClose={() => {
                    setShowAssignManagerModal(false);
                    setShowChangeManagerModal(false);
                }}
                onSuccess={async () => {
                    setShowAssignManagerModal(false);
                    setShowChangeManagerModal(false);
                    await fetchBranches();
                }}
                changeType={showAssignManagerModal ? "create" : "update"}
            />

            <ModalUpdateBranch
                isOpen={showUpdateModal}
                branch={branchToUpdate}
                onClose={() => setShowUpdateModal(false)}
                onUpdate={async () => {
                    setShowUpdateModal(false);
                    await fetchBranches();
                }}
            />
        </div>
    );
};
export default BranchesPage;
