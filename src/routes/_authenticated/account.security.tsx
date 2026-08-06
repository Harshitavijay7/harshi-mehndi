import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/account/security")({
  head: () => ({
    meta: [
      { title: "Security — HARSHI'S Mehndi Art" },
      { name: "description", content: "Change your password and manage your account session." },
    ],
  }),
  component: Security;
});

function Security() {
  const { user, updatePassword, signOut } = useAuth();
  const qc = useQueryClient();
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
      toast.success("Password updated.");
      setPassword("");
      setConfirm("");
    }
    setBusy(false);
  };

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Security</h1>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-gold" />
          <h2 className="font-semibold">Change password</h2>
        </div>
        <form onSubmit={onSubmit} className="mt-4 max-w-sm space-y-4">
          <div>
            <Label className="mb-1.5 block">New password</Label>
            <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <Label className="mb-1.5 block">Confirm password</Label>
            <Input required type="password" minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" variant="hero" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <h2 className="font-semibold">Session</h2>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {user?.email}</p>
        <Button variant="outline" className="mt-4" onClick={handleSignOut}>
          <LogOut className="mr-1.5 size-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}
