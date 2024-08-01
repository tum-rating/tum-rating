import {Progress, Text, UnstyledButton, Box} from '@mantine/core';
import {useInterval} from '@mantine/hooks';
import clsx from 'clsx';
import {useEffect, useState} from 'react';
import {isMobile} from 'react-device-detect';

import classes from './FloatingMenuTelegramButton.module.css';
import {TelegramIcon} from './TelegramIcon.tsx';

import {TUM_RATING_TELEGRAM_URL} from "@/constants";
import {useFeedbackCTAContext} from '@/context';

const telegramLink = TUM_RATING_TELEGRAM_URL;

const FloatingMenuTelegramButton = () => {
    const [progress, setProgress] = useState(0);
    const {feedbackCTA, setFeedbackCTA} = useFeedbackCTAContext();

    const interval = useInterval(() => {
        setProgress((current) => {
            if (current < 100) {
                return current + 1;
            } else {
                return 0;
            }
        });
    }, 100);

    useEffect(() => {
        if (progress === 100) {
            setProgress(0);
            setFeedbackCTA(false);
        }
    }, [progress]);

    useEffect(() => {
        if (feedbackCTA) {
            interval.start();
        } else {
            interval.stop();
        }
    }, [feedbackCTA]);

    const [status, setStatus] = useState<'active' | 'inactive' | null>(null);

    return (
        <UnstyledButton
            component="a"
            href={telegramLink}
            target="_blank"
            onClick={()=>{
                setProgress(0);
                setFeedbackCTA(false);
            }}
            onMouseEnter={() => {
                if (isMobile) return;
                if (!feedbackCTA) {
                    setStatus('active');
                }
            }}
            onMouseLeave={() => {
                if (isMobile) return;
                if (!feedbackCTA) {
                    setStatus('inactive');
                }
            }}
            className={clsx(classes.button, {
                glow: feedbackCTA,
                [status]: !isMobile && !feedbackCTA ? status : '',
            })}
        >
            <Box style={{overflow: 'hidden'}} pl={7}>
                <Text lh={1.3} fw="600" className={classes.text} c="black" lineClamp={1}>
                    {' '}
                    Send Feedback
                </Text>
            </Box>
            {progress !== 0 && <Progress value={progress} className={classes.progress} color="white" radius="sm" />}
            <TelegramIcon className={classes.icon} height={35} width={35} />
        </UnstyledButton>
    );
};

export {FloatingMenuTelegramButton};
