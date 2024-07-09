import {Flex, Text, Title} from '@mantine/core';
import {useEffect} from 'react';

import {PageWrapper} from '@/components/PageWrapper';

export const About = () => {
    useEffect(() => {
        const children = document.querySelectorAll('.children-animation > *');
        children.forEach((child: Element, index: number) => {
            (child as HTMLElement).style.animationDelay = `${0.025 * (index + 1)}s`;
        });
    }, []);

    return (
        <PageWrapper autoHeight>
            <Flex direction="column" align="center" justify="center" mt="xl" gap="xs" p="xl" className="children-animation">
                <Title>About Us</Title>
                <Text c="dimmed" ta="center">
                    We just wanted to make website with TUM University courses rating.
                </Text>
            </Flex>
        </PageWrapper>
    );
};
