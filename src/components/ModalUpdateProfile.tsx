import React, { useState, useEffect } from "react";
import { _updateProfile, _logout } from "../services/auth";
import LogoutButton from "./LogoutButton";

interface ModalUpdateProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    email: string;
    phoneNumber: string;
    role: string;
  } | null;
  onLogout: () => void;
}

const ModalUpdateProfile: React.FC<ModalUpdateProfileProps> = ({ isOpen, onClose, profile, onLogout }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setEmail(profile.email || "");
      setPhoneNumber(profile.phoneNumber || "");
    }
    setOldPassword("");
    setNewPassword("");
    setError("");
    setSuccess("");
  }, [profile, isOpen]);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await _updateProfile({
        email: email !== profile?.email ? email : null,
        phoneNumber: phoneNumber !== profile?.phoneNumber ? phoneNumber : null,
        oldPassword: oldPassword || null,
        newPassword: newPassword || null,
        userType: "EMPLOYEE"
      });
      const message = res?.data?.message || "";
      if (typeof message === "string") {
        if (message.includes("thành công")) {
          setSuccess(message);
          if ((email && email !== profile?.email) || newPassword) {
            setTimeout(() => {
              setSuccess("");
              onClose();
              _logout();
              onLogout();
            }, 1200);
          } else {
            setTimeout(() => {
              setSuccess("");
              onClose();
            }, 1200);
          }
        } else if (message.includes("Mật khẩu cũ không đúng")) {
          setError("Mật khẩu cũ không đúng");
        } else if (message.includes("Không có thông tin nào được cập nhật")) {
          setError("Không có thông tin nào được cập nhật");
        } else {
          setError(message);
        }
      } else {
        setError("Có lỗi xảy ra khi cập nhật thông tin.");
      }
    } catch (e) {
      setError("Có lỗi xảy ra khi cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h3 className="text-xl font-semibold mb-4">Cập nhật thông tin cá nhân</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mật khẩu cũ</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
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

export default ModalUpdateProfile;
