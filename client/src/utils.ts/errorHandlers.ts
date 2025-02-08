import { ApiError, ValidationError } from "@/types/errorTypes";

/**
 * Check if an API error response contains validation errors.
 * @param error - The API error response object.
 * @returns True if validation errors exist, otherwise false.
 */

export const getApiErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as ApiError) &&
    "statusCode" in (error as ApiError).data &&
    "message" in (error as ApiError).data
  ) {
    return (error as ApiError).data.message;
  } else {
    return null;
  }
};

export const extractValidationErrors = (error: unknown): ValidationError[] => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as ApiError) &&
    "statusCode" in (error as ApiError).data &&
    "errors" in (error as ApiError).data &&
    Array.isArray((error as ApiError).data.errors)
  ) {
    return (error as ApiError).data.errors ?? []; // Ensure errors is always an array
  }

  return [];
};
