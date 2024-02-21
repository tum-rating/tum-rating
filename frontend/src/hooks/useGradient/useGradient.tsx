import { useMantineColorScheme } from "@mantine/core";
import { useMemo } from 'react';

const PRIMARY_GRADIENT = { from: 'indigo', to: 'blue', deg: 90 };
const DARK_LAYOUT_GRADIENT = { from: 'indigo.9', to: 'blue.9', deg: 90 };
const LIGHT_LAYOUT_GRADIENT = { from: 'indigo.3', to: 'blue.4', deg: 90 };

const useGradient = () => {
    const { colorScheme } = useMantineColorScheme();

    const layoutGradient = useMemo(() => {
        return colorScheme === "dark" ? DARK_LAYOUT_GRADIENT : LIGHT_LAYOUT_GRADIENT;
    }, [colorScheme]);

    return { primaryGradient: PRIMARY_GRADIENT, layoutGradient };
}

export { useGradient };