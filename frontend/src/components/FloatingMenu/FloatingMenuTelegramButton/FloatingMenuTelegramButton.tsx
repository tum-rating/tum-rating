import { Progress, Text, UnstyledButton } from '@mantine/core';
import clsx from 'clsx';
import { useEffect, useState, useRef } from 'react';

import classes from './FloatingMenuTelegramButton.module.css';
import { TelegramIcon } from './TelegramIcon.tsx';

import { useFeedbackCTAContext } from '@/context';

const telegramLink = 'https://t.me/+ZoFa4DCe5-1jMDM0';

const FloatingMenuTelegramButton = () => {
    const [progress, setProgress] = useState(0);
    const { feedbackCTA, setFeedbackCTA } = useFeedbackCTAContext();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (feedbackCTA) {
            intervalRef.current = setInterval(() => {
                setProgress((current) => {
                    if (current < 100) {
                        return current + 1;
                    } else {
                        clearInterval(intervalRef.current);
                        setFeedbackCTA(false);
                        return 0;
                    }
                });
            }, 100);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [feedbackCTA]);

    return (
        <UnstyledButton
            component="a"
            href={telegramLink}
            target="_blank"
            className={clsx(classes.button, {
                glow: feedbackCTA,
            })}
        >
            <Text fz="13" lh={1.3} fw="600" className={classes.text} c="black">
                Send Feedback
            </Text>
            {progress !== 0 && <Progress value={progress} className={classes.progress} color="white" radius="sm" />}
            <TelegramIcon className={classes.icon} height={35} width={35} />
        </UnstyledButton>
    );
};

export { FloatingMenuTelegramButton };