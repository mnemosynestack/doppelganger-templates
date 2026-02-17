import { Suspense } from "react";
import MaterialIcon from "@/components/MaterialIcon";
import Link from "next/link";

// This page is mostly a fallback/error page since the API route handles the redirect on success.
// If the user ends up here, something likely went wrong or they are manually visiting.
export default function VerifyPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <MaterialIcon name="sync" className="text-3xl animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying...</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Please wait while we verify your email address.
            </p>
        </div>
    );
}
