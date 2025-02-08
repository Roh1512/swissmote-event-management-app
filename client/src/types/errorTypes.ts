export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  data: {
    success: false;
    message: string;
    statusCode: number;
    errors?: ValidationError[];
  }; // Optional array of validation errors
}
