import React, { useEffect, useState } from "react";
import {
    getBranches,
    getDiscounts,
    updateDiscountActiveStatus,
    updateDiscountThreshold,
    updateDiscountByRatioAndDuration,
} from "../../services/head-office";
import type { Discount } from "../../utils/Discount";
import ModalAddDiscount from "../../components/ModalAddDiscount";
import ModalDiscountDetail from "../../components/ModalDiscountDetail";
import LogoutButton from "../../components/LogoutButton";

interface Branch {
    id: number;
    name: string;
}

const DiscountPage: React.FC = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [branchId, setBranchId] = useState<number | null>(null);
    const [discountType, setDiscountType] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
        null
    );
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [editRatio, setEditRatio] = useState<number>(0);
    const [editStartDate, setEditStartDate] = useState<string>("");
    const [editEndDate, setEditEndDate] = useState<string>("");
    const [editThreshold, setEditThreshold] = useState<number>(0);

    useEffect(() => {
        getBranches().then((res) => {
            setBranches(res.data.data || []);
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        // Sửa lại cách gọi getDiscounts: truyền 4 tham số rời, nếu null thì truyền giá trị mặc định
        getDiscounts(
            branchId ?? 0, // Nếu null thì truyền 0 (tất cả chi nhánh)
            discountType ?? "", // Nếu null thì truyền chuỗi rỗng (tất cả loại)
            page,
            pageSize
        )
            .then((res) => {
                // console.log("Discounts fetched:", res.data.data);
                setDiscounts(res.data.data || []);
                setTotalPages(res.data.totalPages || 1);
            })
            .finally(() => setLoading(false));
    }, [branchId, discountType, page, pageSize]);

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold mb-4">
                    Danh sách đợt giảm giá
                </h2>
                <LogoutButton />
            </div>

            <button
                className="mb-4 px-4 py-2 bg-orange-500 rounded hover:bg-orange-600"
                onClick={() => setShowAddModal(true)}
            >
                + Thêm đợt giảm giá
            </button>
            <ModalAddDiscount
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={() => {
                    setShowAddModal(false);
                    // Reload lại danh sách discount
                    setLoading(true);
                    getDiscounts(
                        branchId ?? 0,
                        discountType ?? "",
                        page,
                        pageSize
                    )
                        .then((res) => {
                            setDiscounts(res.data.data || []);
                            setTotalPages(res.data.totalPages || 1);
                        })
                        .finally(() => setLoading(false));
                }}
            />
            <div className="flex gap-4 mb-4">
                <select
                    value={branchId ?? ""}
                    onChange={(e) =>
                        setBranchId(
                            e.target.value === ""
                                ? null
                                : Number(e.target.value)
                        )
                    }
                    className="border rounded p-2"
                >
                    <option value="">Tất cả chi nhánh</option>
                    {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <select
                    value={discountType ?? ""}
                    onChange={(e) =>
                        setDiscountType(
                            e.target.value === "" ? null : e.target.value
                        )
                    }
                    className="border rounded p-2"
                >
                    <option value="">Tất cả thể loại</option>
                    <option value="PRODUCT">Theo sản phẩm</option>
                    <option value="CATEGORY">Theo danh mục</option>
                    <option value="ORDER">Theo đơn hàng</option>
                </select>
            </div>
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
                                <td colSpan={8} className="text-center py-4">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : discounts.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    Không có mã giảm giá nào.
                                </td>
                            </tr>
                        ) : (
                            discounts.map((d) => (
                                <tr
                                    key={d.id}
                                    className="border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setSelectedDiscount(d);
                                        setShowDetailModal(true);
                                    }}
                                >
                                    <td className="p-2">{d.name}</td>
                                    <td className="p-2">
                                        {d.discountPercentage}%
                                    </td>
                                    <td className="p-2">{d.startDate}</td>
                                    <td className="p-2">{d.endDate}</td>
                                    <td
                                        className="p-2 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateDiscountActiveStatus(
                                                d.id,
                                                !d.isActive
                                            ).then(() => {
                                                setLoading(true);
                                                getDiscounts(
                                                    branchId ?? 0,
                                                    discountType ?? "",
                                                    page,
                                                    pageSize
                                                )
                                                    .then((res) => {
                                                        setDiscounts(
                                                            res.data.data || []
                                                        );
                                                        setTotalPages(
                                                            res.data
                                                                .totalPages || 1
                                                        );
                                                    })
                                                    .finally(() =>
                                                        setLoading(false)
                                                    );
                                            });
                                        }}
                                    >
                                        <span
                                            className={
                                                d.isActive
                                                    ? "text-green-600 font-semibold"
                                                    : "text-gray-400"
                                            }
                                        >
                                            {d.isActive
                                                ? "Đang áp dụng"
                                                : "Ngừng áp dụng"}
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
                                        {d.isAppliedToAll
                                            ? "Tất cả chi nhánh"
                                            : "Một số chi nhánh"}
                                    </td>
                                    <td className="p-2">
                                        <button
                                            className="text-blue-500 underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDiscount(d);
                                                setEditRatio(
                                                    d.discountPercentage ?? 0
                                                );
                                                setEditStartDate(
                                                    d.startDate ?? ""
                                                );
                                                setEditEndDate(d.endDate ?? "");
                                                setEditThreshold(
                                                    d.priceThreshold ?? 0
                                                );
                                                setShowUpdateModal(true);
                                            }}
                                        >
                                            Sửa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4 gap-4">
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded ${
                        page === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-orange-500"
                    }`}
                >
                    Trang trước
                </button>
                <span>
                    Trang {page + 1} / {totalPages}
                </span>
                <button
                    onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                    className={`px-4 py-2 rounded ${
                        page >= totalPages - 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-orange-500"
                    }`}
                >
                    Trang sau
                </button>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(0);
                    }}
                    className="border rounded p-2"
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            {size} / trang
                        </option>
                    ))}
                </select>
            </div>
            {showUpdateModal && selectedDiscount && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
                        <button
                            className="absolute top-2 right-2 text-xl"
                            onClick={() => setShowUpdateModal(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                            Cập nhật mã giảm giá
                        </h2>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setUpdateLoading(true);
                                setUpdateError("");
                                try {
                                    await updateDiscountByRatioAndDuration(
                                        selectedDiscount.id,
                                        {
                                            discountPercentage: editRatio,
                                            startDate: editStartDate,
                                            endDate: editEndDate,
                                        }
                                    );
                                    if (
                                        selectedDiscount.discountType ===
                                        "ORDER"
                                    ) {
                                        await updateDiscountThreshold(
                                            selectedDiscount.id,
                                            editThreshold
                                        );
                                    }
                                    setShowUpdateModal(false);
                                    setLoading(true);
                                    getDiscounts(
                                        branchId ?? 0,
                                        discountType ?? "",
                                        page,
                                        pageSize
                                    )
                                        .then((res) => {
                                            setDiscounts(res.data.data || []);
                                            setTotalPages(
                                                res.data.totalPages || 1
                                            );
                                        })
                                        .finally(() => setLoading(false));
                                } catch {
                                    setUpdateError(
                                        "Có lỗi xảy ra khi cập nhật"
                                    );
                                } finally {
                                    setUpdateLoading(false);
                                }
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block font-medium mb-1">
                                    Phần trăm giảm giá (%)
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={editRatio}
                                    onChange={(e) =>
                                        setEditRatio(Number(e.target.value))
                                    }
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">
                                    Ngày bắt đầu
                                </label>
                                <input
                                    type="date"
                                    value={editStartDate}
                                    onChange={(e) =>
                                        setEditStartDate(e.target.value)
                                    }
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">
                                    Ngày kết thúc
                                </label>
                                <input
                                    type="date"
                                    value={editEndDate}
                                    onChange={(e) =>
                                        setEditEndDate(e.target.value)
                                    }
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>
                            {selectedDiscount.discountType === "ORDER" && (
                                <div>
                                    <label className="block font-medium mb-1">
                                        Ngưỡng giá trị đơn hàng áp dụng
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={editThreshold}
                                        onChange={(e) =>
                                            setEditThreshold(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="border rounded p-2 w-full"
                                        required
                                    />
                                </div>
                            )}
                            {updateError && (
                                <div className="text-red-500 text-sm">
                                    {updateError}
                                </div>
                            )}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-300"
                                    onClick={() => setShowUpdateModal(false)}
                                    disabled={updateLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-orange-500"
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? "Đang lưu..." : "Cập nhật"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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

export default DiscountPage;
