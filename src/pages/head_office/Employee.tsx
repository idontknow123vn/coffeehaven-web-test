import React, { useEffect, useState } from "react";
import { getBranches, getEmployeesByBranch, transferEmployeeToBranch } from "../../services/head-office";
import { roles } from "../../data/roles";
import LogoutButton from "../../components/LogoutButton";

interface Branch {
  id: number;
  name: string;
}

const HeadOfficeEmployeePage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Array<Record<string, unknown>>>([]);
  const [employeeFilter, setEmployeeFilter] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredEmployee, setHoveredEmployee] = useState<number | null>(null);
  const [showTransfer, setShowTransfer] = useState<{id: number, show: boolean}>({id: -1, show: false});
  const [transferBranch, setTransferBranch] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBranches().then(res => setBranches(res.data.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    getEmployeesByBranch(branchId, employeeFilter, page, pageSize)
      .then(res => {
        setEmployees(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [branchId, employeeFilter, page, pageSize]);

  const handleTransfer = async (employeeId: number) => {
    if (!transferBranch) return;
    await transferEmployeeToBranch(employeeId, transferBranch);
    setShowTransfer({id: -1, show: false});
    setTransferBranch(null);
    // Luôn reload danh sách nhân viên sau khi chuyển chi nhánh
    setLoading(true);
    getEmployeesByBranch(branchId, employeeFilter, page, pageSize)
      .then(res => {
        setEmployees(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold mb-4">Quản lý nhân sự toàn hệ thống</h2>
                <LogoutButton />
            </div>
      
      <div className="flex gap-4 mb-4">
        <select
          value={branchId ?? ''}
          onChange={e => {
            setBranchId(e.target.value === '' ? null : Number(e.target.value));
            setPage(0);
          }}
          className="border rounded p-2"
        >
          <option value="">Tất cả chi nhánh</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          value={employeeFilter ?? ''}
          onChange={e => {
            setEmployeeFilter(e.target.value === '' ? null : e.target.value);
            setPage(0);
          }}
          className="border rounded p-2"
        >
          <option value="">Tất cả vai trò</option>
          {Object.values(roles).map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="p-2 text-left">Tên nhân viên</th>
              <th className="p-2 text-left">Vai trò</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Số điện thoại</th>
              <th className="p-2 text-left">Trạng thái</th>
              <th className="p-2 text-left">Chi nhánh</th>
              <th className="p-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Đang tải...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">Không có nhân viên nào.</td></tr>
            ) : employees.map((employee, idx) => (
              <tr
                key={String(employee.id ?? idx)}
                className="border-b group hover:bg-orange-50"
                onMouseEnter={() => setHoveredEmployee(employee.id as number)}
                onMouseLeave={() => setHoveredEmployee(null)}
              >
                <td className="p-2 text-black">{String(employee.name ?? '')}</td>
                <td className="p-2 text-black">{roles[String(employee.role) as keyof typeof roles]?.label || String(employee.role ?? '-')}</td>
                <td className="p-2 text-black">{String(employee.email ?? '')}</td>
                <td className="p-2 text-black">{String(employee.phoneNumber ?? '')}</td>
                <td className="p-2 text-black">
                  <span className={employee.status === 'Active' ? 'text-green-500' : 'text-red-500'}>
                    {String(employee.status ?? '')}
                  </span>
                </td>
                <td className="p-2 text-black">{String(employee.branchName ?? '')}</td>
                <td className="p-2" style={{ position: 'relative' }}>
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      setShowTransfer({ id: employee.id as number, show: true });
                      setTransferBranch(null);
                    }}
                  >
                    Chuyển chi nhánh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`px-4 py-2 rounded text-black ${page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500"}`}
        >
          Trang trước
        </button>
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className={`px-4 py-2 rounded text-black ${page >= totalPages - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500"}`}
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

      {/* Modal chuyển chi nhánh */}
      {showTransfer.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white border rounded shadow p-6 min-w-[320px] relative">
            <h3 className="text-lg font-semibold mb-4">Chuyển chi nhánh nhân viên</h3>
            <select
              value={transferBranch ?? ''}
              onChange={e => setTransferBranch(Number(e.target.value))}
              className="border rounded p-2 mb-4 w-full"
            >
              <option value="">Chọn chi nhánh mới</option>
              {branches.filter(b => b.id !== employees.find(emp => emp.id === showTransfer.id)?.branchId).map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded text-sm"
                onClick={() => handleTransfer(showTransfer.id)}
                disabled={!transferBranch}
              >
                Xác nhận
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded text-sm"
                onClick={() => setShowTransfer({ id: -1, show: false })}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadOfficeEmployeePage;