import React, { useState } from "react";
import { addEmployee } from "../services/manager";
import { addBranchManager } from "../services/head-office";
import { roles } from "../data/roles";

interface ModalAddEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: {
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    role: string;
    branchId: number;
  }) => void;
  branchId: number;
  addType: "employee" | "Branch_Manager";
}

const ModalAddEmployee: React.FC<ModalAddEmployeeProps> = ({ isOpen, onClose, onAdd, branchId, addType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState(addType === "Branch_Manager" ? "Branch_Manager" : "");
  const [salary, setSalary] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (addType === "employee") {
        const res = await addEmployee({ email, password, name, phoneNumber, role, branchId, salary });
        if (res && res.data && res.data.message == "Thêm thành công.") {
          onAdd({ email, password, name, phoneNumber, role, branchId });
        } else {
          alert("Thêm nhân viên thất bại!");
          return;
        }
      } else if (addType === "Branch_Manager") {
        const res = await addBranchManager({ email, password, name, phoneNumber, role: "Branch_Manager", branchId, salary });
        if (res && res.data && res.data.message == "Thêm thành công.") {
          onAdd({ email, password, name, phoneNumber, role: "Branch_Manager", branchId });
        } else {
          alert("Bổ nhiệm quản lý thất bại!");
          return;
        }
      }
      setEmail("");
      setPassword("");
      setName("");
      setPhoneNumber("");
      setRole(addType === "Branch_Manager" ? "Branch_Manager" : "");
      setSalary(0);
      onClose();
    } catch {
      alert("Có lỗi xảy ra khi thêm nhân sự!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h3 className="text-xl font-semibold mb-4">
          {addType === "Branch_Manager" ? "Thêm quản lý chi nhánh" : "Thêm nhân viên mới"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded p-2" required type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded p-2" required type="password" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full border rounded p-2" required />
          </div>
          {addType === "employee" && (
            <div>
              <label className="block text-sm font-medium mb-1">Chức vụ</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded p-2" required>
                <option value="">Chọn chức vụ</option>
                {Object.values(roles)
                  .filter(r => r.value !== "Branch_Manager" && r.value !== "Head_Office")
                  .map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
              </select>
            </div>
          )}
          {addType === "Branch_Manager" && (
            <input type="hidden" value="Branch_Manager" />
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Mức lương</label>
            <input value={salary} onChange={e => setSalary(Number(e.target.value))} className="w-full border rounded p-2" required type="number" min={0} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">Hủy</button>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">Thêm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddEmployee;
