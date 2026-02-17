"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    return (
        <button
            onClick={handleSignOut}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
            Sign Out
        </button>
    );
}
