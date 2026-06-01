export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error: string | null;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface PageRequest {
    page?: number;
    size?: number;
}
