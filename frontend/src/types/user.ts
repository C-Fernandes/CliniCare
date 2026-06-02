export type UserRole = 'ADMIN' | 'PROFESSIONAL';
export type UserApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    approvalStatus: UserApprovalStatus;
    active: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
}
