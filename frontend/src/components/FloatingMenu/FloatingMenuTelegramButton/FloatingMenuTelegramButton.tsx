import { Progress, Text, UnstyledButton } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import clsx from 'clsx';
import { useState } from 'react';

import classes from './FloatingMenuTelegramButton.module.css';
import { TelegramIcon } from './TelegramIcon.tsx';

const telegramLink = 'https://t.me/+ZoFa4DCe5-1jMDM0';

const FloatingMenuTelegramButton = () => {
    const [progress, setProgress] = useState(0);
    const interval = useInterval(
        () =>
            setProgress((current) => {
                if (current < 100) {
                    return current + 1;
                }
                interval.stop();
                return 0;
            }),
        100,
    );
    return (
        <UnstyledButton
            component="a"
            href={telegramLink}
            target="_blank"
            onClick={() => {
                !interval.active && interval.start();
            }}
            className={clsx(classes.button, {
                glow: false,
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
