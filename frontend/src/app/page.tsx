"use client";
import { loginApi, signupApi, requestPasswordResetApi, resetPasswordApi, logoutApi, retrieveDocumentApi, uploadDocumentApi, getDocuments } from "./apiClient";
import { useState, useRef } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"none" | "login" | "signup" | "reset">("none");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setDocError("");
    setDocuments([]);
    try {
      const res = await loginApi(email, password);
      setMessage(JSON.stringify(res));
      if (res.success || res.token || res.status === "success") {
        setLoggedIn(true);
        setDocLoading(true);
        try {
          const docRes = await getDocuments();
          if (!docRes.ok) throw new Error("Failed to fetch documents");
          const data = await docRes.json();
          setDocuments(data.documents || []);
        } catch (err: any) {
          setDocError(err.message || "Error fetching documents");
        }
        setDocLoading(false);
      }
    } catch {
      setMessage("Login failed");
    }
    setLoading(false);
  }

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await signupApi(email, password);
      setMessage(JSON.stringify(res));
    } catch {
      setMessage("Signup failed");
    }
    setLoading(false);
  }

  async function submitRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await requestPasswordResetApi(email);
      setMessage("Password reset link sent. Check your email for the token.");
    } catch {
      setMessage("Request failed");
    }
    setLoading(false);
  }

  async function submitResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await resetPasswordApi(token, newPassword);
      setMessage(JSON.stringify(res));
    } catch {
      setMessage("Reset failed");
    }
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    setMessage("");
    setDocError("");
    setUploadMsg("");
    try {
      await logoutApi();
    } catch {}
    setLoggedIn(false);
    setDocuments([]);
    setMode("none");
    setEmail("");
    setPassword("");
    setToken("");
    setNewPassword("");
    setLoading(false);
  }

  async function handleRetrieve(docId: string) {
    setLoading(true);
    setMessage("");
    try {
      const res = await retrieveDocumentApi(docId);
      setMessage(`Document ${docId} retrieved: ` + JSON.stringify(res));
    } catch {
      setMessage(`Failed to retrieve document ${docId}`);
    }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadMsg("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadMsg("File size exceeds 5MB limit.");
      return;
    }
    const allowedTypes = ["application/pdf", "application/msword", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setUploadMsg("Invalid file type. Allowed: doc, pdf, jpg, png.");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadDocumentApi(file);
      setUploadMsg("Upload result: " + JSON.stringify(res));
      // Optionally refresh documents list
    } catch {
      setUploadMsg("Upload failed.");
    }
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen flex flex-row items-start justify-center bg-gray-50 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 text-blue-700">Document Manager</h1>
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md flex flex-col gap-6">
          {!loggedIn && mode === "none" && (
            <>
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={() => setMode("login")}>Login</button>
              <button className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={() => setMode("signup")}>Sign Up</button>
              <button className="w-full py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition" onClick={() => setMode("reset")}>Forgot Password</button>
            </>
          )}
          {!loggedIn && mode === "login" && (
            <form className="flex flex-col gap-4" onSubmit={submitLogin}>
              <input type="email" placeholder="Email" className="border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition" disabled={loading}>Login</button>
              <button type="button" className="text-sm text-gray-500 mt-2" onClick={() => setMode("none")}>Back</button>
            </form>
          )}
          {!loggedIn && mode === "signup" && (
            <form className="flex flex-col gap-4" onSubmit={submitSignup}>
              <input type="email" placeholder="Email" className="border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition" disabled={loading}>Sign Up</button>
              <button type="button" className="text-sm text-gray-500 mt-2" onClick={() => setMode("none")}>Back</button>
            </form>
          )}
          {!loggedIn && mode === "reset" && (
            <>
              <form className="flex flex-col gap-4" onSubmit={submitRequestReset}>
                <input type="email" placeholder="Email" className="border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition" disabled={loading}>Request Password Reset</button>
                <button type="button" className="text-sm text-gray-500 mt-2" onClick={() => setMode("none")}>Back</button>
              </form>
              <form className="flex flex-col gap-4 mt-6" onSubmit={submitResetPassword}>
                <input type="text" placeholder="Token" className="border p-2 rounded" value={token} onChange={e => setToken(e.target.value)} required />
                <input type="password" placeholder="New Password" className="border p-2 rounded" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition" disabled={loading}>Reset Password</button>
              </form>
            </>
          )}
          {loggedIn && (
            <button className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition" onClick={handleLogout} disabled={loading}>Logout</button>
          )}
          {message && <div className="mt-4 text-sm text-center text-gray-700">{message}</div>}
        </div>
        <p className="mt-10 text-gray-500 text-sm">Welcome! Please login or sign up to manage your documents.</p>
      </div>
      {/* Documents Section */}
      <div className="flex-1 flex flex-col items-start justify-start p-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Documents</h2>
        {!loggedIn ? null : docLoading ? (
          <p>Loading documents...</p>
        ) : docError ? (
          <p className="text-red-500">{docError}</p>
        ) : (
          <>
            {documents.length === 0 ? (
              <p className="text-gray-500">No documents to show.</p>
            ) : (
              <ul className="bg-white shadow rounded-lg p-4 w-full max-w-lg flex flex-col gap-2">
                {documents.map((doc, idx) => (
                  <li key={doc.id || idx} className="border-b py-2 flex items-center justify-between">
                    <span>{doc.name || JSON.stringify(doc)}</span>
                    <button className="ml-4 px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleRetrieve(doc.id || idx)} disabled={loading}>Retrieve</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6">
              <label className="block mb-2 font-medium">Upload Document (doc, pdf, jpg, png, max 5MB):</label>
              <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleUpload} className="mb-2" />
              {uploadMsg && <div className="text-sm text-gray-700">{uploadMsg}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

