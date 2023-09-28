import React from 'react';
import { DefaultProps } from '@mantine/core';
interface SearchControlProps extends DefaultProps, React.ComponentPropsWithoutRef<'button'> {
    onClick(): void;
}
declare const SpotlightControl: ({ className, ...others }: SearchControlProps) => import("react/jsx-runtime").JSX.Element;
export { SpotlightControl };
