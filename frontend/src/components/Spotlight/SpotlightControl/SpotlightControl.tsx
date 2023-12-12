import { ComponentPropsWithoutRef } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { ActionIcon, Group, Text, UnstyledButton } from '@mantine/core';
import { BrowserView } from 'react-device-detect';
import classes from './SpotlightControl.module.css';
import clsx from 'clsx';
interface SearchControlProps extends ComponentPropsWithoutRef<'button'> {
    onClick(): void;
}

const SpotlightControl = ({ className, ...others }: SearchControlProps) => {
    return (
        <>
            <UnstyledButton ml="auto" className={clsx(classes.hiddenMobile, classes.root)} data-testid="cypress-global-search" {...others}>
                <Group gap="xs" className={classes.hiddenMobile}>
                    <IconSearch size=".9rem" stroke={1.5} />
                    <Text size="sm" c="dimmed" pr={80}>
                        Search
                    </Text>
                    <BrowserView>
                        <Text fw={700} className={classes.shortcut}>
                            /
                        </Text>
                    </BrowserView>
                </Group>
            </UnstyledButton>
            <ActionIcon ml="auto" variant="outline" className={classes.hiddenDesktop} data-testid="cypress-global-search">
                <IconSearch size="1.1rem" stroke={1.5} />
            </ActionIcon>
        </>
    );
};

export { SpotlightControl };
