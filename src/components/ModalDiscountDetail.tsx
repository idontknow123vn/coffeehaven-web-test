import React, { useEffect, useState, useRef } from "react";
import type { Discount } from "../utils/Discount";

interface ModalDiscountDetailProps {
  open: boolean;
  discount: Discount | null;
  onClose: () => void;
}

const ModalDiscountDetail: React.FC<ModalDiscountDetailProps> = ({ open, discount, onClose }) => {
  const [itemNames, setItemNames] = useState<string[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [branchNames, setBranchNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!discount) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setLoading(true);
      setItemNames([]);
      setCategoryNames([]);
      setBranchNames([]);

      // Xử lý tên sản phẩm: hỗ trợ cả object và array
      if (discount.discountType === "PRODUCT") {
        let names: string[] = [];
        if (Array.isArray(discount.itemNames)) {
          names = discount.itemNames.map((item: { id?: number; name?: string } | string) => typeof item === 'string' ? item : item?.name ?? '').filter(Boolean);
        } else if (discount.itemNames && typeof discount.itemNames === "object" && Object.keys(discount.itemNames).length > 0) {
          names = Object.values(discount.itemNames).flatMap(v => typeof v === 'string' ? [v] : []);
        }
        setItemNames(names.filter((v, i, arr) => v && arr.indexOf(v) === i));
      } else {
        setItemNames([]);
      }
      // Xử lý tên danh mục: hỗ trợ cả object, array, object array
      if (discount.discountType === "CATEGORY") {
        let names: string[] = [];
        if (Array.isArray(discount.categoryNames)) {
          // Nếu là mảng object [{id, categoryName}] hoặc string
          names = discount.categoryNames.map((item: { id?: number; categoryName?: string; name?: string } | string) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') return item.categoryName || item.name || '';
            return '';
          }).filter(Boolean);
        } else if (discount.categoryNames && typeof discount.categoryNames === "object" && Object.keys(discount.categoryNames).length > 0) {
          // Nếu là object dạng {id: name} hoặc {id: {categoryName: ...}}
          names = Object.values(discount.categoryNames).map((v) => {
            if (typeof v === 'string') return v;
            if (v && typeof v === 'object' && 'categoryName' in v) return (v as { categoryName: string }).categoryName;
            if (v && typeof v === 'object' && 'name' in v) return (v as { name: string }).name;
            return '';
          }).filter(Boolean);
        }
        setCategoryNames(names.filter((v, i, arr) => v && arr.indexOf(v) === i));
      } else {
        setCategoryNames([]);
      }
      // Xử lý tên chi nhánh: lấy trực tiếp từ discountBranchesInfo (có thể đã là chuỗi tên, có thể có \n)
      if (!discount.isAppliedToAll && discount.discountBranchesInfo) {
        // Nếu là JSON string array, parse và join, nếu là string tên thì dùng luôn
        let branchStr = discount.discountBranchesInfo;
        try {
          const parsed = JSON.parse(branchStr);
          if (Array.isArray(parsed)) {
            branchStr = parsed.join("\n");
          }
        } catch {
          // Nếu không phải JSON, giữ nguyên
        }
        setBranchNames(branchStr.split("\n").filter(v => v));
        setLoading(false);
        return;
      }
      setLoading(false);
    }, 200);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [discount]);

  if (!open || !discount) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-semibold mb-4">Chi tiết mã giảm giá</h2>
        {loading ? (
          <div className="text-center py-8">Đang tải dữ liệu...</div>
        ) : (
        <div className="space-y-2">
          {discount.name && <div><b>Tên mã:</b> {discount.name}</div>}
          {discount.discountPercentage !== undefined && <div><b>Phần trăm giảm:</b> {discount.discountPercentage}%</div>}
          {discount.startDate && <div><b>Ngày bắt đầu:</b> {discount.startDate}</div>}
          {discount.endDate && <div><b>Ngày kết thúc:</b> {discount.endDate}</div>}
          {discount.priceThreshold !== undefined && discount.discountType === "ORDER" && (
            <div><b>Ngưỡng giá trị đơn hàng áp dụng:</b> {discount.priceThreshold}</div>
          )}
          {discount.discountType && (
            <div><b>Thể loại:</b> {
              discount.discountType === "PRODUCT"
                ? "Theo sản phẩm"
                : discount.discountType === "CATEGORY"
                ? "Theo danh mục"
                : discount.discountType === "ORDER"
                ? "Theo đơn hàng"
                : ""
            }</div>
          )}
          {/* Hiển thị danh sách sản phẩm */}
          {discount.discountType === "PRODUCT" && (
            <div>
              <b>Sản phẩm áp dụng:</b><br />
              <span style={{ whiteSpace: 'pre-line' }}>{itemNames && itemNames.length > 0 ? itemNames.join("\n") : "(Không có dữ liệu sản phẩm)"}</span>
            </div>
          )}
          {/* Hiển thị danh sách danh mục */}
          {discount.discountType === "CATEGORY" && categoryNames.length > 0 && (
            <div><b>Danh mục áp dụng:</b><br />
              <span style={{ whiteSpace: 'pre-line' }}>{categoryNames.join("\n")}</span>
            </div>
          )}
          {discount.isActive !== undefined && (
            <div><b>Trạng thái:</b> <span className={discount.isActive ? "text-green-600 font-semibold" : "text-gray-400"}>{discount.isActive ? "Đang áp dụng" : "Ngừng áp dụng"}</span></div>
          )}
          {discount.isAppliedToAll !== undefined && (
            <div><b>Phạm vi:</b> {discount.isAppliedToAll ? "Tất cả chi nhánh" : "Một số chi nhánh"}</div>
          )}
          {/* Hiển thị danh sách chi nhánh */}
          {!discount.isAppliedToAll && branchNames.length > 0 && (
            <div><b>Chi nhánh áp dụng:</b><br />
              <span style={{ whiteSpace: 'pre-line' }}>{branchNames.join("\n")}</span>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default ModalDiscountDetail;