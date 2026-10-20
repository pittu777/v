"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function TokenTestPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [message, setMessage] = useState("");

  async function handleGetToken() {
    try {
      const token = await getToken();

      if (!token) {
        setMessage("No session token returned. Please sign in again.");
        return;
      }

      await navigator.clipboard.writeText(token);
      setMessage("Session token copied to clipboard.");
    } catch (error) {
      console.error("Failed to get session token:", error);
      setMessage("Could not get token. Check the browser console.");
    }
  }

  if (!isLoaded) return <p>Loading Clerk...</p>;

  if (!isSignedIn) {
    return <p>Please sign in to your application first.</p>;
  }

  return (
    <main className="p-8">
      <h1 className="mb-4 text-xl font-bold">Postman Token Helper</h1>

      <button
        onClick={handleGetToken}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Copy session token
      </button>

      <p className="mt-4">{message}</p>
    </main>
  );
}