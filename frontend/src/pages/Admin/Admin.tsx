import {Flex} from '@mantine/core';

import {AdminSummary} from '@/components/AdminSummary/AdminSummary.tsx';

const Admin = () => {
    return (
        <Flex direction="column" p="xs" pt="lg">
            <AdminSummary />
        </Flex>
    );
};

export {Admin};
