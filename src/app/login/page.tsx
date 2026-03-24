"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8 plaid-pattern">
      <div className="max-w-md w-full vintage-border bg-vintage-cream p-12 text-center">
        <header className="mb-12">
          <div className="w-20 h-20 bg-vintage-yellow border-4 border-vintage-gray mx-auto mb-6 flex items-center justify-center transform rotate-3">
            <span className="text-4xl font-bold font-typewriter">H</span>
          </div>
          <h1 className="text-3xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray">
            Humor Model
          </h1>
          <p className="text-vintage-gray/60 mt-2 font-typewriter italic text-sm">
            Restricted Archives: Personnel Only
          </p>
        </header>

        {searchParams.error && (
          <div className="mb-8 p-4 bg-vintage-pink/20 border border-vintage-pink-dark text-vintage-pink-dark font-typewriter text-xs uppercase font-bold">
            {searchParams.error === "Unauthorized" 
              ? "Access Denied: Admin Privileges Required" 
              : "Identification Error. Please try again."}
          </div>
        )}

        <div className="space-y-6">
          <p className="font-typewriter text-xs text-vintage-gray/80 leading-relaxed">
            Please present your credentials via Google authentication to proceed with flavor drafting.
          </p>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="vintage-button w-full flex items-center justify-center gap-3 bg-white hover:bg-vintage-blue/10"
          >
            {loading ? (
              <span className="font-bold uppercase tracking-tight">Processing...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  />
                </svg>
                <span className="font-bold uppercase tracking-tight text-sm">Sign in with Google</span>
              </>
            )}
          </button>
        </div>

        <footer className="mt-12 pt-6 border-t border-vintage-gray/10">
          <p className="font-typewriter text-[10px] text-vintage-gray/40 uppercase tracking-tighter">
            Property of The Humor Project. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
