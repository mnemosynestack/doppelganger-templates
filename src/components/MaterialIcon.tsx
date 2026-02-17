"use client";

import clsx from "clsx";

interface MaterialIconProps {
    name: string;
    className?: string;
    fill?: boolean;
}

export default function MaterialIcon({ name, className, fill }: MaterialIconProps) {
    return (
        <span
            className={clsx("material-symbols-outlined", className)}
            style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}
        >
            {name}
        </span>
    );
}
