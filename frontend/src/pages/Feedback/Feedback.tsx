import {Button, Divider, Flex, Text, Title} from '@mantine/core';
import {IconBrandTelegram} from '@tabler/icons-react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet';

import {PageWrapper} from '@/components/PageWrapper';
import {TUM_RATING_TELEGRAM_URL} from '@/constants';

export const Feedback = () => {
    useEffect(() => {
        const children = document.querySelectorAll('.children-animation > *');
        children.forEach((child: Element, index: number) => {
            (child as HTMLElement).style.animationDelay = `${0.025 * (index + 1)}s`;
        });
    }, []);

    return (
        <PageWrapper autoHeight>
            <Helmet>
                <title>Feedback - TUM Rating</title>
                <meta name="description" content="Provide your feedback to TUM Rating. We value your input and look forward to hearing from you." />
                <meta property="og:title" content="Feedback - TUM Rating" />
                <meta property="og:description" content="Provide your feedback to TUM Rating. We value your input and look forward to hearing from you." />
                <meta name="twitter:title" content="Feedback - TUM Rating" />
                <meta name="twitter:description" content="Provide your feedback to TUM Rating. We value your input and look forward to hearing from you." />
            </Helmet>
            <Flex direction="column" align="center" justify="center" mt="xl" gap="xs" p="xl" className="children-animation">
                <Title>Get in Touch</Title>
                <Text c="dimmed" ta="center">
                    Feel free to reach out to us with any questions or feedback.
                </Text>
                <Divider w={300} my="md" />
                <Button target="_blank" rel="noreferrer" href={TUM_RATING_TELEGRAM_URL} component="a" variant="primary-gradient" w={180} leftSection={<IconBrandTelegram height={18} />}>
                    Telegram
                </Button>
            </Flex>
        </PageWrapper>
    );
};
