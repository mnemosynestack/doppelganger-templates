import Link from "next/link";
import Image from "next/image";
import GithubStarPill from "@/components/GithubStarPill";
import { cookies } from "next/headers";
import { SignOutButton } from "./SignOutButton";

export async function Navbar() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const isLoggedIn = !!token;

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Doppelganger Logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-8"
                    />
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
                {isLoggedIn && (
                    <Link href="/dashboard" className="hover:text-foreground transition-colors">
                        Dashboard
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4">
                <GithubStarPill />
                {isLoggedIn ? (
                    <SignOutButton />
                ) : (
                    <Link href="/auth/signin">
                        <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
