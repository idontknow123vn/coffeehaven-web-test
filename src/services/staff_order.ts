import { staff } from "../utils/request";

const createOrder = async (data: any) => {
    try {
        const result = await staff("/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        console.error("Create order error:", error);
        throw error;
    }
};

const getOrderByIdBranch = async (branchId: number) =>{
    try {
        const result = await staff(`/get-orders-by-branch/${branchId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Get order by branch ID error:", error);
        throw error;
    }
};
export { createOrder , getOrderByIdBranch};