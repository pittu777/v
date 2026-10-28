"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { KeyRound } from "lucide-react";
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
      setMessage("Session token copied to the clipboard.");
    } catch (error) {
      console.error("Failed to get session token:", error);
      setMessage("Could not get the token. Check the browser console.");
    }
  }

  if (!isLoaded) {
    return (
      <main className="grid min-h-svh place-items-center px-4 py-8">
        <p role="status" className="text-sm text-muted-foreground">Loading your session...</p>
      </main>
    );
  }

  return (
    <main className="grid min-h-svh place-items-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <KeyRound aria-hidden="true" className="size-[18px]" />
          </span>
          <CardTitle className="text-xl tracking-tight">Session token helper</CardTitle>
          <CardDescription className="leading-6">
            Copy your Clerk session token for local API testing. Treat it like a password and do not share it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSignedIn ? (
            <p role="status" className="rounded-lg border bg-muted/50 px-3.5 py-3 text-sm text-muted-foreground">
              Sign in to your application before requesting a session token.
            </p>
          ) : (
            <>
              <Button type="button" className="h-11 w-full" onClick={() => void handleGetToken()}>
                Copy session token
              </Button>
              {message && (
                <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
                  {message}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
