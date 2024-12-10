import moment from "moment";

export const requestHandler = async (api, setLoading, onSuccess, onError) => {
  // Show loading state if setLoading function is provided
  if (setLoading) setLoading(true);

  try {
    // Make the API request
    const response = await api();
    const { data } = response;

    // Check if the response indicates success
    if (data && data.success) {
      // Call the onSuccess callback with the response data
      onSuccess(data);
    }
  } catch (error) {
    // Handle error cases, including unauthorized and forbidden cases
    if ([401, 403].includes(error?.response?.data?.statusCode)) {
      localStorage.clear(); // Clear local storage on authentication issues
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Redirect to login page
      }
    }

    // Call the onError callback with an error message
    const errorMessage = error?.response?.data?.message || "Something went wrong";
    onError(errorMessage);
  } finally {
    // Hide loading state if setLoading function is provided
    if (setLoading) setLoading(false);
  }
};

export const formatTime = (isoDate) => {
  const now = moment(); // Current time
  const timeSent = moment(isoDate); // Time from the input
  const duration = moment.duration(now.diff(timeSent)); // Calculate difference

  if (duration.asSeconds() < 60) {
    return `${Math.floor(duration.asSeconds())} s ago`;
  } else if (duration.asMinutes() < 60) {
    return `${Math.floor(duration.asMinutes())} m ago`;
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())} h ago`;
  } else {
    return timeSent.format("dddd, MMMM Do YYYY, h:mm A"); // Specific date if older than a day
  }
};
