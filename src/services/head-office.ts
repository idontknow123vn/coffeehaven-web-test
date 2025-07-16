import { headOffice } from "../utils/request";

const getBranches = async (status: string, page: number, size: number) => {
    try {
        const params: Record<string, string> = {
            page: page.toString(),
            size: size.toString(),
        };
        if (status && status != '') params.status = status;
        const queryParams = new URLSearchParams(params).toString();
        const result = await headOffice(`/get-branches-paged?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching branches:", error);
        throw error;
    }
};

const _getBranches = async (status: string) => {
    try {
        const queryParams = status
            ? `?status=${encodeURIComponent(status)}` : "";
        const result = await headOffice(`/get-branches${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
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
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
            data: JSON.stringify(branchData),
        });
        return result;
    } catch (error: any) {
        console.error("Error creating branch:", error);
        throw error;
    }
};

const addBranchManager = async (managerData: any) => {
    try {
        const result = await headOffice(`/add-branch-manager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
            data: JSON.stringify(managerData),
        });
        return result;
    } catch (error: any) {
        console.error("Error adding branch manager:", error);
        throw error;
    }
};

const changeBranchStatus = async (branchId: number) => {
    try {
        const result = await headOffice(`/change-branch-status/${branchId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error changing branch status:", error);
        throw error;
    }
};

const updateBranch = async (branchId: number, branchData: any) => {
    try {
        const result = await headOffice(`/update-branch/${branchId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
            data: JSON.stringify(branchData),
        });
        return result;
    } catch (error: any) {
        console.error("Error updating branch:", error);
        throw error;
    }
};

// Tạo mới menu item (dùng cho ModalAddMenuItem)
const createMenuItem = async (formData: FormData) => {
    try {
        const result = await headOffice(`/create-product`, {
            method: "POST",
            headers: {
                // KHÔNG set Content-Type, axios sẽ tự động set boundary cho multipart/form-data
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
            data: formData,
        });
        return result;
    } catch (error) {
        console.error("Error creating menu item:", error);
        throw error;
    }
};

const getTotalActiveEmployees = async () => {
    try {
        const result = await headOffice(`/count-employees`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching total active employees:", error);
        throw error;
    }
};

const getMonthlyRevenueByBranch = async (
    branchId: number | null,
    month: number,
    year: number
) => {
    try {
        const queryParams =
            branchId != null
                ? new URLSearchParams({
                      branchId: branchId.toString(),
                  }).toString()
                : null;
        const result = await headOffice(
            `/overall/statistics/${year}/${month}${
                queryParams ? "?" + queryParams : ""
            }`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching monthly revenue by branch:", error);
        throw error;
    }
};

const getOverallMonthlyRevenue = async (month: number, year: number) => {
    try {
        const result = await headOffice(
            `/overall/statistics/${year}/${month}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching overall monthly revenue:", error);
        throw error;
    }
};

const updateItem = async (itemId: number, itemData: any) => {
    try {
        const result = await headOffice(`/update-item/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
            data: JSON.stringify(itemData),
        });
        return result;
    } catch (error: any) {
        console.error("Error updating item:", error);
        throw error;
    }
};

const createDiscount = async (discountData: any) => {
    try {
        const result = await headOffice(`/discounts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
            data: JSON.stringify(discountData),
        });
        return result;
    } catch (error: any) {
        console.error("Error creating discount:", error);
        throw error;
    }
};

const updateDiscountByRatioAndDuration = async (
    discountId: number,
    data: any
) => {
    try {
        const result = await headOffice(
            `/discounts/${discountId}/ratio-duration`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
                data: JSON.stringify(data),
            }
        );
        return result;
    } catch (error: any) {
        console.error("Error updating discount:", error);
        throw error;
    }
};

const updateDiscountActiveStatus = async (
    discountId: number,
    isActive: boolean
) => {
    try {
        const result = await headOffice(
            `/discounts/${discountId}/is-active?isActive=${isActive}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error: any) {
        console.error("Error updating discount active status:", error);
        throw error;
    }
};

const updateDiscountThreshold = async (
    discountId: number,
    threshold: number
) => {
    try {
        const result = await headOffice(
            `/discounts/${discountId}/price-threshold?priceThreshold=${threshold}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error: any) {
        console.error("Error updating discount threshold:", error);
        throw error;
    }
};

const getDiscounts = async (
    branchId: number,
    discountType: string,
    page: number,
    size: number
) => {
    try {
        const queryParams = new URLSearchParams({
            branchId: branchId.toString(),
            discountType: discountType,
            page: page.toString(),
            size: size.toString(),
        }).toString();

        const result = await headOffice(`/discounts?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching discounts:", error);
        throw error;
    }
};

const deleteDiscount = async (discountId: number) => {
    try {
        const result = await headOffice(`/discounts/${discountId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error deleting discount:", error);
        throw error;
    }
};

const getItemsCurrentlyBeingSold = async () => {
    try {
        const result = await headOffice(`/menu-items/currently-being-sold`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching items currently being sold:", error);
        throw error;
    }
};

const getCategoriesCurrentlyBeingSold = async () => {
    try {
        const result = await headOffice(`/categories/currently-being-sold`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        });
        return result;
    } catch (error: any) {
        console.error("Error fetching categories currently being sold:", error);
        throw error;
    }
};

const getEmployeesByBranch = async (
    branchId: number | null,
    role: string | null,
    page: number,
    size: number
) => {
    try {
        const queryParams = new URLSearchParams({
            ...(branchId !== null ? { branchId: branchId.toString() } : {}),
            ...(role ? { role } : {}),
            page: page.toString(),
            size: size.toString(),
        }).toString();
        const result = await headOffice(`/employees?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        });
        return result;
    } catch (error) {
        // showError(error);
        console.error("Login error:", error);
        throw error;
    }
};

const getEmployeesNotManagers = async (branchId: number) => {
    try {
        const result = await headOffice(
            `/employees/${branchId}/exclude-manager`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error: any) {
        console.error("Error fetching employees not managers:", error);
        throw error;
    }
};

const changeBranchManager = async (
    branchId: number,
    newManagerId: number,
    oldManagerNewRole: string
) => {
    try {
        const result = await headOffice(`/change-branch-manager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
            data: JSON.stringify({
                branchId,
                newManagerId,
                oldManagerNewRole,
            }),
        });
        return result;
    } catch (error: any) {
        console.error("Error changing branch manager:", error);
        throw error;
    }
};

const transferEmployeeToBranch = async (
    employeeId: number,
    newBranchId: number
) => {
    try {
        const result = await headOffice(
            `/transfer-employee?employeeId=${employeeId}&newBranchId=${newBranchId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${sessionStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        );
        return result;
    } catch (error: any) {
        console.error("Error transferring employee to branch:", error);
        throw error;
    }
};

const updateManagerSalary = async (managerId: number, newSalary: number) => {
    try {
        const result = await headOffice(`/manager/${managerId}/salary`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
            data: JSON.stringify({
                newSalary: newSalary,
            }),
        });
        return result;
    } catch (error) {
        console.error("Error updating employee salary:", error);
        throw error;
    }
};

export {
    getBranches,
    _getBranches,
    createBranch,
    updateBranch,
    addBranchManager,
    changeBranchStatus,
    createMenuItem,
    getTotalActiveEmployees,
    getMonthlyRevenueByBranch,
    getOverallMonthlyRevenue,
    updateItem,
    createDiscount,
    updateDiscountByRatioAndDuration,
    updateDiscountActiveStatus,
    updateDiscountThreshold,
    getDiscounts,
    deleteDiscount,
    getItemsCurrentlyBeingSold,
    getCategoriesCurrentlyBeingSold,
    getEmployeesByBranch,
    getEmployeesNotManagers,
    changeBranchManager,
    transferEmployeeToBranch,
    updateManagerSalary,
};
