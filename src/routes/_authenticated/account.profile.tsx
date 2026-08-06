import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  fetchMyProfile,
  updateMyProfile,
  loadAvatar,
  saveAvatar,
  clearAvatar,
  fileToAvatar,
} from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/account/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — HARSHI'S Mehndi Art" },
      { name: "description", content: "Update your name, phone number and profile photo." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => fetchMyProfile(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (user) setAvatar(loadAvatar(user.id));
  }, [user]);

  const onPick = async (file: File) => {
    if (!user) return;
    try {
      const url = await fileToAvatar(file);
      saveAvatar(user.id, url);
      setAvatar(url);
      toast.success("Profile photo updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update photo.");
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      await updateMyProfile(user.id, { full_name: fullName, phone });
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile.");
    }
    setBusy(false);
  };

  const initial = (fullName || user?.email || "H").slice(0, 1).toUpperCase();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-5">
          <span className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-gradient-gold text-2xl font-bold text-gold-foreground">
            {avatar ? <img src={avatar} alt="Profile photo" className="size-full object-cover" /> : initial}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Camera className="mr-1.5 size-4" /> Change photo
            </Button>
            {avatar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { if (user) { clearAvatar(user.id); setAvatar(null); } }}
              >
                <Trash2 className="mr-1.5 size-4" /> Remove
              </Button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); }}
            />
          </div>
        </div>

        <form onSubmit={onSave} className="mt-6 space-y-4">
          <div>
            <Label className="mb-1.5 block">Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <Label className="mb-1.5 block">Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" />
          </div>
          <div>
            <Label className="mb-1.5 block">Email</Label>
            <Input value={user?.email ?? ""} disabled />
            <p className="mt-1 text-xs text-muted-foreground">Email can't be changed here.</p>
          </div>
          <Button type="submit" variant="hero" disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
