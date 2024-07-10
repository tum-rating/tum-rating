import {Button, Divider, Flex, Text, Title} from '@mantine/core';
import {IconBrandTelegram} from '@tabler/icons-react';
import {useEffect} from 'react';

import {PageWrapper} from '@/components/PageWrapper';

export const Feedback = () => {
    useEffect(() => {
        const children = document.querySelectorAll('.children-animation > *');
        children.forEach((child: Element, index: number) => {
            (child as HTMLElement).style.animationDelay = `${0.025 * (index + 1)}s`;
        });
    }, []);

    return (
        <PageWrapper autoHeight>
            <Flex direction="column" align="center" justify="center" mt="xl" gap="xs" p="xl" className="children-animation">
                <Title>Get in Touch</Title>
                <Text c="dimmed" ta="center">
                    Feel free to reach out to us with any questions or feedback.
                </Text>
                <Divider w={300} my="md" />
                <Button variant="primary-gradient" w={180} leftSection={<IconBrandTelegram height={18} />}>
                    Telegram
                </Button>
            </Flex>
        </PageWrapper>
    );
};
