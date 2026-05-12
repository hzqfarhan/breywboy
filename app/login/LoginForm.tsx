"use client";

import { useActionState } from "react";
import { authenticate, signInWithGoogle } from "./actions";
import { Button } from "@/components/ui/button";
import { Coffee, ShieldCheck, Mail, Lock } from "lucide-react";

export function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Google Login Button */}
      <div className="space-y-4">
        <form action={signInWithGoogle}>
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full h-16 text-lg rounded-2xl flex items-center justify-center gap-4 shadow-lg hover:-translate-y-1 transition-all bg-white text-primary border-2 border-primary/10 hover:bg-secondary/50"
          >
            <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-6 h-6" />
            <span className="font-bold">Continue with Google</span>
          </Button>
        </form>
        <p className="text-[10px] text-center text-muted-foreground px-4 italic">
          Google login will automatically detect your role based on your email.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <form action={dispatch} className="space-y-4">
        <input type="hidden" name="role" value="MANUAL" />
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
        </div>

        {errorMessage && (
          <div className="text-sm text-destructive text-center">
            {errorMessage}
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl">
          Log in manually
        </Button>
      </form>
    </div>
  );
}
