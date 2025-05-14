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

export { getEmployeesByBranch };