"use client";

import { useRouter } from "next/navigation";
import MaterialIcon from "./MaterialIcon";

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
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center p-2 rounded-full hover:bg-[#1f1f1f]"
            title="Sign Out"
        >
            <MaterialIcon name="logout" className="text-lg" />
        </button>
    );
}
