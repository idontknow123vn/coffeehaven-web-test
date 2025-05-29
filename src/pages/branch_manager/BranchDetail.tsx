import { useEffect, useState } from "react";
import { getBranchDetails } from "../../services/manager";
import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../../components/LogoutButton";

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    manager: string;
    employees: number;
}

const BranchDetailsPage: React.FC = () => {
    const [branch, setBranch] = useState<Branch>();
    const { id: branchId } = useAuth(); // Simulated branch ID, replace with actual auth context or prop

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                if (!branchId) return;
                const result = await getBranchDetails(branchId);
                if (result.data) {
                    setBranch({
                        id: result.data.data.id,
                        name: result.data.data.name,
                        address: result.data.data.address,
                        phone: result.data.data.phoneNumber,
                        manager: result.data.data.managerName,
                        employees: result.data.data.totalEmployees,
                    });
                }
                console.log(`Fetching branches with filter: ${branchId}`);
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };
        fetchBranches();
    }, [branchId]);

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Quản lý chi nhánh</h2>
                <LogoutButton />
            </div>

            {/* Hiển thị thông tin chi nhánh dạng card/info block */}
            {branch ? (
                <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-orange-600">Thông tin chi nhánh</h3>
                    <div className="space-y-3">
                        <div className="flex"><span className="w-40 font-medium">ID chi nhánh:</span> <span>{branch.id}</span></div>
                        <div className="flex"><span className="w-40 font-medium">Tên chi nhánh:</span> <span>{branch.name}</span></div>
                        <div className="flex"><span className="w-40 font-medium">Địa chỉ:</span> <span>{branch.address}</span></div>
                        <div className="flex"><span className="w-40 font-medium">Số điện thoại:</span> <span>{branch.phone}</span></div>
                        <div className="flex"><span className="w-40 font-medium">Quản lý:</span> <span>{branch.manager}</span></div>
                        <div className="flex"><span className="w-40 font-medium">Số nhân viên:</span> <span>{branch.employees}</span></div>
                    </div>
                </div>
            ) : (
                <div>Đang tải thông tin chi nhánh...</div>
            )}
        </div>
    );
};
export default BranchDetailsPage;