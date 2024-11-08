import * as React from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                success: "border-transparent bg-success text-success-foreground shadow hover:bg-success/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    tooltip?: React.ReactNode;
}

function Badge({className, variant, tooltip, ...props}: BadgeProps) {
    const badgeContent = <div className={cn(badgeVariants({variant}), className)} {...props} />;

    return tooltip ? (
        <Tooltip>
            <TooltipTrigger asChild>
                {badgeContent}
            </TooltipTrigger>
            <TooltipContent>
                {tooltip}
            </TooltipContent>
        </Tooltip>
    ) : (
        badgeContent
    );
}

export {Badge, badgeVariants};