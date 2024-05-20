export interface ApiResponse<T> {
  sucess: boolean;
  message: string;
  data: T;
}

export * from "./solver-service/service";
