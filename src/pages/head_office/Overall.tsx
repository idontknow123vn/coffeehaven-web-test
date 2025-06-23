import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {
    getMonthlyRevenueByBranch,
    getBranches,
    getOverallMonthlyRevenue,
    getTotalActiveEmployees,
} from "../../services/head-office";
import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../../components/LogoutButton";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const dayOfWeekMap: Record<string, string> = {
    Monday: "Thứ 2",
    Tuesday: "Thứ 3",
    Wednesday: "Thứ 4",
    Thursday: "Thứ 5",
    Friday: "Thứ 6",
    Saturday: "Thứ 7",
    Sunday: "CN",
};

const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const RevenueSum: React.FC = () => {
    const { id: branchId } = useAuth();
    // const [weekRevenue, setWeekRevenue] = useState(0);
    // const [dailyRevenue, setDailyRevenue] = useState<
    //     {
    //         day: string;
    //         value: number;
    //         date: string;
    //     }[]
    // >([]);
    // State cho doanh thu tháng
    const [selectedMonth, setSelectedMonth] = useState<number>(
        new Date().getMonth() + 1
    );
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );
    const [monthRevenue, setMonthRevenue] = useState<number[]>([]); // doanh thu từng ngày trong tháng
    const [monthLabels, setMonthLabels] = useState<string[]>([]); // nhãn ngày

    // State cho chi nhánh
    const [branches, setBranches] = useState<{ id: number; name: string }[]>(
        []
    );
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

    // State cho doanh thu toàn hệ thống
    const [overallMonthRevenue, setOverallMonthRevenue] = useState<number[]>(
        []
    );
    const [overallMonthLabels, setOverallMonthLabels] = useState<string[]>([]);

    // State cho tổng số nhân viên đang hoạt động
    const [totalActiveEmployees, setTotalActiveEmployees] = useState<number>(0);
    const [overallMonthOrderCount, setOverallMonthOrderCount] =
        useState<number>(0);
    // Lấy danh sách chi nhánh khi mount
    useEffect(() => {
        getBranches()
            .then((res) => {
                setBranches(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedBranch(res.data.data[0].id);
                }
            })
            .catch(() => setBranches([]));
    }, []);

    // Sửa fetchMonthRevenue để dùng selectedBranch thay vì branchId
    useEffect(() => {
        const fetchMonthRevenue = async () => {
            if (!selectedBranch) return;
            try {
                const res = await getMonthlyRevenueByBranch(
                    selectedBranch,
                    selectedMonth,
                    selectedYear
                );
                const daysInMonth = new Date(
                    selectedYear,
                    selectedMonth,
                    0
                ).getDate();
                const labelArr = Array.from(
                    { length: daysInMonth },
                    (_, i) => `${i + 1}`
                );
                setMonthLabels(labelArr);
                const revenueArr = labelArr.map((day) => {
                    const dateStr = `${selectedYear}-${String(
                        selectedMonth
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const found = (
                        res.data.data as Array<{
                            date: string;
                            totalRevenue: number;
                        }>
                    ).find((d) => d.date === dateStr);
                    return found ? found.totalRevenue : 0;
                });
                setMonthRevenue(revenueArr);
            } catch {
                setMonthLabels([]);
                setMonthRevenue([]);
            }
        };
        fetchMonthRevenue();
    }, [selectedBranch, selectedMonth, selectedYear]);

    // Fetch overall system revenue for the month (all branches combined)
    useEffect(() => {
        const fetchOverallMonthRevenue = async () => {
            try {
                const res = await getOverallMonthlyRevenue(
                    selectedMonth,
                    selectedYear
                );
                const daysInMonth = new Date(
                    selectedYear,
                    selectedMonth,
                    0
                ).getDate();
                const labelArr = Array.from(
                    { length: daysInMonth },
                    (_, i) => `${i + 1}`
                );
                setOverallMonthLabels(labelArr);
                const revenueArr = labelArr.map((day) => {
                    const dateStr = `${selectedYear}-${String(
                        selectedMonth
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const found = (
                        res.data.data as Array<{
                            date: string;
                            totalRevenue: number;
                        }>
                    ).find((d) => d.date === dateStr);
                    return found ? found.totalRevenue : 0;
                });
                setOverallMonthRevenue(revenueArr);
                const totalOrder = (
                    res.data.data as Array<{ totalOrder: number }>
                ).reduce((sum, d) => sum + (d.totalOrder ?? 0), 0);
                setOverallMonthOrderCount(totalOrder);
            } catch {
                setOverallMonthLabels([]);
                setOverallMonthRevenue([]);
                setOverallMonthOrderCount(0);
            }
        };
        fetchOverallMonthRevenue();
    }, [selectedMonth, selectedYear]);

    // Lấy tổng số nhân viên đang hoạt động
    useEffect(() => {
        const fetchTotalActiveEmployees = async () => {
            try {
                const res = await getTotalActiveEmployees();
                setTotalActiveEmployees(res.data.data ?? 0);
            } catch {
                setTotalActiveEmployees(0);
            }
        };
        fetchTotalActiveEmployees();
    }, []);

    // Tổng doanh thu tháng này (toàn hệ thống)
    const totalRevenueThisMonth = overallMonthRevenue.reduce(
        (sum, v) => sum + v,
        0
    );

    // Chart data
    // const chartData = {
    //     labels: dailyRevenue.map((d) => d.day),
    //     datasets: [
    //         {
    //             label: "Doanh thu (VNĐ)",
    //             data: dailyRevenue.map((d) => d.value),
    //             backgroundColor: "#fb923c",
    //             borderRadius: 6,
    //         },
    //     ],
    // };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx: { parsed: { y: number } }) =>
                        ctx.parsed.y.toLocaleString("vi-VN") + " VNĐ",
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: number | string) =>
                        Number(value).toLocaleString("vi-VN"),
                },
            },
        },
    };

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Tổng quan doanh thu
                </h2>
                <LogoutButton />
            </div>

            <div className="mb-10">
                <div className="flex gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 flex-1 text-center">
                        <div className="text-gray-500 mb-2">
                            Doanh thu tháng này
                        </div>
                        <div className="text-3xl font-bold text-orange-500">
                            {totalRevenueThisMonth.toLocaleString("vi-VN")} VNĐ
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 flex-1 text-center">
                        <div className="text-gray-500 mb-2">
                            Tổng số đơn hàng tháng này
                        </div>
                        <div className="text-3xl font-bold text-green-500">
                            {overallMonthOrderCount.toLocaleString("vi-VN")}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 flex-1 text-center">
                        <div className="text-gray-500 mb-2">
                            Nhân viên đang hoạt động
                        </div>
                        <div className="text-3xl font-bold text-blue-500">
                            {totalActiveEmployees.toLocaleString("vi-VN")}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 h-72 mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    Biểu đồ doanh thu toàn hệ thống theo ngày trong tháng
                </h4>
                <Bar
                    data={{
                        labels: overallMonthLabels,
                        datasets: [
                            {
                                label: "Doanh thu toàn hệ thống (VNĐ)",
                                data: overallMonthRevenue,
                                backgroundColor: "#fb923c",
                                borderRadius: 6,
                            },
                        ],
                    }}
                    options={{
                        ...chartOptions,
                        maintainAspectRatio: false,
                    }}
                    className="w-full h-full"
                />
            </div>

            <div className="bg-white rounded-lg shadow p-6 h-72">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <h4 className="text-lg font-semibold text-gray-700">
                        Biểu đồ doanh thu theo ngày trong tháng
                    </h4>
                    <div className="flex gap-2">
                        <select
                            className="border rounded px-2 py-1"
                            value={selectedBranch ?? ""}
                            onChange={(e) =>
                                setSelectedBranch(Number(e.target.value))
                            }
                        >
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border rounded px-2 py-1"
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(Number(e.target.value))
                            }
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (m) => (
                                    <option key={m} value={m}>
                                        Tháng {m}
                                    </option>
                                )
                            )}
                        </select>
                        <select
                            className="border rounded px-2 py-1"
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(Number(e.target.value))
                            }
                        >
                            {Array.from(
                                { length: 5 },
                                (_, i) => new Date().getFullYear() - 2 + i
                            ).map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <Bar
                    data={{
                        labels: monthLabels,
                        datasets: [
                            {
                                label: "Doanh thu (VNĐ)",
                                data: monthRevenue,
                                backgroundColor: "#60a5fa",
                                borderRadius: 6,
                            },
                        ],
                    }}
                    options={{
                        ...chartOptions,
                        maintainAspectRatio: false,
                    }}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default RevenueSum;
