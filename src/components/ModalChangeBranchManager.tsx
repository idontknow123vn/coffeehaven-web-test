import React, { useEffect, useState } from "react";
import { getEmployeesNotManagers, changeBranchManager} from "../services/head-office";
import { addEmployee } from "../services/manager";
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
  
  // State cho lựa chọn từ trong chi nhánh hay ngoài chi nhánh
  const [selectionType, setSelectionType] = useState<"internal" | "external">("internal");
  
  // State cho form thêm nhân viên mới (ngoài chi nhánh)
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeePhone, setNewEmployeePhone] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeSalary, setNewEmployeeSalary] = useState("");

  useEffect(() => {
    if (!isOpen || !branchId) return;
    setLoading(true);
    getEmployeesNotManagers(branchId)
      .then(res => setEmployees(res.data.data || []))
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
  }, [isOpen, branchId]);  const handleChangeManager = async () => {
    if (selectionType === "internal") {
      if (!selectedManagerId || !oldManagerNewRole) return;    } else {
      if (!newEmployeeName || !newEmployeeEmail || !newEmployeePhone || !newEmployeePassword || !newEmployeeSalary || !oldManagerNewRole) return;
    }
    
    setLoading(true);
    setError("");
    try {
      if (selectionType === "internal") {
        await changeBranchManager(branchId, selectedManagerId!, oldManagerNewRole);
      } else {        const newEmployeeData = {
          name: newEmployeeName,
          email: newEmployeeEmail,
          phoneNumber: newEmployeePhone,
          password: newEmployeePassword,
          role: "Branch_Manager",
          salary: parseFloat(newEmployeeSalary),
          branchId: branchId,
          oldManagerNewRole: oldManagerNewRole,
        };
        
        await addEmployee(newEmployeeData);
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setError("Có lỗi xảy ra khi thay đổi quản lý chi nhánh.");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
        <h3 className="text-xl font-semibold mb-4">Thay đổi quản lý chi nhánh</h3>
        
        {/* Lựa chọn từ trong chi nhánh hay ngoài chi nhánh */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Lựa chọn nguồn quản lý mới</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="selectionType"
                value="internal"
                checked={selectionType === "internal"}
                onChange={() => setSelectionType("internal")}
                className="mr-2"
              />
              Từ trong chi nhánh
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="selectionType"
                value="external"
                checked={selectionType === "external"}
                onChange={() => setSelectionType("external")}
                className="mr-2"
              />
              Từ ngoài chi nhánh (tạo mới)
            </label>
          </div>
        </div>

        {selectionType === "internal" ? (
          // Form chọn từ trong chi nhánh
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
        ) : (
          // Form tạo nhân viên mới
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Họ và tên *</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={newEmployeeName}
                onChange={e => setNewEmployeeName(e.target.value)}
                disabled={loading}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={newEmployeeEmail}
                onChange={e => setNewEmployeeEmail(e.target.value)}
                disabled={loading}
                placeholder="Nhập email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={newEmployeePhone}
                onChange={e => setNewEmployeePhone(e.target.value)}
                disabled={loading}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Mật khẩu *</label>
              <input
                type="password"
                className="w-full border rounded p-2"
                value={newEmployeePassword}
                onChange={e => setNewEmployeePassword(e.target.value)}
                disabled={loading}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Lương *</label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={newEmployeeSalary}
                onChange={e => setNewEmployeeSalary(e.target.value)}
                disabled={loading}
                placeholder="Nhập lương"
              />
            </div>
          </>
        )}
        
        {/* Vai trò mới cho quản lý cũ */}
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
            disabled={
              loading || 
              !oldManagerNewRole ||
              (selectionType === "internal" && !selectedManagerId) ||
              (selectionType === "external" && (!newEmployeeName || !newEmployeeEmail || !newEmployeePhone || !newEmployeePassword || !newEmployeeSalary))
            }
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalChangeBranchManager;
