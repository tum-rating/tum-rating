import { Affix, Flex } from '@mantine/core';

import { FloatingMenuTelegramButton } from './FloatingMenuTelegramButton';

const FloatingMenu = () => {
    return (
        <Affix position={{ bottom: 20, right: 20 }}>
            <Flex direction="column" align="flex-end">
                <FloatingMenuTelegramButton />
            </Flex>
        </Affix>
    );
};

export { FloatingMenu };
