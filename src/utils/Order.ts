export interface Order {
    id: number;
    branchId: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    employeeId?: number;
    employeeName?: string;
    employeePhone?: string;
    customerInfo?: string;
    receiverInfo?: string;
}