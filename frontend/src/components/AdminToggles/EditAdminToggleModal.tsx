import {Modal} from "@mantine/core";

import {useSetToggle} from "@/admin/toggles/useSetToggle.tsx";
import {Toggle} from "@/admin/types.ts";
import {AdminToggleForm} from "@/components/AdminToggles/AdminToggleForm.tsx";

interface EditAdminToggleModalProps {
    opened: boolean;
    close: () => void;
    toggle: Toggle;
}

const EditAdminToggleModal = (props: EditAdminToggleModalProps) => {
    const {opened, close, toggle} = props;
    const {mutate, isPending, isSuccess, isError} = useSetToggle();

    return (
        <Modal opened={opened} onClose={close} title="Edit toggle">
            <AdminToggleForm
                initialValues={toggle}
                onSubmit={mutate}
                isPending={isPending}
                isSuccess={isSuccess}
                error={isError}
            />
        </Modal>
    )
}

export {EditAdminToggleModal}