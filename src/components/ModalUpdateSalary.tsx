import React, { useState } from "react";

interface ModalUpdateSalaryProps {
  isOpen: boolean;
  onClose: () => void;
  employee: { id: number; name: string; salary?: number } | null;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
  updateEmployeeSalary: (employeeId: number, salary: number) => Promise<any>;
}

const ModalUpdateSalary: React.FC<ModalUpdateSalaryProps> = ({ isOpen, onClose, employee, onSuccess, onError, updateEmployeeSalary }) => {
  const [salary, setSalary] = useState<string>(employee?.salary?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    setSalary(employee?.salary?.toString() || "");
    setError("");
    setSuccess("");
  }, [employee, isOpen]);

  const handleUpdate = async () => {
    if (!employee || !salary || isNaN(Number(salary))) {
      setError("Vui lòng nhập lương hợp lệ.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await updateEmployeeSalary(employee.id, Number(salary));
      const message = res?.data?.message || "";
      if (typeof message === "string" && message.includes("thành công")) {
        setSuccess(message);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccess("");
          onClose();
        }, 1000);
      } else {
        setError(message || "Cập nhật lương thất bại.");
        if (onError) onError(message || "Cập nhật lương thất bại.");
      }
    } catch (e) {
      setError("Có lỗi xảy ra khi cập nhật lương.");
      if (onError) onError("Có lỗi xảy ra khi cập nhật lương.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h3 className="text-xl font-semibold mb-4">Cập nhật lương cho {employee.name}</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Lương mới</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={salary}
            onChange={e => setSalary(e.target.value)}
            disabled={loading}
            min={0}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
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
            onClick={handleUpdate}
            disabled={loading}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateSalary;
