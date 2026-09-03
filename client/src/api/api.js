const API_BASE_URL = "http://localhost:5000";

const API = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }
  return data;
};

export default API;
