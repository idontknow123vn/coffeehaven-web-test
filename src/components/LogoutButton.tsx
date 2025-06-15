import React from "react";
import { useNavigate } from "react-router-dom";
import { _logout } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

interface LogoutButtonProps {
  isProfile?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ isProfile = false }) => {
  const navigate = useNavigate();
  const { logout, name } = useAuth();

  const handleLogout = async () => {
    try {
      await _logout();
      logout(); // Xoá context, localStorage, v.v.
      navigate("/login");
    } catch (e) {
      alert("Đăng xuất thất bại!");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {!isProfile && (
        <span className="text-gray-700">Xin chào, {name}</span>
      )}
      <button
        onClick={handleLogout}
        className="bg-orange-500 text-gray px-4 py-2 rounded hover:bg-orange-600 transition"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default LogoutButton;
