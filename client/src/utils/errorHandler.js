import { toast } from "react-toastify";

const errorHandler = (
  error,
  customMessage = "Something went wrong. Please try again later."
) => {
  console.error("Error: ", error);

  // Detect network error
  if (!navigator.onLine) {
    toast.error(
      "No internet connection. Please check your network and try again.",
      { theme: "colored" }
    );
  } else if (error.code === "ERR_NETWORK") {
    toast.error("Network error. Please check your connection and try again.", {
      theme: "colored",
    });
  } else if (error.response?.data?.message) {
    toast.error(error.response.data.message, { theme: "colored" });
  } else {
    toast.error(customMessage, {
      theme: "colored",
    });
  }
};

export default errorHandler;
