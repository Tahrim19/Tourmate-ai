const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Performs a fetch request with a specified timeout.
 */
async function fetchWithTimeout(url, options = {}, timeout = 300000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error("Request timed out after 5 minutes.", { cause: error });
    }
    throw error;
  }
}

/**
 * Generic wrapper that handles timeouts and retries.
 */
async function apiFetch(endpoint, options = {}, retries = 1) {
  const url = `${BASE_URL}${endpoint}`;
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, 300000);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error;
      console.warn(`[API] Attempt ${attempt + 1} failed for ${endpoint}:`, error.message);
      if (attempt === retries) {
        break;
      }
      // Wait a brief moment before retrying (e.g. 500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  throw lastError || new Error("Failed to connect to the TourMate AI backend.", { cause: lastError });
}

/**
 * Sends a message in the chat conversation.
 */
export async function chatRequest(message, city = "", userId = "") {
  return apiFetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      city,
      user_id: userId,
    }),
  });
}

/**
 * Requests quick category-based recommendations.
 */
export async function quickRequest(city, category, userId = "") {
  return apiFetch("/api/quick", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      city,
      category,
      user_id: userId,
    }),
  });
}

/**
 * Checks the status and availability of the backend server.
 */
export async function healthCheck() {
  return apiFetch("/health", {
    method: "GET",
  }, 0); // No retries needed for health check
}
