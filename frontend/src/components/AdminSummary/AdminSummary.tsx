import {Box, Flex} from "@mantine/core";
import {IconLibrary, IconLibraryPlus, IconUser} from "@tabler/icons-react";

import {useAllUsers} from "@/admin/useAllUsers.ts";
import {useCoursesProposals} from "@/admin/useCoursesProposals.ts";
import {AdminStatsBox} from "@/components/AdminSummary/AdminStatsBox.tsx";
import {getPath, Paths} from "@/routes/paths.ts";

const AdminSummary = () => {
    const {data: proposals} = useCoursesProposals();
    const {data: user} = useAllUsers();
    return (
        <Box>
            <Flex gap="md" wrap="wrap">
                <AdminStatsBox
                    value={proposals?.length || 0}
                    title="Proposals"
                    icon={<IconLibraryPlus/>}
                    link={getPath(Paths.adminCoursesProposals)}
                    description="Total number of course proposals"
                />
                <AdminStatsBox
                    value={0}
                    title="Courses"
                    link={getPath(Paths.adminCourses)}
                    icon={<IconLibrary/>}
                    description="Total number of courses"
                />
                <AdminStatsBox
                    value={user?.length || 0}
                    title="Users"
                    link={getPath(Paths.adminUsers)}
                    icon={<IconUser/>}
                    description="Total number of users"
                />
            </Flex>
        </Box>
    )
}

export {AdminSummary}