import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getEmployeesByBranch, updateEmployeeSalary } from "../../services/manager";
import LogoutButton from "../../components/LogoutButton";
import ModalAddEmployee from "../../components/ModalAddEmployee";
import ModalUpdateSalary from "../../components/ModalUpdateSalary";
import { roles } from "../../data/roles";

const EmployeesPage: React.FC = () => {
  const [employeeFilter, setEmployeeFilter] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Array<Record<string, unknown>>>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateSalaryModal, setShowUpdateSalaryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Record<string, unknown> | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { id: branchId } = useAuth();

  const fetchEmployees = useCallback(async (role: string | null = employeeFilter, _page = page, _pageSize = pageSize) => {
    try {
      if (branchId) {
        const response = await getEmployeesByBranch(branchId, role, _page, _pageSize);
        setEmployees(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        console.log("Employees data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, [branchId, employeeFilter, page, pageSize]);

  useEffect(() => {
    fetchEmployees(employeeFilter, page, pageSize);
  }, [fetchEmployees, employeeFilter, page, pageSize]);

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Quản lý nhân viên</h2>
        <LogoutButton />
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <select
          value={employeeFilter ?? ''}
          onChange={e => {
            const value = e.target.value;
            setEmployeeFilter(value === '' ? null : value);
            setPage(0);
          }}
          className="border rounded p-2"
        >
          <option value="">Tất cả vai trò</option>
          {Object.values(roles).map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
        <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={() => setShowAddModal(true)}>Thêm nhân viên</button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Tên nhân viên</th>
            <th className="p-2 text-left">Vai trò</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Số điện thoại</th>
            {/* <th className="p-2 text-left">Số đơn</th>*/}
            <th className="p-2 text-left">Trạng thái</th> 
            <th className="p-2 text-left">Lương</th>
            <th className="p-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{String(employee.name ?? '')}</td>
              <td className="p-2">
                {roles[String(employee.role) as keyof typeof roles]?.label || String(employee.role ?? '-')}
              </td>
              <td className="p-2">{String(employee.email ?? '')}</td>
              <td className="p-2">{String(employee.phoneNumber ?? '')}</td>
              {/* <td className="p-2">{employee.orders}</td> */}
              <td className="p-2">
                <span className={employee.status === 'Active' ? 'text-green-500' : 'text-red-500'}>
                  {String(employee.status ?? '')}
                </span>
              </td>
              <td className="p-2">
                {employee.salary != null ? Number(employee.salary).toLocaleString() : '-'}
                {employee.role !== 'Branch_Manager' && employee.role !== 'Head_Office' && (
                  <button
                    className="ml-2 text-blue-500 underline text-xs"
                    onClick={() => {
                      setSelectedEmployee(employee as { id: number; name: string; salary?: number });
                      setShowUpdateSalaryModal(true);
                    }}
                  >
                    Cập nhật
                  </button>
                )}
              </td>
              {/* <td className="p-2">👁️</td> */}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`px-4 py-2 rounded ${page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white"}`}
        >
          Trang trước
        </button>
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className={`px-4 py-2 rounded ${page >= totalPages - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white"}`}
        >
          Trang sau
        </button>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          className="border rounded p-2"
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size} / trang</option>
          ))}
        </select>
      </div>

      <ModalAddEmployee
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async () => {
          setShowAddModal(false);
          await fetchEmployees();
        }}
        branchId={branchId ?? 0}
        addType="employee"
      />

      <ModalUpdateSalary
        isOpen={showUpdateSalaryModal}
        onClose={() => setShowUpdateSalaryModal(false)}
        employee={selectedEmployee as { id: number; name: string; salary?: number } | null}
        updateEmployeeSalary={updateEmployeeSalary}
        onSuccess={async () => {
          setShowUpdateSalaryModal(false);
          await fetchEmployees();
        }}
      />
    </div>
  );
};
export default EmployeesPage;