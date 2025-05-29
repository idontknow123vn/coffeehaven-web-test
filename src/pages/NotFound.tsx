import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Không tìm thấy trang</h2>
      <p className="mb-6 text-gray-600">Trang bạn truy cập không tồn tại hoặc đã bị di chuyển.</p>
      <a href="/" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">Về trang chủ</a>
    </div>
  );
};

export default NotFound;
