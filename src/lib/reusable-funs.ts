import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

// Show error toast
export const showError = (error: SerializedError | FetchBaseQueryError) => {
  if (error && "data" in error && typeof error.data !== "undefined") {
    toast.error((error.data as { message: string }).message);
  }
};

// Generate random number with given length
export const generateRandomId = (length = 6) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) =>
    ("0" + (byte % 36).toString(36)).slice(-1)
  ).join("");
};
