import {Box, Text} from '@mantine/core';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet';

import classes from './About.module.css';

import {AnimatedSignature} from '@/components/AnimatedSignature';
import {Breadcrumbs} from '@/components/Breadcrumbs';
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
            <Helmet>
                <title>About Us - TUM Rating</title>
                <meta name="description" content="Learn more about TUM Rating and our mission to help students choose the best courses at the Technical University of Munich." />
                <meta property="og:title" content="About Us - TUM Rating" />
                <meta property="og:description" content="Learn more about TUM Rating and our mission to help students choose the best courses at the Technical University of Munich." />
                <meta name="twitter:title" content="About Us - TUM Rating" />
                <meta name="twitter:description" content="Learn more about TUM Rating and our mission to help students choose the best courses at the Technical University of Munich." />
            </Helmet>
            <Box p="xl" className="children-animation">
                <Breadcrumbs courseName={'About'} isLoading={false} />
                <h1>About Us</h1>
                <Text c="dimmed" maw={500}>
                    At TUM Rating, we make it easier for you to choose the best courses at the Technical University of Munich. Our platform lets you read and share reviews, rate courses, and see what other students think. We aim to simplify your course selection and help you make smart choices about your studies. Join us to connect with fellow students and get the most out of your time at TUM!
                </Text>
                <div className={classes.signatureContainer}>
                    <AnimatedSignature />
                </div>
            </Box>
        </PageWrapper>
    );
};
