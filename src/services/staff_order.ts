import { staff } from "../utils/request";

const createOrder = async (data: any) => {
    try {
        const result = await staff("/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        console.error("Create order error:", error);
        throw error;
    }
};

const getOrderByIdBranch = async (branchId: number) => {
    try {
        const result = await staff(`/get-orders-by-branch/${branchId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Get order by branch ID error:", error);
        throw error;
    }
};

const getOrdersByIdBranchAndDate = async (
    branchId: number,
    date: string,
    page: number,
    size: number,
    status: string
) => {
    try {
        // Nếu status là 'all' hoặc rỗng thì không truyền vào query
        const statusParam =
            status && status !== "all"
                ? `&status=${encodeURIComponent(status)}`
                : "";
        const dateParam =
            date && date !== "all" ? `&date=${encodeURIComponent(date)}` : "";
        const url = `/get-orders-by-date?${dateParam}&branchId=${branchId}&page=${page}&size=${size}${statusParam}`;
        const result = await staff(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Get order by branch ID and date error:", error);
        throw error;
    }
};

const changeOrderStatus = async (orderId: number, status: string) => {
    try {
        const result = await staff(`/change-order-status/${orderId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify({ status }),
        });
        return result;
    } catch (error: any) {
        console.error("Change order status error:", error);
        throw error;
    }
}

export { createOrder, getOrderByIdBranch, getOrdersByIdBranchAndDate, changeOrderStatus };
