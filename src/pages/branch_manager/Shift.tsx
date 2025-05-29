import React, { useState, useEffect } from "react";
import { getShiftByBranchInWeek, addEmployeeToShift, getEmployeesNotManager, updateEmployeeShift, deleteEmployeeShift } from "../../services/manager";

const ShiftPage: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [shiftType, setShiftType] = useState<string>("");
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
    // Định nghĩa type cho dữ liệu phân ca từ backend
    interface ShiftAssignment {
        employeeId: number;
        employeeName: string;
        shiftId: number;
        shiftInfo?: any;
        branchId: number;
        shiftDate: string;
    }
    // State lưu dữ liệu phân ca thực tế từ backend
    const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>([]);
    // Format ngày dạng yyyy-mm-dd
    const formatDate = (d: Date) => d.toISOString().slice(0, 10);
    // State tuần hiện tại (lấy ngày đầu tuần)
    const weekStart = (() => {
        const monday = getWeekDates(new Date())[0];
        return formatDate(monday);
    })();

    // State cho modal chỉnh sửa ô bảng tuần
    const [editCell, setEditCell] = useState<{
        date: string;
        shift: string;
        shiftId: number;
        employees: number[];
    } | null>(null);

    // State cho danh sách nhân viên không bao gồm manager
    const [employees, setEmployees] = useState<{ id: number; name: string; role?: string }[]>([]);

    // Mock data ca làm việc
    const shiftTypes = [
        { id: 1, name: "Ca sáng", start: "07:00", end: "11:00" },
        { id: 2, name: "Ca chiều", start: "13:00", end: "17:00" },
        { id: 3, name: "Ca tối", start: "18:00", end: "22:00" },
    ];
    const branchId = 1; // TODO: lấy branchId thực tế từ context hoặc props nếu cần

    // Lấy dữ liệu phân ca từ backend khi load hoặc đổi tuần
    useEffect(() => {
        getShiftByBranchInWeek(branchId, weekStart)
            .then(res => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
    }, [weekStart]);

    // Lấy danh sách nhân viên không phải manager khi mở modal phân ca
    useEffect(() => {
        if (showAddModal) {
            getEmployeesNotManager(branchId)
                .then(res => {
                    // Chỉ lấy id, name, role
                    const data = res.data.data.map((e: any) => ({ id: e.id, name: e.name, role: e.role }));
                    setEmployees(data);
                })
                .catch(() => setEmployees([]));
        }
    }, [showAddModal, branchId]);

    // Hàm lấy danh sách ngày trong tuần (thứ 2 -> CN)
    function getWeekDates(date: Date): Date[] {
        const day = date.getDay(); // 0 (CN) -> 6 (T7)
        const diffToMonday = (day === 0 ? -6 : 1) - day;
        const monday = new Date(date);
        monday.setDate(date.getDate() + diffToMonday);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });
    }
    // Lấy các ngày trong tuần hiện tại dựa trên weekStart
    const weekDates = getWeekDates(new Date(weekStart));

    // Hàm lấy danh sách nhân viên cho ca/ngày từ shiftAssignments
    const getEmployeesForCell = (date: string, shiftId: number) => {
        return shiftAssignments
            .filter(a => a.shiftId === shiftId && a.shiftDate === date)
            .map(a => a.employeeName);
    };

    // Hàm mở modal sửa ô
    const handleEditCell = (date: string, shift: string, shiftId: number) => {
        const employeesInCell = shiftAssignments
            .filter(a => a.shiftId === shiftId && a.shiftDate === date)
            .map(a => a.employeeId);
        setEditCell({ date, shift, shiftId, employees: employeesInCell });
    };

    // Hàm lưu chỉnh sửa ca/ngày
    const handleSaveEditCell = async () => {
        if (!editCell) return;
        // Lấy danh sách nhân viên cũ cho ca/ngày này
        const oldAssignments = shiftAssignments.filter(a => a.shiftId === editCell.shiftId && a.shiftDate === editCell.date);
        const oldEmployeeIds = oldAssignments.map(a => a.employeeId);
        const newEmployeeIds = editCell.employees;

        // Nhân viên được thêm mới vào ca/ngày này (chuyển ca)
        const added = newEmployeeIds.filter(id => !oldEmployeeIds.includes(id));

        // Gọi updateEmployeeShift cho từng nhân viên được thêm mới (chuyển ca)
        await Promise.all(
            added.map(empId => updateEmployeeShift(empId, "", "", editCell.shiftId, editCell.date))
        );
        // Sau khi lưu, reload lại dữ liệu phân ca tuần
        getShiftByBranchInWeek(branchId, weekStart)
            .then(res => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
        setEditCell(null);
    };

    const handleAddShift = async () => {
        if (!selectedDate || !shiftType || selectedEmployees.length === 0) return;
        // Lấy shiftId từ shiftType
        const shift = shiftTypes.find(s => s.name === shiftType);
        if (!shift) return;
        await Promise.all(
            selectedEmployees.map(empId =>
                addEmployeeToShift(shift.id, empId, selectedDate)
            )
        );
        // Sau khi thêm, reload lại dữ liệu phân ca tuần
        getShiftByBranchInWeek(branchId, weekStart)
            .then(res => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
        setShowAddModal(false);
        setSelectedDate("");
        setShiftType("");
        setSelectedEmployees([]);
    }

    // State cho modal sửa ca của từng nhân viên ở bảng dưới
    const [editRow, setEditRow] = useState<{
        employeeId: number;
        oldShiftId: number;
        oldDate: string;
        newShiftId: number;
        newDate: string;
    } | null>(null);

    // Hàm mở modal sửa ca cho từng nhân viên
    const handleEditRow = (assignment: ShiftAssignment) => {
        setEditRow({
            employeeId: assignment.employeeId,
            oldShiftId: assignment.shiftId,
            oldDate: assignment.shiftDate,
            newShiftId: assignment.shiftId,
            newDate: assignment.shiftDate,
        });
    };

    // Hàm lưu chuyển ca cho từng nhân viên
    const handleSaveEditRow = async () => {
        if (!editRow) return;
        await updateEmployeeShift(
            editRow.employeeId,
            editRow.oldShiftId.toString(),
            editRow.oldDate,
            editRow.newShiftId,
            editRow.newDate
        );
        getShiftByBranchInWeek(branchId, weekStart)
            .then(res => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
        setEditRow(null);
    };

    // Hàm xóa phân ca cho nhân viên
    const handleDeleteRow = async (assignment: ShiftAssignment) => {
        const confirm = window.confirm(`Bạn có chắc chắn muốn xóa phân ca của ${assignment.employeeName} - ${assignment.shiftInfo || assignment.shiftId} - ngày ${assignment.shiftDate}?`);
        if (!confirm) return;
        await deleteEmployeeShift(assignment.employeeId, assignment.shiftId, assignment.shiftDate);
        getShiftByBranchInWeek(branchId, weekStart)
            .then(res => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
    };

    // State filter ngày cho bảng dưới
    const [filterDate, setFilterDate] = useState<string>("");

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    Quản lý ca làm việc
                </h2>
                <div className="flex items-center space-x-4">
                    <span>Xin chào, User</span>
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        JW
                    </div>
                </div>
            </div>
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Bảng phân ca theo tuần</h3>
                <table className="w-full border-collapse mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left w-32">Ca / Ngày</th>
                            {weekDates.map((d, idx) => (
                                <th key={idx} className="p-2 text-center">
                                    {d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shiftTypes.map(shift => (
                            <tr key={shift.id} className="border-b">
                                <td className="p-2 font-medium">{shift.name}</td>
                                {weekDates.map((d, idx) => {
                                    const dateStr = formatDate(d);
                                    const employeesInCell = getEmployeesForCell(dateStr, shift.id);
                                    return (
                                        <td
                                            key={idx}
                                            className="p-2 text-sm text-center min-h-[40px] cursor-pointer hover:bg-orange-100 whitespace-pre-line"
                                            onClick={() => handleEditCell(dateStr, shift.name, shift.id)}
                                        >
                                            {employeesInCell.length > 0
                                                ? employeesInCell.join(",\n")
                                                : <span className="text-gray-400">-</span>}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal chỉnh sửa ca/ngày trong bảng tuần */}
            {editCell && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                        <h3 className="text-xl font-semibold mb-4">Chỉnh sửa nhân viên cho {editCell.shift} ngày {editCell.date}</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Nhân viên</label>
                            <select
                                multiple
                                value={editCell.employees.map(String)}
                                onChange={e => {
                                    const options = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                                    setEditCell({ ...editCell, employees: options });
                                }}
                                className="w-full border rounded p-2 h-32"
                            >
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setEditCell(null)}
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded"
                                onClick={handleSaveEditCell}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Phân ca làm việc</h2>
                <div className="flex items-center gap-2">
                    <label className="font-medium">Lọc theo ngày:</label>
                    <select
                        className="border rounded px-2 py-1"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        {weekDates.map(d => (
                            <option key={formatDate(d)} value={formatDate(d)}>
                                {d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowAddModal(true)}
                >
                    Phân ca
                </button>
            </div>
            <table className="w-full border-collapse mb-6">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">Ngày</th>
                        <th className="p-2 text-left">Loại ca</th>
                        <th className="p-2 text-left">Nhân viên</th>
                        <th className="p-2 text-left">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {(filterDate
                        ? shiftAssignments.filter(a => a.shiftDate === filterDate)
                        : shiftAssignments
                    ).map(a => (
                        <tr key={a.shiftId + '-' + a.employeeId + '-' + a.shiftDate} className="border-b">
                            <td className="p-2">{a.shiftDate}</td>
                            <td className="p-2">{a.shiftInfo || a.shiftId}</td>
                            <td className="p-2">{a.employeeName}</td>
                            <td className="p-2">
                                <button className="text-blue-500 hover:underline mr-2" onClick={() => handleEditRow(a)}>Sửa</button>
                                <button className="text-red-500 hover:underline" onClick={() => handleDeleteRow(a)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal sửa ca cho từng nhân viên ở bảng dưới */}
            {editRow && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                        <h3 className="text-xl font-semibold mb-4">Chuyển ca cho {editRow.employeeId}</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Ngày mới</label>
                            <input
                                type="date"
                                value={editRow.newDate}
                                onChange={e => setEditRow({ ...editRow, newDate: e.target.value })}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Ca mới</label>
                            <select
                                value={editRow.newShiftId}
                                onChange={e => setEditRow({ ...editRow, newShiftId: Number(e.target.value) })}
                                className="w-full border rounded p-2"
                            >
                                {shiftTypes.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.start} - {s.end})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setEditRow(null)}
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded"
                                onClick={handleSaveEditRow}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal phân ca */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                        <h3 className="text-xl font-semibold mb-4">Phân ca làm việc</h3>
                        <table className="w-full mb-4">
                            <tbody>
                                <tr>
                                    <td className="py-2 pr-2 w-1/3"><label className="block text-sm font-medium">Ngày</label></td>
                                    <td className="py-2">
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={e => setSelectedDate(e.target.value)}
                                            className="w-full border rounded p-2"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-2"><label className="block text-sm font-medium">Loại ca</label></td>
                                    <td className="py-2">
                                        <select
                                            value={shiftType}
                                            onChange={e => setShiftType(e.target.value)}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">Chọn loại ca</option>
                                            {shiftTypes.map(s => (
                                                <option key={s.id} value={s.name}>{s.name} ({s.start} - {s.end})</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-2 align-top"><label className="block text-sm font-medium">Nhân viên</label></td>
                                    <td className="py-2">
                                        <select
                                            multiple
                                            value={selectedEmployees.map(String)}
                                            onChange={e => {
                                                const options = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                                                setSelectedEmployees(options);
                                            }}
                                            className="w-full border rounded p-2 h-32"
                                        >
                                            {employees.map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded"
                                onClick={handleAddShift}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftPage;
