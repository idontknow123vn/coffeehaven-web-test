import React, { useState, useEffect } from "react";
import {
    getShiftByBranchInWeek,
    addEmployeeToShift,
    getEmployeesNotManager,
    updateEmployeeShift,
    deleteEmployeeShift,
    reassignShift,
} from "../../services/manager";
import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../../components/LogoutButton";

const ShiftPage: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [shiftType, setShiftType] = useState<string>("");
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
    const {id: branchId} = useAuth(); // TODO: lấy branchId thực tế từ context hoặc props nếu cần
    // State cho ngày được chọn để xem tuần (mặc định là hôm nay)
    const [currentDate, setCurrentDate] = useState<string>(
        new Date().toISOString().slice(0, 10)
    );
    // Format ngày dạng yyyy-mm-dd
    const formatDate = (d: Date) => d.toISOString().slice(0, 10);
    // Hàm lấy danh sách ngày trong tuần (CN -> T7, CN là đầu tuần)
    function getWeekDates(date: Date): Date[] {
        const day = date.getDay(); // 0 (CN) -> 6 (T7)
        const diffToSunday = -day; // CN là đầu tuần
        const sunday = new Date(date);
        sunday.setDate(date.getDate() + diffToSunday);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            return d;
        });
    }
    // Lấy các ngày trong tuần hiện tại dựa trên currentDate
    const weekDates = getWeekDates(new Date(currentDate));

    // Định nghĩa type cho dữ liệu phân ca từ backend
    interface ShiftAssignment {
        employeeId: number;
        employeeName: string;
        shiftId: number;
        shiftInfo?: any;
        employeeRole?: string;
        branchId: number;
        shiftDate: string;
        isPresent?: boolean;
    }
    // State lưu dữ liệu phân ca thực tế từ backend
    const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>(
        []
    );
    // Format ngày dạng yyyy-mm-dd
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
    const [employees, setEmployees] = useState<
        { id: number; name: string; role?: string }[]
    >([]);

    // Mock data ca làm việc
    const shiftTypes = [
        { id: 1, name: "Ca sáng", start: "07:00", end: "11:00" },
        { id: 2, name: "Ca chiều", start: "13:00", end: "17:00" },
        { id: 3, name: "Ca tối", start: "18:00", end: "22:00" },
    ];

        // State filter ngày cho bảng dưới
    const [filterDate, setFilterDate] = useState<string>("");

    // State cho modal thay người làm trong cell bảng tuần
    const [reassignModal, setReassignModal] = useState<{
        date: string;
        shiftId: number;
        oldEmployeeId: number;
        oldEmployeeName: string;
    } | null>(null);
    const [newEmployeeId, setNewEmployeeId] = useState<number | null>(null);
    const [reassignLoading, setReassignLoading] = useState(false);

    // Lấy dữ liệu phân ca từ backend khi load hoặc đổi tuần
    useEffect(() => {
        getShiftByBranchInWeek(branchId, currentDate)
            .then((res) => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
    }, [currentDate, branchId]);

    // Lấy danh sách nhân viên không phải manager khi mở modal phân ca
    useEffect(() => {
        if (branchId && (showAddModal || reassignModal)) {
            getEmployeesNotManager(branchId)
                .then((res) => {
                    // Chỉ lấy id, name, role
                    const data = res.data.data.map((e: any) => ({
                        id: e.id,
                        name: e.name,
                        role: e.role,
                    }));
                    setEmployees(data);
                })
                .catch(() => setEmployees([]));
        }
    }, [showAddModal, reassignModal, branchId]);

    // Hàm lấy danh sách nhân viên cho ca/ngày từ shiftAssignments
    const getEmployeesForCell = (date: string, shiftId: number) => {
        return shiftAssignments
            .filter((a) => a.shiftId === shiftId && a.shiftDate === date)
            .map((a) => a.employeeName);
    };

    // Hàm mở modal sửa ô
    const handleEditCell = (date: string, shift: string, shiftId: number) => {
        const employeesInCell = shiftAssignments
            .filter((a) => a.shiftId === shiftId && a.shiftDate === date)
            .map((a) => a.employeeId);
        setEditCell({ date, shift, shiftId, employees: employeesInCell });
    };

    // Hàm lưu chỉnh sửa ca/ngày
    const handleSaveEditCell = async () => {
        if (!editCell) return;
        // Lấy danh sách nhân viên cũ cho ca/ngày này
        const oldAssignments = shiftAssignments.filter(
            (a) =>
                a.shiftId === editCell.shiftId && a.shiftDate === editCell.date
        );
        const oldEmployeeIds = oldAssignments.map((a) => a.employeeId);
        const newEmployeeIds = editCell.employees;

        // Nhân viên được thêm mới vào ca/ngày này (chuyển ca)
        const added = newEmployeeIds.filter(
            (id) => !oldEmployeeIds.includes(id)
        );

        // Gọi updateEmployeeShift cho từng nhân viên được thêm mới (chuyển ca)
        await Promise.all(
            added.map((empId) =>
                updateEmployeeShift(
                    empId,
                    "",
                    "",
                    editCell.shiftId,
                    editCell.date
                )
            )
        );
        // Sau khi lưu, reload lại dữ liệu phân ca tuần
        getShiftByBranchInWeek(branchId!, currentDate)
            .then((res) => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
        setEditCell(null);
    };

    const handleAddShift = async () => {
        if (!selectedDate || !shiftType || selectedEmployees.length === 0)
            return;
        // Lấy shiftId từ shiftType
        const shift = shiftTypes.find((s) => s.name === shiftType);
        if (!shift) return;
        await Promise.all(
            selectedEmployees.map((empId) =>
                addEmployeeToShift(shift.id, empId, selectedDate)
            )
        );
        // Sau khi thêm, reload lại dữ liệu phân ca tuần
        getShiftByBranchInWeek(branchId!, currentDate)
            .then((res) => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
        setShowAddModal(false);
        setSelectedDate("");
        setShiftType("");
        setSelectedEmployees([]);
    };

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
        getShiftByBranchInWeek(branchId!, currentDate)
            .then((res) => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
        setEditRow(null);
    };

    // Hàm xóa phân ca cho nhân viên
    const handleDeleteRow = async (assignment: ShiftAssignment) => {
        const confirm = window.confirm(
            `Bạn có chắc chắn muốn xóa phân ca của ${
                assignment.employeeName
            } - ${assignment.shiftInfo || assignment.shiftId} - ngày ${
                assignment.shiftDate
            }?`
        );
        if (!confirm) return;
        await deleteEmployeeShift(
            assignment.employeeId,
            assignment.shiftId,
            assignment.shiftDate
        );
        getShiftByBranchInWeek(branchId!, currentDate)
            .then((res) => setShiftAssignments(res.data.data))
            .catch(() => setShiftAssignments([]));
    };

    // Hàm kiểm tra ca đã qua hoặc đang diễn ra (dùng cho reassign)
    const isShiftPastOrOngoing = (shiftDate: string, shiftId: number) => {
        const now = new Date();
        const shift = shiftTypes.find(s => s.id === shiftId);
        if (!shift) return false;
        const start = new Date(`${shiftDate}T${shift.start}`);
        return now >= start; // Nếu đã qua giờ bắt đầu ca thì không cho thay người
    };

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Quản lý ca làm việc</h2>
                <LogoutButton />
            </div>
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">
                    Bảng phân ca theo tuần
                </h3>
                <div className="flex items-center gap-4 mb-4">
                    <button
                        className="px-3 py-1 bg-orange-500 text-white rounded"
                        onClick={() => {
                            // Lùi về 7 ngày
                            const prev = new Date(currentDate);
                            prev.setDate(prev.getDate() - 7);
                            setCurrentDate(formatDate(prev));
                        }}
                    >
                        Tuần trước
                    </button>
                    <span className="font-semibold text-lg">
                        {weekDates[0].toLocaleDateString("vi-VN")} -{" "}
                        {weekDates[6].toLocaleDateString("vi-VN")}
                    </span>
                    <button
                        className="px-3 py-1 bg-orange-500 text-white rounded"
                        onClick={() => {
                            // Tiến 7 ngày
                            const next = new Date(currentDate);
                            next.setDate(next.getDate() + 7);
                            setCurrentDate(formatDate(next));
                        }}
                    >
                        Tuần sau
                    </button>
                </div>
                <table className="w-full border-collapse mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left w-32">Ca / Ngày</th>
                            {weekDates.map((d, idx) => (
                                <th key={idx} className="p-2 text-center">
                                    {d.toLocaleDateString("vi-VN", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "2-digit",
                                    })}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shiftTypes.map((shift) => (
                            <tr key={shift.id} className="border-b">
                                <td className="p-2 font-medium">
                                    {shift.name}
                                </td>
                                {weekDates.map((d, idx) => {
                                    const dateStr = formatDate(d);
                                    const employeesInCell = getEmployeesForCell(
                                        dateStr,
                                        shift.id
                                    );
                                    // Lấy thông tin chi tiết nhân viên trong cell
                                    const employeeObjs =
                                        shiftAssignments.filter(
                                            (a) =>
                                                a.shiftId === shift.id &&
                                                a.shiftDate === dateStr
                                        );
                                    return (
                                        <td
                                            key={idx}
                                            className="p-2 text-sm text-center min-h-[40px] cursor-pointer hover:bg-orange-100 whitespace-pre-line"
                                            // Không mở modal sửa cell khi click vào tên nhân viên nữa
                                            onClick={(e) => {
                                                // Nếu click vào vùng trống (không phải tên nhân viên), mới mở modal sửa cell
                                                if (
                                                    (e.target as HTMLElement)
                                                        .dataset.empid ===
                                                    undefined
                                                ) {
                                                    handleEditCell(
                                                        dateStr,
                                                        shift.name,
                                                        shift.id
                                                    );
                                                }
                                            }}
                                        >
                                            {employeeObjs.length > 0 ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 2,
                                                    }}
                                                >
                                                    {employeeObjs.map(
                                                        (emp, i) => (
                                                            <span
                                                                key={
                                                                    emp.employeeId
                                                                }
                                                                data-empid={
                                                                    emp.employeeId
                                                                }
                                                                style={{
                                                                    color: "#1d3557",
                                                                    cursor: "pointer",
                                                                    textDecoration:
                                                                        emp.isPresent
                                                                            ? "underline"
                                                                            : "none",
                                                                    marginBottom: 2,
                                                                    display:
                                                                        "inline-block",
                                                                }}
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setReassignModal(
                                                                        {
                                                                            date: dateStr,
                                                                            shiftId:
                                                                                shift.id,
                                                                            oldEmployeeId:
                                                                                emp.employeeId,
                                                                            oldEmployeeName:
                                                                                emp.employeeName,
                                                                        }
                                                                    );
                                                                    setNewEmployeeId(
                                                                        null
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    emp.employeeName
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal chỉnh sửa ca/ngày trong bảng tuần */}
            {/* {editCell && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                        <h3 className="text-xl font-semibold mb-4">
                            Chỉnh sửa nhân viên cho {editCell.shift} ngày{" "}
                            {editCell.date}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Nhân viên
                            </label>
                            <select
                                multiple
                                value={editCell.employees.map(String)}
                                onChange={(e) => {
                                    const options = Array.from(
                                        e.target.selectedOptions
                                    ).map((opt) => Number(opt.value));
                                    setEditCell({
                                        ...editCell,
                                        employees: options,
                                    });
                                }}
                                className="w-full border rounded p-2 h-32"
                            >
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
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
            )} */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Phân ca làm việc</h2>
                <div className="flex items-center gap-2">
                    <label className="font-medium">Lọc theo ngày:</label>
                    <select
                        className="border rounded px-2 py-1"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        {weekDates.map((d) => (
                            <option key={formatDate(d)} value={formatDate(d)}>
                                {d.toLocaleDateString("vi-VN", {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "2-digit",
                                })}
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
                        ? shiftAssignments.filter(
                              (a) => a.shiftDate === filterDate
                          )
                        : shiftAssignments
                    ).map((a) => (
                        <tr
                            key={
                                a.shiftId +
                                "-" +
                                a.employeeId +
                                "-" +
                                a.shiftDate
                            }
                            className="border-b"
                        >
                            <td className="p-2">{a.shiftDate}</td>
                            <td className="p-2">{a.shiftInfo || a.shiftId}</td>
                            <td className="p-2">{a.employeeName}</td>
                            <td className="p-2">
                                <button
                                    className={`text-blue-500 hover:underline mr-2${isShiftPastOrOngoing(a.shiftDate, a.shiftId) ? ' opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                        if (!isShiftPastOrOngoing(a.shiftDate, a.shiftId)) handleEditRow(a);
                                    }}
                                    disabled={isShiftPastOrOngoing(a.shiftDate, a.shiftId)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className={`text-red-500 hover:underline${isShiftPastOrOngoing(a.shiftDate, a.shiftId) ? ' opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                        if (!isShiftPastOrOngoing(a.shiftDate, a.shiftId)) handleDeleteRow(a);
                                    }}
                                    disabled={isShiftPastOrOngoing(a.shiftDate, a.shiftId)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal sửa ca cho từng nhân viên ở bảng dưới */}
            {editRow && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                        <h3 className="text-xl font-semibold mb-4">
                            Chuyển ca cho {editRow.employeeId}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Ngày mới
                            </label>
                            <input
                                type="date"
                                value={editRow.newDate}
                                onChange={(e) =>
                                    setEditRow({
                                        ...editRow,
                                        newDate: e.target.value,
                                    })
                                }
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Ca mới
                            </label>
                            <select
                                value={editRow.newShiftId}
                                onChange={(e) =>
                                    setEditRow({
                                        ...editRow,
                                        newShiftId: Number(e.target.value),
                                    })
                                }
                                className="w-full border rounded p-2"
                            >
                                {shiftTypes.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.start} - {s.end})
                                    </option>
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
                        <h3 className="text-xl font-semibold mb-4">
                            Phân ca làm việc
                        </h3>
                        <table className="w-full mb-4">
                            <tbody>
                                <tr>
                                    <td className="py-2 pr-2 w-1/3">
                                        <label className="block text-sm font-medium">
                                            Ngày
                                        </label>
                                    </td>
                                    <td className="py-2">
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) =>
                                                setSelectedDate(e.target.value)
                                            }
                                            className="w-full border rounded p-2"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-2">
                                        <label className="block text-sm font-medium">
                                            Loại ca
                                        </label>
                                    </td>
                                    <td className="py-2">
                                        <select
                                            value={shiftType}
                                            onChange={(e) =>
                                                setShiftType(e.target.value)
                                            }
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">
                                                Chọn loại ca
                                            </option>
                                            {shiftTypes.map((s) => (
                                                <option
                                                    key={s.id}
                                                    value={s.name}
                                                >
                                                    {s.name} ({s.start} -{" "}
                                                    {s.end})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-2 align-top">
                                        <label className="block text-sm font-medium">
                                            Nhân viên
                                        </label>
                                    </td>
                                    <td className="py-2">
                                        <select
                                            multiple
                                            value={selectedEmployees.map(
                                                String
                                            )}
                                            onChange={(e) => {
                                                const options = Array.from(
                                                    e.target.selectedOptions
                                                ).map((opt) =>
                                                    Number(opt.value)
                                                );
                                                setSelectedEmployees(options);
                                            }}
                                            className="w-full border rounded p-2 h-32"
                                        >
                                            {employees.map((emp) => (
                                                <option
                                                    key={emp.id}
                                                    value={emp.id}
                                                >
                                                    {emp.name}
                                                </option>
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
            {/* Modal thay người làm trong cell bảng tuần */}
            {reassignModal && !isShiftPastOrOngoing(reassignModal.date, reassignModal.shiftId) && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                        <h3 className="text-xl font-semibold mb-4">
                            Thay người làm cho {reassignModal.oldEmployeeName} (
                            {reassignModal.date})
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Chọn nhân viên thay thế
                            </label>
                            <select
                                value={newEmployeeId ?? ""}
                                onChange={(e) =>
                                    setNewEmployeeId(Number(e.target.value))
                                }
                                className="w-full border rounded p-2"
                            >
                                <option value="">-- Chọn nhân viên --</option>
                                {employees
                                    .filter(
                                        (emp) =>
                                            emp.id !==
                                                reassignModal.oldEmployeeId &&
                                            emp.role ===
                                                shiftAssignments.find(
                                                    (a) =>
                                                        a.employeeId ===
                                                            reassignModal.oldEmployeeId &&
                                                        a.shiftId ===
                                                            reassignModal.shiftId &&
                                                        a.shiftDate ===
                                                            reassignModal.date
                                                )?.employeeRole
                                    )
                                    .map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setReassignModal(null)}
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                disabled={reassignLoading}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded"
                                disabled={!newEmployeeId || reassignLoading}
                                onClick={async () => {
                                    if (!reassignModal || !newEmployeeId)
                                        return;
                                    setReassignLoading(true);
                                    console.log('oldEmployeeId:', reassignModal.oldEmployeeId, 'newEmployeeId:', newEmployeeId, 'shiftId:', reassignModal.shiftId, 'date:', reassignModal.date);
                                    await reassignShift(
                                        reassignModal.oldEmployeeId,
                                        newEmployeeId,
                                        reassignModal.shiftId,
                                        reassignModal.date
                                    );
                                    setReassignLoading(false);
                                    setReassignModal(null);
                                    // Reload shift assignments
                                    getShiftByBranchInWeek(branchId, currentDate)
                                        .then((res) => setShiftAssignments(res.data.data))
                                        .catch(() => setShiftAssignments([]));
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftPage;
