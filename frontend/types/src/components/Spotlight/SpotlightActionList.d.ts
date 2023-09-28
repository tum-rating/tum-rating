import React from 'react';
import { DefaultProps, Selectors } from '@mantine/core';
import type { SpotlightAction } from './types';
import type { DefaultActionProps, DefaultActionStylesNames } from './SpotlightAction';
import { Review } from "../../reviews/types";
export type ActionsListStylesNames = Selectors<typeof useStyles> | DefaultActionStylesNames;
export interface ActionsListProps extends DefaultProps<ActionsListStylesNames>, React.ComponentPropsWithoutRef<'div'> {
    actions: Review[];
    actionComponent?: React.FC<DefaultActionProps>;
    hovered: number;
    query: string;
    nothingFoundMessage?: React.ReactNode;
    close: () => void;
    onActionTrigger(action: SpotlightAction): void;
}
declare const useStyles: (params: void, options?: import("@mantine/core").UseStylesOptions<string> | undefined) => {
    classes: {
        nothingFound: string;
        actions: string;
        actionsGroup: string;
    };
    cx: (...args: any) => string;
    theme: import("@mantine/core").MantineTheme;
};
export declare function ActionsList({ actions, actionComponent, hovered, onActionTrigger, query, nothingFoundMessage, close, ...others }: ActionsListProps): import("react/jsx-runtime").JSX.Element;
export {};
