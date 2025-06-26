import React, { useState } from "react";
import { updateBranch } from "../services/head-office";

interface ModalUpdateBranchProps {
  isOpen: boolean;
  branch: {
    id: number;
    name: string;
    address: string;
    phone: string;
    multiplier?: number;
  } | null;
  onClose: () => void;
  onUpdate: (branch: { id: number; name: string; address: string; phone: string; multiplier?: number }) => void;
  loading?: boolean;
}

const ModalUpdateBranch: React.FC<ModalUpdateBranchProps> = ({ isOpen, branch, onClose, onUpdate, loading }) => {
  const [name, setName] = useState(branch?.name || "");
  const [address, setAddress] = useState(branch?.address || "");
  const [phone, setPhone] = useState(branch?.phone || "");
  const [multiplier, setMultiplier] = useState(branch?.multiplier || 1);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (branch) {
      setName(branch.name);
      setAddress(branch.address);
      setPhone(branch.phone);
      setMultiplier(branch.multiplier || 1);
    }
  }, [branch]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;
    setError("");
    try {
      await updateBranch(branch.id, { 
        branchName: name, 
        branchAddress: address, 
        branchPhoneNumber: phone, 
        multiplier });
      onUpdate({ id: branch.id, name, address, phone, multiplier });
      onClose();
    } catch (err: any) {
      setError("Cập nhật chi nhánh thất bại!");
    }
  };

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h3 className="text-xl font-semibold mb-4">Cập nhật chi nhánh</h3>
        <form onSubmit={handleUpdate} className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium mb-1">Hệ số</label>
            <input type="number" min={1} step={0.01} value={multiplier} onChange={e => setMultiplier(Number(e.target.value))} className="w-full border rounded p-2" required />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">Hủy</button>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded" disabled={loading}>Cập nhật</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUpdateBranch;
