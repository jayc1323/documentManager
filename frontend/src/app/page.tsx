"use client";
import {
  loginApi,
  signupApi,
  requestPasswordResetApi,
  resetPasswordApi,
  dashboardApi,
  logoutApi,
  retrieveDocumentApi,
  uploadDocumentApi,
  deleteDocumentApi,
  Document,
} from "./apiClient";
import { useState, useRef, useEffect } from "react";


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "resetRequest" | "resetPassword">("login");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents when logged in
  const fetchDocuments = async () => {
    setMessage("");
    try {
      const res = await dashboardApi(email, password);
      console.log("Dashboard response:", res); // Debug response
      const fetchedDocuments = Array.isArray(res) ? res : [];
      setDocuments(fetchedDocuments);
      setMessage(fetchedDocuments.length === 0 ? "No documents found" : "");
    } catch (error) {
      console.error("Failed to load documents:", error);
      setMessage("Failed to load documents");
    }
  };

  // Fetch documents after login
  useEffect(() => {
    if (loggedIn) {
      fetchDocuments();
    }
  }, [loggedIn]);

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await loginApi(email, password);
      console.log("Login response:", res); // Debug response
      if (Array.isArray(res)) {
        setLoggedIn(true);
        setDocuments(res);
      } else {
        setMessage("No documents returned from login");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Login failed");
    }
    setLoading(false);
  }

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await signupApi(email, password);
      setMessage("Signup successful. You can now login.");
      setMode("login");
    } catch (error) {
      console.error("Signup failed:", error);
      setMessage("Signup failed");
    }
    setLoading(false);
  }

  async function submitResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await requestPasswordResetApi(email);
      setMessage("Password reset email sent. Please check your inbox.");
      setMode("resetPassword");
    } catch (error) {
      console.error("Reset request failed:", error);
      setMessage("Reset request failed");
    }
    setLoading(false);
  }

  async function submitResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await resetPasswordApi(resetToken, password);
      setMessage("Password reset successful. You can now login.");
      setMode("login");
    } catch (error) {
      console.error("Password reset failed:", error);
      setMessage("Password reset failed");
    }
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    setMessage("");
    try {
      await logoutApi(email, password);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setLoggedIn(false);
    setDocuments([]);
    setEmail("");
    setPassword("");
    setResetToken("");
    setLoading(false);
  }

 async function handleRetrieve(docId: string) {
  setLoading(true);
  setMessage("");

  try {
    const res = await retrieveDocumentApi(docId, email, password);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // Let the browser handle the filename from Content-Disposition
    link.download = "";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setMessage(`Document retrieved: ${docId}`);
  } catch (error) {
    console.error(`Failed to retrieve document ${docId}:`, error);
    setMessage(`Failed to retrieve document ${docId}`);
  } finally {
    setLoading(false);
  }
}


  async function handleDelete(docId: string) {
    setLoading(true);
    setMessage("");
    try {
      await deleteDocumentApi(docId, email, password);
      setMessage(`Document ${docId} deleted successfully`);
      await fetchDocuments(); // Refresh document list
    } catch (error) {
      console.error(`Failed to delete document ${docId}:`, error);
      setMessage(`Failed to delete document ${docId}`);
    }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadMsg("");
    const file = e.target.files?.[0];
    if (!file) {
      setUploadMsg("No file selected");
      return;
    }

    // Enforce 5 MB limit on the frontend
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    if (file.size > maxSize) {
      setUploadMsg("File size exceeds 5 MB limit");
      return;
    }

    setLoading(true);
    try {
      await uploadDocumentApi(file, email, password);
      setUploadMsg("Upload successful");
      await fetchDocuments();
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMsg("Upload failed");
    }
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen flex flex-row items-start justify-center bg-gray-50 font-sans p-8">
      <div className="flex-1 max-w-md flex flex-col gap-6">
        {!loggedIn ? (
          <>
            {mode === "login" && (
              <form className="flex flex-col gap-4" onSubmit={submitLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  Login
                </button>
                <div className="flex justify-between mt-2 text-sm text-blue-600">
                  <button type="button" onClick={() => setMode("signup")}>
                    Signup
                  </button>
                  <button type="button" onClick={() => setMode("resetRequest")}>
                    Forgot Password?
                  </button>
                </div>
              </form>
            )}

            {mode === "signup" && (
              <form className="flex flex-col gap-4" onSubmit={submitSignup}>
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  disabled={loading}
                >
                  Signup
                </button>
                <button
                  type="button"
                  className="text-sm text-blue-600 mt-2"
                  onClick={() => setMode("login")}
                >
                  Back to Login
                </button>
              </form>
            )}

            {mode === "resetRequest" && (
              <form className="flex flex-col gap-4" onSubmit={submitResetRequest}>
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                  disabled={loading}
                >
                  Send Reset Email
                </button>
                <button
                  type="button"
                  className="text-sm text-blue-600 mt-2"
                  onClick={() => setMode("login")}
                >
                  Back to Login
                </button>
              </form>
            )}

            {mode === "resetPassword" && (
              <form className="flex flex-col gap-4" onSubmit={submitResetPassword}>
                <input
                  type="text"
                  placeholder="Reset Token"
                  className="border p-2 rounded"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="border p-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  disabled={loading}
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  className="text-sm text-blue-600 mt-2"
                  onClick={() => setMode("login")}
                >
                  Back to Login
                </button>
              </form>
            )}
          </>
        ) : (
          <button
            className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </button>
        )}
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>

     
       {/* Documents Section */}
{loggedIn && (
  <div className="flex-1 flex flex-col items-start justify-start ml-8">
    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Uploaded Documents</h2>

    {documents.length === 0 ? (
      <p className="text-gray-500">No documents found</p>
    ) : (
      <ol className="bg-white shadow rounded-lg p-4 w-full max-w-lg flex flex-col gap-2 list-decimal list-inside">
        {documents.map((doc, index) => (
          <li
            key={doc.id || index}
            className="flex justify-between items-center border-b py-2"
          >
            <span className="font-mono text-blue-700">{doc.url}</span>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => handleRetrieve(String(doc.id))}
                disabled={loading}
              >
                Get
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(String(doc.id))}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ol>
    )}

    <div className="mt-6 w-full max-w-lg">
      <label className="block mb-2 font-medium text-gray-700">
        Upload Document (max 5 MB):
      </label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept=".pdf,.doc,.docx,.jpg,.png"
        className="mb-2 border p-2 rounded w-full"
      />
      {uploadMsg && <p className="text-sm text-gray-700">{uploadMsg}</p>}
    </div>

    <button
      className="mt-6 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
      onClick={handleLogout}
      disabled={loading}
    >
      Logout
    </button>
  </div>
)} </div>)}