import { Flex, MantineColorScheme, SegmentedControl, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

const data = [
    {
        value: 'light',
        label: (
            <Flex align="center" justify="center" gap="2">
                <IconSun size="1.1rem" />
                Light
            </Flex>
        ),
    },
    {
        value: 'dark',
        label: (
            <Flex align="center" justify="center" gap="2">
                <IconMoon size="1.1rem" />
                Dark
            </Flex>
        ),
    },
];

function ThemeToggleFloatingIndicator() {
    const { setColorScheme } = useMantineColorScheme();
    return <SegmentedControl data={data} onChange={(value) => setColorScheme(value as MantineColorScheme)} />;
}

export { ThemeToggleFloatingIndicator };
