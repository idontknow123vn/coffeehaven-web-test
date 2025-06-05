import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/staff";
import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../../components/LogoutButton";

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
  const { id: branchId } = useAuth(); // Assuming useAuth provides the branch ID

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
        <LogoutButton />
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
    </div>
  );
};

export default Profile;
