export async function logoutApi() {
  const res = await fetch(endpoints.logout, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function retrieveDocumentApi(documentId: string) {
  const res = await fetch("/retrieve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentId }),
    credentials: "include",
  });
  return res.json();
}

export async function getDocuments() {
  const res = await fetch("/dashboard", {
    method: "GET",
    credentials: "include", // important for sessions
  });
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function uploadDocumentApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  return res.json();
}
import { endpoints } from "./api";

export async function loginApi(email: string, password: string) {
  const res = await fetch(endpoints.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return res.json();
}

export async function signupApi(email: string, password: string) {
  const res = await fetch(endpoints.signup, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return res.json();
}


export async function requestPasswordResetApi(email: string) {
  const res = await fetch(endpoints.requestPasswordReset, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPasswordApi(token: string, password: string) {
  const res = await fetch(endpoints.resetPassword, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  return res.json();
}
