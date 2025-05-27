import { manager } from "../utils/request";

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

export { getEmployeesByBranch, getMenuItemsNotInBranch, addItemToBranch };