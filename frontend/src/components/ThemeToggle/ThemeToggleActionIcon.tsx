import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

const ThemeToggleActionIcon = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    return (
        <ActionIcon data-testid="color-scheme-toggle" variant="outline" onClick={toggleColorScheme}>
            {colorScheme === 'dark' ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
        </ActionIcon>
    );
};

export { ThemeToggleActionIcon };
