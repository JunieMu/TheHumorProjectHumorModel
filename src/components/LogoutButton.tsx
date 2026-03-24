"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-xs font-bold font-typewriter uppercase text-vintage-gray/60 hover:text-vintage-pink-dark transition-colors"
    >
      <LogOut size={14} />
      Sign Out
    </button>
  );
}
