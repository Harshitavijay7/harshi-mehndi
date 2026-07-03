import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — HARSHI'S Mehndi Art" },
      { name: "description", content: "Sign in or create an account to track your mehndi orders and bookings." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.navigate({ to: "/" });
  }, [user, loading, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error);
      else {
        toast.success("Welcome back!");
        router.navigate({ to: "/" });
      }
    } else if (mode === "signup") {
      const { error } = await signUp(email, password, fullName);
      if (error) toast.error(error);
      else {
        toast.success("Account created! You're all set.");
        router.navigate({ to: "/" });
      }
    } else {
      const { error } = await resetPassword(email);
      if (error) toast.error(error);
      else toast.success("Password reset link sent — check your email.");
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center">
        <Sparkles className="mx-auto size-10 text-gold" />
        <h1 className="mt-3 text-3xl font-bold">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p className="mt-2 text-muted-foreground">
          {mode === "login" ? "Sign in to your HARSHI'S account." : "Join HARSHI'S Mehndi Art."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
        {mode === "signup" && (
          <div>
            <Label className="mb-1.5 block">Full Name</Label>
            <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>
        )}
        <div>
          <Label className="mb-1.5 block">Email</Label>
          <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>
        <div>
          <Label className="mb-1.5 block">Password</Label>
          <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="font-medium text-primary hover:underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
