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
import { getMonthlyRevenueByBranch, getBranches } from "../../services/head-office";
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
    const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

    // Lấy danh sách chi nhánh khi mount
    useEffect(() => {
        getBranches()
            .then(res => {
                setBranches(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedBranch(res.data.data[0].id);
                }
            })
            .catch(() => setBranches([]));
    }, []);

    // useEffect(() => {
    //     const fetchRevenue = async () => {
    //         if (!branchId) return;
    //         // Lấy ngày hiện tại (không cần lấy ngày đầu tuần)
    //         const today = new Date();
    //         const dateStr = today.toISOString().slice(0, 10);
    //         try {
    //             const res = await getWeeklyRevenueByBranch(branchId, dateStr);
    //             setDailyRevenue(
    //                 weekDays.map((dow) => {
    //                     const found = (
    //                         res.data.data as Array<{
    //                             dayOfWeek: string;
    //                             date: string;
    //                             totalRevenue: number;
    //                         }>
    //                     ).find((d) => d.dayOfWeek === dow);
    //                     return {
    //                         day: dayOfWeekMap[dow],
    //                         value: found ? found.totalRevenue : 0,
    //                         date: found ? found.date : "",
    //                     };
    //                 })
    //             );
    //             setWeekRevenue(
    //                 (res.data.data as Array<{ totalRevenue: number }>).reduce(
    //                     (sum, d) => sum + d.totalRevenue,
    //                     0
    //                 )
    //             );
    //         } catch {
    //             setDailyRevenue([]);
    //             setWeekRevenue(0);
    //         }
    //     };
    //     fetchRevenue();
    // }, [branchId]);

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

            {/* <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Doanh thu tuần này
                </h3>
                <div className="flex gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 flex-1 text-center">
                        <div className="text-gray-500 mb-2">
                            Doanh thu trong tuần
                        </div>
                        <div className="text-3xl font-bold text-orange-500">
                            {weekRevenue.toLocaleString("vi-VN")} VNĐ
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 h-64">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700">
                        Biểu đồ doanh thu theo ngày trong tuần
                    </h4>
                    <Bar
                        data={chartData}
                        options={{
                            ...chartOptions,
                            maintainAspectRatio: false,
                        }}
                        className="w-full h-full"
                    />
                </div>
            </div> */}

            <div className="bg-white rounded-lg shadow p-6 h-72">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <h4 className="text-lg font-semibold text-gray-700">
                        Biểu đồ doanh thu theo ngày trong tháng
                    </h4>
                    <div className="flex gap-2">
                        <select
                            className="border rounded px-2 py-1"
                            value={selectedBranch ?? ''}
                            onChange={e => setSelectedBranch(Number(e.target.value))}
                        >
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
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
