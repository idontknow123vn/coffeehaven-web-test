import React, { useEffect, useState } from "react";
import { getBranchDiscounts } from "../../services/manager";
import { useAuth } from "../../contexts/AuthContext";
import type { Discount } from "../../utils/Discount";
import ModalDiscountDetail from "../../components/ModalDiscountDetail";

const DiscountInBranch: React.FC = () => {
  const { id: branchId } = useAuth();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    if (!branchId) return;
    setLoading(true);
    getBranchDiscounts(branchId)
      .then((res) => setDiscounts(res.data.data || []))
      .finally(() => setLoading(false));
  }, [branchId]);

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-semibold mb-4">Mã giảm giá của chi nhánh</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Tên mã</th>
              <th className="p-2 text-left">Phần trăm giảm</th>
              <th className="p-2 text-left">Ngày bắt đầu</th>
              <th className="p-2 text-left">Ngày kết thúc</th>
              <th className="p-2 text-left">Trạng thái</th>
              <th className="p-2 text-left">Thể loại</th>
              <th className="p-2 text-left">Phạm vi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">Đang tải...</td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">Không có mã giảm giá nào.</td>
              </tr>
            ) : (
              discounts.map((d) => (
                <tr key={d.id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => { setSelectedDiscount(d); setShowDetailModal(true); }}>
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.discountPercentage}%</td>
                  <td className="p-2">{d.startDate}</td>
                  <td className="p-2">{d.endDate}</td>
                  <td className="p-2">
                    <span className={d.isActive ? "text-green-600 font-semibold" : "text-gray-400"}>
                      {d.isActive ? "Đang áp dụng" : "Ngừng áp dụng"}
                    </span>
                  </td>
                  <td className="p-2">
                    {d.discountType === "PRODUCT"
                      ? "Theo sản phẩm"
                      : d.discountType === "CATEGORY"
                      ? "Theo danh mục"
                      : d.discountType === "ORDER"
                      ? "Theo đơn hàng"
                      : ""}
                  </td>
                  <td className="p-2">
                    {d.isAppliedToAll ? "Tất cả chi nhánh" : "Một số chi nhánh"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showDetailModal && selectedDiscount && (
        <ModalDiscountDetail
          open={showDetailModal}
          discount={selectedDiscount}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default DiscountInBranch;