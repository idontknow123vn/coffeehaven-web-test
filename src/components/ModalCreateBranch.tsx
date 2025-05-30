import React, { useState } from "react";
import { createBranch } from "../services/head-office";

interface ModalCreateBranchProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (branch: { name: string; address: string; phone: string }) => void;
}

const ModalCreateBranch: React.FC<ModalCreateBranchProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBranch({ 
        branchName: name, 
        branchAddress: address, 
        branchPhoneNumber: phone });
      onCreate({ name, address, phone });
      setName("");
      setAddress("");
      setPhone("");
      onClose();
    } catch (error) {
      alert("Tạo chi nhánh thất bại!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h3 className="text-xl font-semibold mb-4">Tạo chi nhánh mới</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên chi nhánh</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded p-2" required />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">Hủy</button>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">Tạo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateBranch;
