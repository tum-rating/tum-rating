import { Text } from '@mantine/core';

const CopyrightFooter = () => (
    <Text fz="xs" c="dimmed">
        TUM-RATING © {new Date().getFullYear()}
    </Text>
);

export { CopyrightFooter };
