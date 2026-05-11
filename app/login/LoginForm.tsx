"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";
import { Button } from "@/components/ui/button";
import { Coffee, ShieldCheck, Mail, Lock } from "lucide-react";

export function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Demo Quick Login Buttons */}
      <div className="space-y-4">
        <div className="text-center mb-6">
          <span className="bg-accent/20 text-accent text-xs font-bold px-3 py-1 rounded-full">
            Demo Mode Active
          </span>
        </div>
        
        <form action={dispatch}>
          <input type="hidden" name="role" value="CUSTOMER" />
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full h-16 text-lg rounded-2xl flex items-center justify-center gap-3 shadow-md hover:-translate-y-1 transition-transform"
          >
            <Coffee className="w-6 h-6" />
            Login as Customer
          </Button>
        </form>

        <form action={dispatch}>
          <input type="hidden" name="role" value="ADMIN" />
          <Button 
            variant="outline"
            type="submit" 
            disabled={isPending}
            className="w-full h-16 text-lg rounded-2xl flex items-center justify-center gap-3 border-2 border-primary text-primary hover:bg-primary/5 hover:-translate-y-1 transition-transform"
          >
            <ShieldCheck className="w-6 h-6" />
            Login as Admin
          </Button>
        </form>
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
