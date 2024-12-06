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
