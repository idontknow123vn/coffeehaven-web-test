import { headOffice } from "../utils/request";

const getBranches = async () => {
    try {
        const result = await headOffice(`/get-branches`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching branches:", error);
        throw error;
    }
};

export { getBranches };
