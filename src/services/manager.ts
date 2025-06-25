import { manager } from "../utils/request";

const getBranchDetails = async (branchId: number) => {
    try {
        const result = await manager(`/branch-details/${branchId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error) {
        console.error("Error fetching branch details:", error);
        throw error;
    }
};

const getEmployeesByBranch = async (branchId: number, role: string | null, page: number, size: number) => {
    try {
        const queryParams = new URLSearchParams({
            ...(role ? { role } : {}),
            page: page.toString(),
            size: size.toString(),
        }).toString();
        const result = await manager(`/employees/${branchId}?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error) {
        // showError(error);
        console.error("Login error:", error);
        throw error;
    }
};

const countEmployeesInBranch = async (branchId: number) => {
    try {
        const result = await manager(`/count-employees/${branchId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error) {
        console.error("Error counting employees in branch:", error);
        throw error;
    }
}

const changeEmployeeStatus = async (employeeId: number, status: boolean, inactiveReason: string) => {
    try {
        const result = await manager(`/change-employee-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                employeeId: employeeId,
                status: status ? "Active" : "Inactive",
                inactiveReason: inactiveReason || null,
            }),
        });
        return result;
    } catch (error) {
        console.error("Error changing employee status:", error);
        throw error;
    }
}

const getMenuItemsNotInBranch = async (
    branchId: number,
    categoryId = 0,
    page = 0,
    size = 10
) => {
    const queryParams = new URLSearchParams({
        categoryId: categoryId.toString(),
        page: page.toString(),
        size: size.toString(),
    }).toString();
    try {
        const result = await manager(
            `/branch/${branchId}/menuitems-not-in-branch?${queryParams}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error) {
        console.error("Error fetching employees not in branch:", error);
        throw error;
    }
};

const addItemToBranch = async (branchId: number, itemId: number) => {
    try {
        const result = await manager(`/add-to-branch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                branchId: branchId,
                productId: itemId,
            }),
        });
        return result;
    } catch (error) {
        console.error("Error adding item to branch:", error);
        throw error;
    }
};

const changeItemStatus = async (
    branchId: number,
    itemId: number,
    status: boolean
) => {
    try {
        const result = await manager(`/change-item-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                branchId: branchId,
                productId: itemId,
                availability: status,
            }),
        });
        return result;
    } catch (error) {
        console.error("Error changing item status:", error);
        throw error;
    }
};

const getShiftByBranchInWeek = async (branchId: number, date: string) => {
    try {
        const result = await manager(
            `/branch-shifts/${branchId}/week/${date}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error) {
        console.error("Error fetching shifts by branch in week:", error);
        throw error;
    }
};

const addEmployeeToShift = async (
    shiftId: number,
    employeeId: number,
    date: string
) => {
    try {
        const result = await manager(`/assign-shift`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                shiftId: shiftId,
                employeeId: employeeId,
                shiftDate: date, // Assuming you want to assign the current date
            }),
        });
        return result;
    } catch (error) {
        console.error("Error adding employee to shift:", error);
        throw error;
    }
};

const getEmployeesNotManager = async (branchId: number) => {
    try {
        const result = await manager(
            `/employees/${branchId}/exclude-managers`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error) {
        console.error("Error fetching employees not manager:", error);
        throw error;
    }
};

const updateEmployeeShift = async (
    employeeId: number,
    oldShiftId: string,
    oldDate: string,
    newShiftId: number,
    newDate: string
) => {
    try {
        const result = await manager(`/update-employee-shift`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                employeeId: employeeId,
                oldShiftId: oldShiftId,
                oldShiftDate: oldDate,
                newShiftId: newShiftId,
                newShiftDate: newDate,
            }),
        });
        return result;
    } catch (error) {
        console.error("Error updating employee shift:", error);
        throw error;
    }
};

const deleteEmployeeShift = async (
    employeeId: number,
    shiftId: number,
    date: string
) => {
    try {
        const result = await manager(`/delete-employee-shift`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                employeeId: employeeId,
                oldShiftId: shiftId,
                oldShiftDate: date,
            }),
        });
        return result;
    } catch (error) {
        console.error("Error deleting employee shift:", error);
        throw error;
    }
};

const getWeeklyRevenueByBranch = async (branchId: number, date: string) => {
    try {
        const result = await manager(`/branch/${branchId}/week/${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error) {
        console.error("Error fetching weekly revenue by branch:", error);
        throw error;
    }
};

const getMonthlyRevenueByBranch = async (
    branchId: number,
    month: number,
    year: number
) => {
    try {
        const result = await manager(
            `/branch/${branchId}/statistics/${year}/${month}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error) {
        console.error("Error fetching monthly revenue by branch:", error);
        throw error;
    }
};

const addEmployee = async (employeeData: Record<string, unknown>) => {
    try {
        const result = await manager(`/create-employee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify(employeeData),
        });
        return result;
    } catch (error) {
        console.error("Error adding employee:", error);
        throw error;
    }
};

const getBranchDiscounts = async (branchId: number) => {
    try {
        const result = await manager(`/branch/${branchId}/discounts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error) {
        console.error("Error fetching branch discounts:", error);
        throw error;
    }
};

const reassignShift = async (
    oldEmployeeId: number,
    newEmployeeId: number,
    shiftId: number,
    date: string
) => {
    try {
        const result = await manager(`/reassign-shift`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                fromEmployeeId: oldEmployeeId,
                toEmployeeId: newEmployeeId,
                shiftId: shiftId,
                shiftDate: date,
            }),
        });
        return result;
    } catch (error) {
        console.error("Error reassigning shift:", error);
        throw error;
    }
}

const updateEmployeeSalary = async (
    employeeId: number,
    newSalary: number
) => {
    try {
        const result = await manager(`/update-employee-salary`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                employeeId: employeeId,
                newSalary: newSalary,
            }),
        });
        return result;
    } catch (error) {
        console.error("Error updating employee salary:", error);
        throw error;
    }
}


export {
    getBranchDetails,
    getEmployeesByBranch,
    countEmployeesInBranch,
    changeEmployeeStatus,
    getMenuItemsNotInBranch,
    addItemToBranch,
    getShiftByBranchInWeek,
    addEmployeeToShift,
    getEmployeesNotManager,
    updateEmployeeShift,
    deleteEmployeeShift,
    getWeeklyRevenueByBranch,
    getMonthlyRevenueByBranch,
    addEmployee,
    changeItemStatus,
    getBranchDiscounts,
    reassignShift,
    updateEmployeeSalary
};
