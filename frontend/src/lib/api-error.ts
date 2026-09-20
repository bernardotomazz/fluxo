import { isAxiosError } from "axios";

type ValidationErrors = Record<string, string>;

function isValidationErrors(value: unknown): value is ValidationErrors {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((message) => typeof message === "string")
  );
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isAxiosError(error)) return fallback;

  const responseData: unknown = error.response?.data;
  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (isValidationErrors(responseData)) {
    return Object.values(responseData).join(" ");
  }

  if (
    typeof responseData === "object" &&
    responseData !== null &&
    "message" in responseData &&
    typeof responseData.message === "string"
  ) {
    return responseData.message;
  }

  if (!error.response) {
    return "Não foi possível conectar à API local. Verifique se o backend está em execução.";
  }

  return fallback;
}
