import React, { useState } from "react";
import { _forgotPassword, _resetPassword } from "../services/auth";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await _forgotPassword(email);
      if (res?.data?.message === "Đã gửi mã OTP đến email của bạn.") {
        alert(res.data.message);
        setStep(2);
        setSuccess(res.data.message);
      } else {
        setError("Không thể gửi mã xác nhận. Vui lòng kiểm tra lại email.");
      }
    } catch {
      setError("Không thể gửi mã xác nhận. Vui lòng kiểm tra lại email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await _resetPassword(email, otp);
      if (res?.data?.message === "Đặt lại mật khẩu thành công. Hãy kiểm tra email của bạn.") {
        alert(res.data.message);
        setSuccess("");
      } else {
        setError("OTP hoặc email không đúng, hoặc có lỗi xảy ra.");
      }
    } catch {
      setError("OTP hoặc email không đúng, hoặc có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h2>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-center">{success}</div>}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded mt-4"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Mã xác nhận (OTP)</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="text-gray-500 text-sm mb-2">
              Sau khi xác nhận, mật khẩu mới sẽ được gửi về email của bạn.
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded mt-4"
              disabled={loading}
            >
              {loading ? "Đang xác nhận..." : "Xác nhận"}
            </button>
          </form>
        )}
        <div className="text-right mt-2">
          <Link to="/login" className="text-blue-500 underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;