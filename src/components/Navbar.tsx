import Link from "next/link";
import Image from "next/image";
import GithubStarPill from "@/components/GithubStarPill";
import { cookies } from "next/headers";
import { SignOutButton } from "./SignOutButton";
import { MobileMenu } from "./MobileMenu";
import { verifyToken } from "@/lib/auth";

export async function Navbar() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const isLoggedIn = !!token;

    let isAdmin = false;
    if (token) {
        const payload = await verifyToken(token);
        if (process.env.ADMIN_USERNAME && payload?.username === process.env.ADMIN_USERNAME) {
            isAdmin = true;
        }
    }

    return (
        <nav className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <Link href="/">
                    <Image
                        src="/logo.svg"
                        alt="Figranium Logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-10"
                    />
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wide text-muted-foreground font-semibold flex-1 justify-center">
                <a href="https://figranium.dev/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Docs
                </a>
                <a href="https://figranium.dev/blog" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Blog
                </a>
                <a href="https://figranium.dev/releases" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Releases
                </a>
            </div>

            <div className="flex items-center gap-4">
                {isAdmin && (
                    <Link href="/admin" className="hidden sm:block text-sm font-semibold uppercase tracking-wide text-red-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-md hover:bg-[#121212]">
                        Admin Dashboard
                    </Link>
                )}
                {isLoggedIn && (
                    <Link href="/dashboard" className="hidden sm:block text-sm font-semibold uppercase tracking-wide text-foreground hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-[#121212]">
                        Creator Dashboard
                    </Link>
                )}
                <div className="hidden sm:block">
                    <GithubStarPill />
                </div>

                <div className="hidden md:block">
                    {isLoggedIn ? (
                        <SignOutButton />
                    ) : (
                        <Link
                            href="/auth/signin"
                            className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors inline-block"
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Menu (hamburger icon handles internal state) */}
                <MobileMenu isLoggedIn={isLoggedIn} isAdmin={isAdmin} signOutNode={<SignOutButton />} />
            </div>
        </nav>
    );
}
