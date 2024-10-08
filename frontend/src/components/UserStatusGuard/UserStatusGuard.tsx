import {Alert, Anchor, Box, Button, Card, Loader, Text} from "@mantine/core";
import {IconFaceIdError, IconFaceId} from "@tabler/icons-react";
import classes from "./UserStatusGuard.module.css"
import {useNavigate} from "react-router-dom";
import {getPath, Paths} from "@/routes/paths.ts";

interface UserStatusGuardProps {
    mode: 'sso-login' | 'login',
    statusPanels?: UserStatusGuardPanelInterface[],
}

interface UserStatusGuardPanelInterface {
    type: 'info' | 'warning' | 'request',
    status: 'error' | 'loading' | 'success',
    title: string,
    content: string,
    apiContextMessage?: string,
}

interface IconResolverProps {
    type: UserStatusGuardPanelInterface["type"],
    status: UserStatusGuardPanelInterface["status"],
}

const IconResolver = ({type, status}: IconResolverProps) => {
    const iconMap: Record<UserStatusGuardPanelInterface["type"], Record<UserStatusGuardPanelInterface["status"], JSX.Element>> = {
        info: {
            error: <IconFaceIdError/>,
            loading: <Loader size='25'/>,
            success: <IconFaceId/>
        },
        warning: {
            error: <IconFaceIdError/>,
            loading: <Loader size='25'/>,
            success: <IconFaceId/>
        },
        request: {
            error: <IconFaceIdError/>,
            loading: <Loader size='25'/>,
            success: <IconFaceId/>
        },
    }
    return iconMap[type][status];
}

const UserStatusGuard = (props: UserStatusGuardProps) => {
    return (
        <Box className={classes.userStatusGuardContainer}>
            <Card shadow="sm" radius="md" withBorder className={classes.userStatusGuardCard}>
                {props.statusPanels?.map((panel, index) => {
                    return (
                        <UserStatusSection key={index} title={panel.title} type={panel.type} content={panel.content}
                                           status={panel.status} apiContextMessage={panel.apiContextMessage}/>
                    )
                })}
            </Card>
        </Box>
    )
}

const UserStatusSection = ({title, type, content, status, apiContextMessage}: UserStatusGuardPanelInterface) => {
    const navigate = useNavigate();
    return (
        // <Notification
        //     title={title}
        //     withCloseButton={false}
        //     loading={status === 'loading'}
        //     color={status === 'error' ? 'red' : 'blue'}
        //     icon={<IconResolver type={type} status={status}/>}
        //     className={classes.userStatusGuardNotification}
        // >
        //     {content}
        // </Notification>
        <Alert
            title={<Text fw='bold' fz='md'>{title}</Text>}
            color={status === 'error' ? 'red' : 'blue'}
            icon={<IconResolver type={type} status={status}/>}
            className={classes.userStatusGuardAlert}
        >
            <Text fw={500} fz='sm'>
                {content}

                {status === 'error' && (
                    <>
                        <Text mt='sm' fz='sm' fw={600} c='red'>
                            {
                                apiContextMessage || ''
                            }
                        </Text>

                        <Button mt='xs'  onClick={()=> navigate("/" + getPath(Paths["signIn"]))}>
                            Try again
                        </Button>
                    </>
                )}


            </Text>
        </Alert>
    );
}

export {UserStatusGuard, type UserStatusGuardPanelInterface}