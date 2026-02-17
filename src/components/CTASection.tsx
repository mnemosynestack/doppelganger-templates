import Link from "next/link";
import MaterialIcon from "@/components/MaterialIcon";

export function CTASection() {
    return (
        <div className="flex flex-col items-center text-center py-20 px-4 border-t border-border mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Can't find what you need?</h2>
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
                Build your own automation task locally with our visual builder and share it with the world.
            </p>

            <div className="flex items-center gap-4">
                <Link
                    href="https://doppelgangerdev.com/docs"
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-border hover:bg-white/5 transition-colors text-foreground flex items-center gap-2"
                >
                    Read Documentation
                    <MaterialIcon name="arrow_forward" className="text-sm" />
                </Link>
            </div>
        </div>
    );
}
