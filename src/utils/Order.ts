export interface Order {
    id: number;
    branchId: number;
    branchName: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    employeeId?: number;
    employeeName?: string;
    employeePhone?: string;
    customerInfo?: string;
    receiverInfo?: string;
    customerConfirm?: boolean;
    deliveryConfirm?: boolean;
}