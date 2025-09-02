export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const endpoints = {
  login: `${API_BASE_URL}/login`,
  signup: `${API_BASE_URL}/signup`,
  logout: `${API_BASE_URL}/logout`,
  requestPasswordReset: `${API_BASE_URL}/request-password-reset`,
  resetPassword: `${API_BASE_URL}/reset-password`,
  dashboard :`${API_BASE_URL}/dashboard`,
  retrieve: ((id: string | number) => `${API_BASE_URL}/retrieve/${id}`),
  delete: ((id: string | number) => `${API_BASE_URL}/delete/${id}`),
  upload: `${API_BASE_URL}/documents`,
};
