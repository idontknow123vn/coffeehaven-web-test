import React, { useState, useEffect } from "react";
import { getStaffShifts } from "../../services/staff";
import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../../components/LogoutButton";

const shiftTypes = [
    { id: 1, name: "Ca sáng", start: "07:00", end: "11:00" },
    { id: 2, name: "Ca chiều", start: "13:00", end: "17:00" },
    { id: 3, name: "Ca tối", start: "17:30", end: "21:30" },
];

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

const StaffShift: React.FC = () => {
    const { userId, name } = useAuth();
    const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const weekDates = getWeekDates(new Date(currentDate));
    const [shiftAssignments, setShiftAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        getStaffShifts(userId, weekDates[0].toISOString().slice(0, 10))
            .then((res) => {
                // res.data.data là mảng các ca trong tuần [{ shiftId, shiftInfo, shiftDate, ... }]
                // Gom nhóm theo ngày
                console.log("Shift assignments:", res.data);
                const byDate: Record<string, Array<any>> = {};
                (res.data || []).forEach((s: any) => {
                    if (!byDate[s.shiftDate]) byDate[s.shiftDate] = [];
                    byDate[s.shiftDate].push(s);
                });
                const all = weekDates.map((date) => {
                    const dateStr = date.toISOString().slice(0, 10);
                    return {
                        date: dateStr,
                        shifts: (byDate[dateStr] || []).map((s: any) => {
                            // shiftInfo là string
                            return {
                                shiftId: s.shiftId,
                                shiftType: s.shiftInfo || `Ca ${s.shiftId}`,
                                start: '',
                                end: '',
                            };
                        }),
                    };
                });
                setShiftAssignments(all);
            })
            .finally(() => setLoading(false));
    }, [userId, currentDate]);

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Lịch làm việc của tôi
                </h2>
                <LogoutButton />
            </div>
            <div className="mb-4 flex gap-2 items-center">
                <button
                    className="px-3 py-1 bg-orange-500 text-white rounded"
                    onClick={() => {
                        const prev = new Date(currentDate);
                        prev.setDate(prev.getDate() - 7);
                        setCurrentDate(prev.toISOString().slice(0, 10));
                    }}
                >
                    Tuần trước
                </button>
                <span className="font-semibold">
                    Tuần của {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
                </span>
                <button
                    className="px-3 py-1 bg-orange-500 text-white rounded"
                    onClick={() => {
                        const next = new Date(currentDate);
                        next.setDate(next.getDate() + 7);
                        setCurrentDate(next.toISOString().slice(0, 10));
                    }}
                >
                    Tuần sau
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-center">Thứ</th>
                            <th className="p-2 text-center">Ngày</th>
                            <th className="p-2 text-center">Ca làm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weekDates.map((date, idx) => {
                            const dateStr = date.toISOString().slice(0, 10);
                            const assignment = shiftAssignments.find((a) => a.date === dateStr);
                            return (
                                <tr key={dateStr} className="border-b">
                                    <td className="p-2 text-center font-semibold">
                                        {['CN','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'][date.getDay()]}
                                    </td>
                                    <td className="p-2 text-center">{dateStr}</td>
                                    <td className="p-2 text-center">
                                        {assignment && assignment.shifts.length > 0 ? (
                                            assignment.shifts.map((s: any, i: number) => (
                                                <div key={i} className="mb-1 px-2 py-1 bg-orange-100 rounded inline-block">
                                                    {s.shiftType}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-400">Không có ca</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {loading && <div className="mt-4 text-center text-orange-500">Đang tải dữ liệu...</div>}
        </div>
    );
};

export default StaffShift;