import {useMantineColorScheme} from "@mantine/core";
import {useMemo} from 'react';

const PRIMARY_GRADIENT = {from: 'indigo', to: 'blue', deg: 90};
const DARK_LAYOUT_GRADIENT = {from: 'indigo.9', to: 'blue.9', deg: 90};
const LIGHT_LAYOUT_GRADIENT = {from: 'indigo.3', to: 'blue.4', deg: 90};


type Gradient = {
    from: string;
    to: string;
    deg: number;
};

type Palette = {
    [color: string]: {
        light: Gradient;
        dark: Gradient;
    };
};

const palette: Palette = {
    primary: {
        light: {from: 'indigo', to: 'blue', deg: 90},
        dark: {from: 'indigo', to: 'blue', deg: 90},
    },
    primaryLayout: {
        light: {from: 'indigo', to: 'blue', deg: 90},
        dark: {from: 'indigo.9', to: 'blue.9', deg: 90},
    },
    red: {
        light: {from: 'red.9', to: 'orange.9', deg: 90},
        dark: {from: 'red.3', to: 'orange.4', deg: 90},
    },
    green: {
        light: {from: 'green.9', to: 'lime.9', deg: 90},
        dark: {from: 'green.3', to: 'lime.4', deg: 90},
    },
    yellow: {
        light: {from: 'yellow.9', to: 'orange.9', deg: 90},
        dark: {from: 'yellow.3', to: 'orange.4', deg: 90},
    },
}


function buildObject(palette: Palette, preference: "light" | "dark") {
    const result = {};
    for (const key in palette) {
        result[key] = palette[key][preference];
    }
    return result;
}

const useGradient = () => {
    const {colorScheme} = useMantineColorScheme();
    return useMemo(() => {
        return buildObject(palette, colorScheme === "dark" ? "dark" : "light");
    }, [colorScheme]);
}

export {useGradient};