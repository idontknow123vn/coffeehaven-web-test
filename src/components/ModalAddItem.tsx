import { useState, useEffect } from "react";
import { getMenuItemCategories } from "../services/menu-items";
import { createMenuItem } from "../services/head-office";

interface MenuItemCategory {
    id: number;
    name: string;
}

const ModalAddMenuItem: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [category, setCategory] = useState<MenuItemCategory | null>({
        id: 0,
        name: "Không có danh mục",
    });
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<MenuItemCategory[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const fetchCategories = async () => {
            try {
                const res = await getMenuItemCategories();
                setCategories(
                    res.data.map((cat: any) => ({
                        id: cat.id,
                        name: cat.categoryName,
                    })) || []
                );
                if (res.data && res.data.length > 0)
                    setCategory({
                        id: res.data[0].id,
                        name: res.data[0].categoryName,
                    });
                else setCategory({ id: 0, name: "Không có danh mục" });
            } catch (error) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, [isOpen]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!name.trim() || !price || !category || isNaN(Number(price))) {
                alert("Vui lòng nhập đầy đủ và đúng định dạng!");
                setLoading(false);
                return;
            }
            const formData = new FormData();
            formData.append(
                "data",
                new Blob(
                    [
                        JSON.stringify({
                            name: name.trim(),
                            price: Number(price),
                            categoryId: category.id,
                        }),
                    ],
                    { type: "application/json" }
                )
            );
            if (image) formData.append("image", image);
            const res = await createMenuItem(formData);
            const message = res?.data?.message || "Không rõ kết quả";
            if (message === "Tạo thành công.") {
                alert(message);
                setName("");
                setPrice("");
                setCategory(categories[0] || { id: 0, name: "Không có danh mục" });
                setImage(null);
                if (onSave) onSave();
                onClose();
            } else {
                alert(message);
            }
        } catch {
            alert("Thêm món thất bại!");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Thêm món mới</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Tên món
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên món"
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Giá
                        </label>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Nhập giá"
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Danh mục
                        </label>
                        <select
                            value={category?.id || 0}
                            onChange={(e) => {
                                const cat = categories.find(
                                    (c) => c.id === Number(e.target.value)
                                );
                                setCategory(
                                    cat || { id: 0, name: "Không có danh mục" }
                                );
                            }}
                            className="w-full border rounded p-2"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Hình ảnh
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setImage(
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                            className="w-full border rounded p-2"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-orange-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ModalAddMenuItem;
