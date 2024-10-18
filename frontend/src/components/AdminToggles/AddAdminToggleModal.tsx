import {Modal} from "@mantine/core";

import {useAddToggle} from "@/admin/toggles/useAddToggle.tsx";
import {AdminToggleForm} from "@/components/AdminToggles/AdminToggleForm.tsx";

interface AddAdminToggleModalProps {
    opened: boolean;
    close: () => void;
}

const AddAdminToggleModal = (props: AddAdminToggleModalProps) => {
    const {opened, close} = props;
    const {mutate, isPending, isSuccess, error} = useAddToggle();

    return (
        <Modal opened={opened} onClose={close} title="Add new toggle">
            <AdminToggleForm
                initialValues={{name: '', description: '', enabled: false}}
                onSubmit={mutate}
                isPending={isPending}
                isSuccess={isSuccess}
                error={error}
            />
        </Modal>
    )
}

export {AddAdminToggleModal}