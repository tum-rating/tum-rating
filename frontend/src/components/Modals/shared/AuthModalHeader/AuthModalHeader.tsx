import {Divider, Flex, Text, ThemeIcon} from "@mantine/core";
import {IconKey} from "@tabler/icons-react";
import {ReactElement} from "react";

interface AuthModalHeaderProps {
    title: string;
    subTitle: string | ReactElement;
    icon?: ReactElement;

}

const AuthModalHeader = (props: AuthModalHeaderProps) => {
    const {title, subTitle, icon = <IconKey width={21}/>} = props;
    return (
        <Flex mx="auto" w="100%" justify="center" direction="column" gap={"xs"} bg="var(--primary-light-gradient)">
            <Flex align="center" gap={6} px="sm" pt="sm">
                <ThemeIcon mb={1} variant="gradient" radius="sm">
                    {icon}
                </ThemeIcon>
                <Text fz={24} fw="bold">{title}</Text>
            </Flex>
            <Text px="sm" fz="sm" fw="500">
                {
                    subTitle
                }
            </Text>
            <Divider/>
        </Flex>
    )
}

export {AuthModalHeader}