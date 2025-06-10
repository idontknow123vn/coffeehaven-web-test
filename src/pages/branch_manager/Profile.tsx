import React, { useEffect, useState } from "react";
// import { _updateProfile } from "../../services/auth";
import { getProfile } from "../../services/staff";
import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../../components/LogoutButton";
import ModalUpdateProfile from "../../components/ModalUpdateProfile";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  branchName?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { id: branchId } = useAuth(); // Assuming useAuth provides the branch ID
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải thông tin cá nhân.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-lg">Đang tải thông tin...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#8B4513]">Thông tin cá nhân</h2>
        <div className="flex gap-2 items-center">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded"
            onClick={() => setShowUpdateModal(true)}
          >
            Cập nhật
          </button>
          <LogoutButton />
        </div>
      </div>
      <div className="space-y-6 text-lg">
        <div className="flex items-center gap-4">
          <span className="w-40 font-semibold text-gray-700">Họ tên:</span>
          <span className="text-gray-900">{profile.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-40 font-semibold text-gray-700">Email:</span>
          <span className="text-gray-900">{profile.email}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-40 font-semibold text-gray-700">Số điện thoại:</span>
          <span className="text-gray-900">{profile.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-40 font-semibold text-gray-700">Chức vụ:</span>
          <span className="text-gray-900">{profile.role}</span>
        </div>
        {profile.branchName && (
          <div className="flex items-center gap-4">
            <span className="w-40 font-semibold text-gray-700">Chi nhánh:</span>
            <span className="text-gray-900">{profile.branchName}</span>
          </div>
        )}
      </div>
      <ModalUpdateProfile
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        profile={profile}
        onLogout={() => {
          setShowUpdateModal(false);
          setTimeout(() => {
            navigate("/login");
            window.location.reload();
          }, 300);
        }}
      />
    </div>
  );
};

export default Profile;
