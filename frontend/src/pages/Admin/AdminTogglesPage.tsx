import {Flex} from "@mantine/core";

import {AdminToggles} from "@/components/AdminToggles";
import {HEADER_HEIGHT} from "@/constants";

const AdminTogglesPage = () => {

    return (
        <Flex w="100%" justify='center' h={`calc(100vh - ${HEADER_HEIGHT}px)`} >
            <AdminToggles/>
        </Flex>
    )
}
export {AdminTogglesPage}
