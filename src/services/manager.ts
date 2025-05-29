import { manager } from "../utils/request";

const getBranchDetails = async (branchId: number) => {
    try {
        const result = await manager(`/branch-details/${branchId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching branch details:", error);
        throw error;
    }
}

const getEmployeesByBranch = async (branchId: number) => {
    try {
        const result = await manager(`/employees/${branchId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            
        });
        return result;
    } catch (error: any) {
        // showError(error);
        console.error("Login error:", error);
        throw error;
    }
};

const getMenuItemsNotInBranch = async (branchId: number, categoryId = 0, page = 0, size = 10) => {
    const queryParams = new URLSearchParams({
        categoryId: categoryId.toString(),
        page: page.toString(),
        size: size.toString(),
    }).toString();
    try {
        const result = await manager(`/branch/${branchId}/menuitems-not-in-branch?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching employees not in branch:", error);
        throw error;
    }
}

const addItemToBranch = async (branchId: number, itemId: number) => {
    try {
        const result = await manager(`/add-to-branch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                branchId: branchId,
                productId: itemId,
            }),
        });
        return result;
    } catch (error: any) {
        console.error("Error adding item to branch:", error);
        throw error;
    }
}

const getShiftByBranchInWeek = async (branchId: number, date: string) => {
    try {
        const result = await manager(`/branch-shifts/${branchId}/week/${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching shifts by branch in week:", error);
        throw error;
    }
}

const addEmployeeToShift = async (shiftId: number, employeeId: number, date: string) => {
    try {
        const result = await manager(`/assign-shift`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                shiftId: shiftId,
                employeeId: employeeId,
                shiftDate: date, // Assuming you want to assign the current date
            }),
        });
        return result;
    } catch (error: any) {
        console.error("Error adding employee to shift:", error);
        throw error;
    }
}

const getEmployeesNotManager = async (branchId: number) => {
    try {
        const result = await manager(`/employees/${branchId}/exclude-managers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching employees not manager:", error);
        throw error;
    }
}

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
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
    } catch (error: any) {
        console.error("Error updating employee shift:", error);
        throw error;
    }
}

const deleteEmployeeShift = async (employeeId: number, shiftId: number, date: string) => {
    try {
        const result = await manager(`/delete-employee-shift`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({
                employeeId: employeeId,
                oldShiftId: shiftId,
                oldShiftDate: date,
            }),
        });
        return result;
    } catch (error: any) {
        console.error("Error deleting employee shift:", error);
        throw error;
    }
}

const getWeeklyRevenueByBranch = async (branchId: number, date: string) => {
    try {
        const result = await manager(`/branch/${branchId}/week/${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching weekly revenue by branch:", error);
        throw error;
    }
}

const getMonthlyRevenueByBranch = async (branchId: number, month: number, year: number) => {
    try {
        const result = await manager(`/branch/${branchId}/statistics/${year}/${month}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching monthly revenue by branch:", error);
        throw error;
    }
}

const addEmployee = async (employeeData: any) => {
    try {
        const result = await manager(`/create-employee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify(employeeData),
        });
        return result;
    } catch (error: any) {
        console.error("Error adding employee:", error);
        throw error;
    }
}

export {getBranchDetails, getEmployeesByBranch, getMenuItemsNotInBranch, addItemToBranch, getShiftByBranchInWeek, addEmployeeToShift, 
    getEmployeesNotManager, updateEmployeeShift, deleteEmployeeShift, getWeeklyRevenueByBranch, getMonthlyRevenueByBranch,
    addEmployee};