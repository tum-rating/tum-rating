/// <reference types="react" />
export interface DotsProps extends React.ComponentPropsWithoutRef<'svg'> {
    size?: number;
    radius?: number;
}
export declare function Dots({ size, radius, ...others }: DotsProps): import("react/jsx-runtime").JSX.Element;
