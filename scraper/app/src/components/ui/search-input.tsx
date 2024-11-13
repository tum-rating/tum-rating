import {InputProps} from "@/components/ui/input.tsx";
import React from "react";
import {cn} from "@/lib/utils.ts";


export type SearchInputProps = InputProps

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, leftSection, rightSection, ...props}, ref) => {
        return (
            <div className="relative flex items-center w-full">
                <input
                    type={type}
                    className={cn(
                        "flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9 peer",
                        rightSection ? "pr-10" : "",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-current">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path
                        d="m21 21-4.3-4.3"></path>
                </svg>
                {
                    rightSection && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightSection}
                        </span>
                    )
                }

            </div>
        );
    }
);

export default SearchInput;