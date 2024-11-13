import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, leftSection, rightSection, ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                {leftSection && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-black">{leftSection}</span>}
                <input
                    type={type}
                    className={cn(
                        "peer flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        leftSection ? "pl-10" : "",
                        rightSection ? "pr-10" : "",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {rightSection && <span className="absolute right-3 text-gray-400 peer-focus:text-current">{rightSection}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
