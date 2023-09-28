import React from 'react';
import { DefaultProps, Selectors } from '@mantine/core';
import type { SpotlightAction } from './types';
declare const useStyles: (params: void, options?: import("@mantine/core").UseStylesOptions<string> | undefined) => {
    classes: {
        action: string;
        actionDescription: string;
        actionIcon: string;
        actionBody: string;
        actionHighlight: string;
    };
    cx: (...args: any) => string;
    theme: import("@mantine/core").MantineTheme;
};
export type DefaultActionStylesNames = Selectors<typeof useStyles>;
export interface DefaultActionProps extends DefaultProps<DefaultActionStylesNames>, React.ComponentPropsWithoutRef<'button'> {
    action: SpotlightAction;
    hovered: boolean;
    onTrigger(): void;
    query: string;
    radius: number;
}
export declare function DefaultAction({ action, styles, classNames, hovered, onTrigger, query, radius, ...others }: DefaultActionProps): import("react/jsx-runtime").JSX.Element;
export {};
