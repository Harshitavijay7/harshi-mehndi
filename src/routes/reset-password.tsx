import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — HARSHI'S Mehndi Art" },
      { name: "description", content: "Set a new password for your HARSHI'S Mehndi Art account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    setBusy(true);
    const { error } = await updatePassword(password);
    if (error) toast.error(error);
    else {
      toast.success("Password updated! You're signed in.");
      router.navigate({ to: "/" });
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center">
        <KeyRound className="mx-auto size-10 text-gold" />
        <h1 className="mt-3 text-3xl font-bold">Set a New Password</h1>
        <p className="mt-2 text-muted-foreground">Choose a new password for your account.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
        <div>
          <Label className="mb-1.5 block">New Password</Label>
          <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <div>
          <Label className="mb-1.5 block">Confirm Password</Label>
          <Input required type="password" minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
          {busy ? "Please wait..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
