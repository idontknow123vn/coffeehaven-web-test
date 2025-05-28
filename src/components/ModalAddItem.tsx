import { useState } from "react";

const ModalAddMenuItem: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (newItem: {
        name: string;
        price: string;
        category: string;
        image: File | null;
    }) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [category, setCategory] = useState<string>("Cà phê");
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onSave({ name, price, category, image });
        setName("");
        setPrice("");
        setCategory("Cà phê");
        setImage(null);
        onClose();
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
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option>Cà phê</option>
                            <option>Trà</option>
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
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ModalAddMenuItem;
