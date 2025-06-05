import React, { useEffect, useState } from "react";
import {
  getItemsCurrentlyBeingSold,
  getCategoriesCurrentlyBeingSold,
  getBranches,
  createDiscount,
} from "../services/head-office";
import type { MenuItem } from "../utils/MenuItem";

interface ModalAddDiscountProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Category {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

const ModalAddDiscount: React.FC<ModalAddDiscountProps> = ({ open, onClose, onSuccess }) => {
  const [discountType, setDiscountType] = useState<string>("");
  const [priceThreshold, setPriceThreshold] = useState<number | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [name, setName] = useState("");
  const [isAppliedToAll, setIsAppliedToAll] = useState(true);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [itemSearch, setItemSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  useEffect(() => {
    if (!open) return;
    getBranches().then((res) => setBranches(res.data.data || []));
  }, [open]);

  useEffect(() => {
    if (discountType === "PRODUCT") {
      getItemsCurrentlyBeingSold().then((res) => setItems(res.data.data || []));
    } else if (discountType === "CATEGORY") {
      getCategoriesCurrentlyBeingSold().then((res) => setCategories(res.data.data || []));
    }
  }, [discountType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: {
        name: string;
        discountPercentage: number;
        discountType: string;
        isAppliedToAll: boolean;
        branchIds: number[];
        startDate: string;
        endDate: string;
        itemIds?: number[];
        categoryIds?: number[];
        priceThreshold?: number;
        isActive: boolean;
      } = {
        name,
        discountPercentage: discountPercent,
        discountType,
        isAppliedToAll,
        branchIds: isAppliedToAll ? [] : selectedBranches,
        startDate,
        endDate,
        isActive: true,
      };
      if (discountType === "PRODUCT" && selectedItemIds.length > 0) payload.itemIds = selectedItemIds;
      if (discountType === "CATEGORY" && selectedCategoryIds.length > 0) payload.categoryIds = selectedCategoryIds;
      if (discountType === "ORDER" && priceThreshold) payload.priceThreshold = priceThreshold;
      const res = await createDiscount(payload);
      if (res.data?.message) alert(res.data.message);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setError("Có lỗi xảy ra khi tạo mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-semibold mb-4">Tạo mã giảm giá mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Loại mã giảm giá</label>
            <select
              value={discountType}
              onChange={e => {
                setDiscountType(e.target.value);
                setSelectedItemIds([]);
                setSelectedCategoryIds([]);
                setItemSearch("");
                setCategorySearch("");
                setPriceThreshold(null);
              }}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Chọn loại</option>
              <option value="PRODUCT">Theo sản phẩm</option>
              <option value="CATEGORY">Theo danh mục</option>
              <option value="ORDER">Theo đơn hàng</option>
            </select>
          </div>
          {discountType === "PRODUCT" && (
            <div>
              <label className="block font-medium mb-1">Chọn sản phẩm</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={itemSearch}
                  onChange={e => setItemSearch(e.target.value)}
                  className="border rounded p-2 flex-1"
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => setSelectedItemIds(items.map(i => i.id))}
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => setSelectedItemIds([])}
                >
                  Bỏ chọn
                </button>
              </div>
              <select
                multiple
                value={selectedItemIds.map(String)}
                onChange={e => {
                  const options = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                  setSelectedItemIds(options);
                }}
                className="border rounded p-2 w-full h-32"
                required
              >
                {items.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase())).map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          )}
          {discountType === "CATEGORY" && (
            <div>
              <label className="block font-medium mb-1">Chọn danh mục</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Tìm danh mục..."
                  value={categorySearch}
                  onChange={e => setCategorySearch(e.target.value)}
                  className="border rounded p-2 flex-1"
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => setSelectedCategoryIds(categories.map(c => c.id))}
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => setSelectedCategoryIds([])}
                >
                  Bỏ chọn
                </button>
              </div>
              <select
                multiple
                value={selectedCategoryIds.map(String)}
                onChange={e => {
                  const options = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                  setSelectedCategoryIds(options);
                }}
                className="border rounded p-2 w-full h-32"
                required
              >
                {categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase())).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}
          {discountType === "ORDER" && (
            <div>
              <label className="block font-medium mb-1">Ngưỡng giá trị đơn hàng áp dụng</label>
              <input
                type="number"
                min={0}
                value={priceThreshold ?? ""}
                onChange={e => setPriceThreshold(Number(e.target.value))}
                className="border rounded p-2 w-full"
                required
              />
            </div>
          )}
          <div>
            <label className="block font-medium mb-1">Tên mã giảm giá</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phần trăm giảm giá (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={discountPercent}
              onChange={e => setDiscountPercent(Number(e.target.value))}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phạm vi áp dụng</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  checked={isAppliedToAll}
                  onChange={() => setIsAppliedToAll(true)}
                />
                <span className="ml-2">Áp dụng cho toàn chi nhánh</span>
              </label>
              <label>
                <input
                  type="radio"
                  checked={!isAppliedToAll}
                  onChange={() => setIsAppliedToAll(false)}
                />
                <span className="ml-2">Áp dụng cho một số chi nhánh</span>
              </label>
            </div>
          </div>
          {!isAppliedToAll && (
            <div>
              <label className="block font-medium mb-1">Chọn chi nhánh áp dụng</label>
              <select
                multiple
                value={selectedBranches.map(String)}
                onChange={e => {
                  const options = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                  setSelectedBranches(options);
                }}
                className="border rounded p-2 w-full h-32"
                required
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block font-medium mb-1">Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Ngày kết thúc</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-orange-500 text-white"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Tạo mã giảm giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddDiscount;