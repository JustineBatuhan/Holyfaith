// API utility for client requests
// Requests go to same origin because Vite proxy routes /api and /uploads in dev,
// and Express serves the production React build in prod.

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');
  
  // Set headers
  const headers = {
    ...options.headers,
  };
  
  // Do not set Content-Type if we are uploading FormData (e.g. file upload)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  // Handle empty or text responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return null;
  }
}

// File upload helper
export async function uploadImage(file) {
  const token = localStorage.getItem('admin_token');
  const formData = new FormData();
  formData.append('image', file);

  return apiRequest('/api/upload', {
    method: 'POST',
    body: formData
  });
}
