import React, { useEffect, useState } from "react";
import { getEmployeesNotManagers, changeBranchManager } from "../services/head-office";
import { roles } from "../data/roles";

interface ModalChangeBranchManagerProps {
  isOpen: boolean;
  branchId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Employee {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

const ModalChangeBranchManager: React.FC<ModalChangeBranchManagerProps> = ({ isOpen, branchId, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null);
  const [oldManagerNewRole, setOldManagerNewRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !branchId) return;
    setLoading(true);
    getEmployeesNotManagers(branchId)
      .then(res => setEmployees(res.data.data || []))
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
  }, [isOpen, branchId]);

  const handleChangeManager = async () => {
    if (!selectedManagerId || !oldManagerNewRole) return;
    setLoading(true);
    setError("");
    try {
      await changeBranchManager(branchId, selectedManagerId, oldManagerNewRole);
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      setError("Có lỗi xảy ra khi thay đổi quản lý chi nhánh.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h3 className="text-xl font-semibold mb-4">Thay đổi quản lý chi nhánh</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Chọn nhân viên làm quản lý mới</label>
          <select
            className="w-full border rounded p-2"
            value={selectedManagerId ?? ''}
            onChange={e => setSelectedManagerId(Number(e.target.value))}
            disabled={loading}
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.email ? `- ${emp.email}` : ""} {emp.phoneNumber ? `- ${emp.phoneNumber}` : ""} {emp.role && roles[emp.role as keyof typeof roles]?.label ? `- ${roles[emp.role as keyof typeof roles].label}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Chọn vai trò mới cho quản lý cũ</label>
          <select
            className="w-full border rounded p-2"
            value={oldManagerNewRole}
            onChange={e => setOldManagerNewRole(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Chọn vai trò --</option>
            {Object.keys(roles).filter(key => key !== "Branch_Manager").map(key => (
              <option key={key} value={key}>{roles[key as keyof typeof roles].label}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded"
            onClick={handleChangeManager}
            disabled={!selectedManagerId || !oldManagerNewRole || loading}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalChangeBranchManager;
