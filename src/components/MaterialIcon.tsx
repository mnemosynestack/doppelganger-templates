"use client";

import { ComponentProps } from "react";
import clsx from "clsx";

interface MaterialIconProps extends ComponentProps<"span"> {
    name: string;
    fill?: boolean;
}

export default function MaterialIcon({ name, className, fill, ...props }: MaterialIconProps) {
    return (
        <span
            className={clsx("material-symbols-outlined", className)}
            style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}
            {...props}
        >
            {name}
        </span>
    );
}
