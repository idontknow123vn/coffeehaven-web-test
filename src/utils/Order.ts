export interface Order {
    id: number;
    branchId: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    customerInfo?: string;
}