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

const createBranch = async (branchData: any) => {
    try {
        const result = await headOffice(`/create-branch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify(branchData),
        });
        return result;
    }
    catch (error: any) {
        console.error("Error creating branch:", error);
        throw error;
    }
}

const addBranchManager = async (managerData: any) => {
    try {
        const result = await headOffice(`/add-branch-manager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify(managerData),
        });
        return result;
    }
    catch (error: any) {
        console.error("Error adding branch manager:", error);
        throw error;
    }
}

// Tạo mới menu item (dùng cho ModalAddMenuItem)
const createMenuItem = async (formData: FormData) => {
    try {
        const result = await headOffice(`/create-product`, {
            method: "POST",
            headers: {
                // KHÔNG set Content-Type, axios sẽ tự động set boundary cho multipart/form-data
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: formData,
        });
        return result;
    } catch (error) {
        console.error("Error creating menu item:", error);
        throw error;
    }
};

export { getBranches, createBranch, addBranchManager, createMenuItem };
