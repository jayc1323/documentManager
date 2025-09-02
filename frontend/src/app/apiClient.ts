// apiClient.ts
import { endpoints, API_BASE_URL } from "./api";

function getBasicAuthHeader(email: string, password: string) {
  return "Basic " + btoa(`${email}:${password}`);
}

export interface Document {
  id?: string;
  name?: string;
  url?: string;
  [key: string]: unknown;
}


export async function dashboardApi(email: string, password: string): Promise<Document[]>{
  const res = await fetch(endpoints.dashboard, {
    method: "GET",
    headers: {
      "Authorization": getBasicAuthHeader(email, password),
    },
  });
  if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`);
  return res.json();
}

export async function loginApi(email: string, password: string) {
  // for basic auth, "login" can be same as verifying and fetching dashboard
  return dashboardApi(email, password);
}

export async function logoutApi(email: string, password: string): Promise<unknown> {
  const res = await fetch(endpoints.logout, {
    method: "POST",
    headers: {
      "Authorization": getBasicAuthHeader(email, password),
    },
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

export async function retrieveDocumentApi(
  documentId: string | number,
  email: string,
  password: string
): Promise<Response> {
  const res = await fetch(endpoints.retrieve(documentId), {
    method: "GET",
    headers: {
      "Authorization": getBasicAuthHeader(email, password),
    },
  });

  if (!res.ok) throw new Error("Failed to retrieve document");

  return res; // return the Response itself, not the blob
}

export async function uploadDocumentApi(file: File, email: string, password: string): Promise<unknown> {
  const formData = new FormData();
  formData.append("document", file); // ensure backend expects this field name
  const res = await fetch(endpoints.upload, {
    method: "POST",
    headers: {
      "Authorization": getBasicAuthHeader(email, password),
      // DO NOT set Content-Type when sending FormData — browser does it automatically
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
}

export async function signupApi(email: string, password: string) {
  const res = await fetch(endpoints.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function requestPasswordResetApi(email: string) {
  const res = await fetch(endpoints.requestPasswordReset, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPasswordApi(token: string, password: string) {
  const res = await fetch(endpoints.resetPassword, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });
  return res.json();
}

export async function deleteDocumentApi(id: string, email: string, password: string) {
  const res = await fetch(endpoints.delete(id), {
    method: "DELETE",
    headers: {
      "Authorization": `Basic ${btoa(`${email}:${password}`)}`,
    },
  });
  return res.json();
}
