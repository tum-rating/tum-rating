import {Button, Flex} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks";

import {AddAdminToggleModal} from "./AddAdminToggleModal.tsx";
import classes from "./AdminToggleControls.module.css"

interface AdminToggleControlsProps {
    isLoading: boolean;
}

const AdminToggleControls = ({isLoading}: AdminToggleControlsProps) => {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <Flex className={classes.controlsContainer} ml='auto' gap='xs'>
            <Button loading={isLoading} size='xs' onClick={open}>
                Add New
            </Button>
            {
                !isLoading && <AddAdminToggleModal opened={opened} close={close}/>
            }
        </Flex>
    )
}

export {AdminToggleControls}
