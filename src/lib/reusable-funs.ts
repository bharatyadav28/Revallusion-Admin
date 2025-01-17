import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

// Show error toast
export const showError = (error: SerializedError | FetchBaseQueryError) => {
  if (error && "data" in error && typeof error.data !== "undefined") {
    toast.error(
      (error.data as { message: string })?.message ||
        "Something went wrong! Please try again later."
    );
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

// convert second to days
export function secondsToDays(seconds: number) {
  return Math.floor(seconds / 86400); // 86400 seconds in a day
}

// Check if a value contains only digits
export function isDigitsOnly(value: string) {
  const regex = /^\d+$/;
  return regex.test(value);
}

// Format ISO to date,time
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

// Formate String to Date short/long format
export const convertToDate = (
  date: string | undefined,
  format: "short" | "long" = "short"
): string | undefined => {
  if (date) {
    const d = new Date(date);
    const month = d.getMonth() + 1; // Month is zero-indexed
    const day = d.getDate();
    const year = d.getFullYear();

    if (format === "long") {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[d.getMonth()]} ${day}, ${year}`;
    } else {
      return `${month < 10 ? "0" + month : month}/${
        day < 10 ? "0" + day : day
      }/${year}`;
    }
  }
  return undefined;
};

// Remove html tags from a text
export function filterHtmlTags(text: string) {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
}

// Whether is today
export function isToday(dateString: string) {
  const incomingDate = new Date(dateString);
  const today = new Date();

  return (
    incomingDate.getFullYear() === today.getFullYear() &&
    incomingDate.getMonth() === today.getMonth() &&
    incomingDate.getDate() === today.getDate()
  );
}

// Whether is yesterday
export function isYesterday(dateString: string) {
  const incomingDate = new Date(dateString);
  const today = new Date();

  return (
    incomingDate.getFullYear() === today.getFullYear() &&
    incomingDate.getMonth() === today.getMonth() &&
    incomingDate.getDate() === today.getDate() - 1
  );
}
