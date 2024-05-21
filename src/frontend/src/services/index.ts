export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export * from "./solver-service/service";
