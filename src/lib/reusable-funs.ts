import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

// Show error toast
export const showError = (error: SerializedError | FetchBaseQueryError) => {
  if (error && "data" in error && typeof error.data !== "undefined") {
    toast.error((error.data as { message: string }).message);
  }
};
