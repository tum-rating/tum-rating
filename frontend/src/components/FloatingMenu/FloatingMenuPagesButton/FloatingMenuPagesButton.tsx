import {Menu, ActionIcon} from "@mantine/core";
import {IconDotsVertical, IconSettings} from "@tabler/icons-react";

const FloatingMenuPagesButton = () =>{
return (
    <Menu shadow="md" width={200}>
        <Menu.Target>
            <ActionIcon
                p={2}
                radius={"xl"}
                w={39}
                h={39}

            > <IconDotsVertical/></ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<IconSettings height={35} width={35} />}>
                Settings
            </Menu.Item>
        </Menu.Dropdown>
    </Menu>

)
}

export { FloatingMenuPagesButton };
