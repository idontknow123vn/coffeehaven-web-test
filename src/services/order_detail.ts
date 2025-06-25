import { order } from "../utils/request";

const getOrderDetailsById = async (orderId: number) => {
    try {
        const result = await order(`/order-details/${orderId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching order details:", error);
        throw error;
    }
};

export { getOrderDetailsById };