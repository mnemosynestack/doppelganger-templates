"use client";

import { useState } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/MaterialIcon";
import GithubStarPill from "@/components/GithubStarPill";

interface MobileMenuProps {
    isLoggedIn: boolean;
    isAdmin?: boolean;
    signOutNode: React.ReactNode;
}

export function MobileMenu({ isLoggedIn, isAdmin, signOutNode }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
                aria-label="Open Mobile Menu"
                aria-expanded={isOpen}
            >
                <MaterialIcon name="menu" className="text-2xl" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed top-0 left-0 w-screen h-dvh bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu Dropdown / Slide-over */}
            <div
                className={`fixed top-0 right-0 h-dvh w-64 bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full bg-background p-6">
                    <div className="flex justify-between items-center mb-8">
                        <span className="font-semibold text-foreground">Menu</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
                            aria-label="Close Mobile Menu"
                        >
                            <MaterialIcon name="close" className="text-xl" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 text-sm uppercase tracking-wide font-semibold">
                        <a href="https://doppelgangerdev.com/docs" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            Docs
                        </a>
                        <a href="https://doppelgangerdev.com/blog" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            Blog
                        </a>
                        <a href="https://doppelgangerdev.com/releases" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            Releases
                        </a>

                        <div className="h-px w-full bg-[#262626] my-2" />

                        {isLoggedIn ? (
                            <>
                                {isAdmin && (
                                    <Link href="/admin" className="text-red-500 hover:text-red-400 transition-colors">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <Link href="/dashboard" className="text-foreground hover:text-white transition-colors">
                                    Creator Dashboard
                                </Link>
                                <div className="pt-2">
                                    {signOutNode}
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="bg-white text-black px-4 py-2 rounded-lg text-center font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}

                        <div className="pt-4">
                            <GithubStarPill />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
