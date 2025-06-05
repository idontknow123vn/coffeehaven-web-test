export interface Discount {
    id: number;
    name: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    priceThreshold: number;
    itemNames: {id: number; name: string}[] | [];
    categoryNames: {id: number; categoryName: string}[] | [];
    isActive: boolean;
    isAppliedToAll: boolean;
    discountType: string; // "PRODUCT"| "CATEGORY" | "ORDER"
    discountBranchesInfo: string;
}