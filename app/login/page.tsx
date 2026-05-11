import { Metadata } from "next";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Breywboy Café",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center">
          <img src="/assets/brey-this.png" alt="Breywboy" className="h-8 w-auto" />
        </Link>
      </div>
      
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Breywboy account.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
