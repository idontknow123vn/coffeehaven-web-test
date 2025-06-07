import { discount } from "../utils/request";

const getDiscountToday = async (branchId: number) => {
    try {
        const response = await discount.get(`/today?branchId=${branchId}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching today's discount:", error);
        throw error;
    }
}

const getDiscountById = async (discountId: number) => {
    try {
        const response = await discount.get(`/${discountId}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching discount by ID:", error);
        throw error;
    }
}

export { getDiscountToday, getDiscountById };