import { staff } from "../utils/request";

const getProfile = async () => {
    try {
        const response = await staff.get(`/profile`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}

const getStaffShifts = async (employeeId: number, date: string) => {
    try {
        const response = await staff.get(`/shift/${employeeId}/date/${date}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
            }
        });
        return response.data;
    }
    catch (error: any) {
        console.error("Error fetching staff shifts:", error);
        throw error;
    }
}

export { getProfile, getStaffShifts };