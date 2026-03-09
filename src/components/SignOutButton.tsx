"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialIcon from "./MaterialIcon";

export function SignOutButton() {
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch {
            setIsSigningOut(false);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-label="Sign out"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center p-2 rounded-full hover:bg-[#1f1f1f] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Sign Out"
        >
            {isSigningOut ? (
                <MaterialIcon name="hourglass_empty" className="text-lg animate-spin" />
            ) : (
                <MaterialIcon name="logout" className="text-lg" />
            )}
        </button>
    );
}
