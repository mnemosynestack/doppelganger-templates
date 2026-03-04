"use client";

import { ComponentProps, memo } from "react";
import clsx from "clsx";

interface MaterialIconProps extends ComponentProps<"span"> {
    name: string;
    fill?: boolean;
}

// ⚡ Bolt: Wrapped in React.memo to prevent unnecessary re-renders of this frequently used
// pure component across the app (in lists, cards, sidebars, etc.)
export default memo(function MaterialIcon({ name, className, fill, ...props }: MaterialIconProps) {
    return (
        <span
            className={clsx("material-symbols-outlined", className)}
            style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}
            {...props}
        >
            {name}
        </span>
    );
});
