import { Divider, Flex, Text, ThemeIcon } from '@mantine/core';
import { IconKey } from '@tabler/icons-react';
import { ReactElement } from 'react';

interface ModalHeaderProps {
    title: string;
    subTitle?: string | ReactElement;
    icon?: ReactElement;
}

const ModalHeader = (props: ModalHeaderProps) => {
    const { title, subTitle, icon = <IconKey width={21} /> } = props;
    return (
        <Flex mx="auto" w="100%" justify="center" direction="column" gap={'xs'} bg="var(--primary-light-gradient)">
            <Flex align="center" gap={6} px="sm" pt="sm">
                <ThemeIcon mb={1} variant="gradient" radius="sm" data-testid="icon">
                    {icon}
                </ThemeIcon>
                <Text fz={24} fw="bold" lineClamp={1}>
                    {title}
                </Text>
            </Flex>
            {subTitle && (
                <Text px="sm" fz="sm" fw="500" lineClamp={1}>
                    {subTitle}
                </Text>
            )}
            <Divider />
        </Flex>
    );
};

export { ModalHeader };
