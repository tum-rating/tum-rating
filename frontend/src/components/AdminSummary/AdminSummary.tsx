import {Box, Flex} from '@mantine/core';
import {IconLibrary, IconLibraryPlus, IconToggleLeft, IconUser} from '@tabler/icons-react';

import {useCoursesProposals} from '@/admin/courseProposals/useCoursesProposals.ts';
import {useToggles} from "@/admin/toggles/useToggles.tsx";
import {CourseProposal} from '@/admin/types.ts';
import {useAllUsers} from '@/admin/users/useAllUsers.ts';
import {AdminStatsBox} from '@/components/AdminSummary/AdminStatsBox.tsx';
import {getPath, Paths} from '@/routes/paths.ts';

function calculatePercentageIncrease(
    items: CourseProposal[],
    hours: number,
): {
    diffInPercent: number;
    diffValue: number;
    value: number;
} {
    if (!items) return {diffInPercent: null, diffValue: null, value: null};
    const totalItems = items.length;
    const now = new Date();
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    const itemsAdded = items.filter((item) => new Date(item.createdAt) >= cutoff).length;
    const diffValue = itemsAdded;
    const diffInPercent = totalItems === itemsAdded ? null : (diffValue / totalItems) * 100;
    return {diffInPercent, diffValue, value: totalItems};
}

const AdminSummary = () => {
    const {data: proposals} = useCoursesProposals();
    const {data: users} = useAllUsers();
    const {data: toggles} = useToggles();

    return (
        <Box>
            <Flex gap="md" wrap="wrap">
                <AdminStatsBox options={calculatePercentageIncrease(proposals, 12)} title="Proposals"
                               icon={<IconLibraryPlus/>} link={getPath(Paths.adminCoursesProposals)}
                               description="Total number of course proposals"/>
                <AdminStatsBox
                    options={{
                        value: null,
                        diffInPercent: null,
                        diffValue: null,
                    }}
                    title="Courses"
                    link={getPath(Paths.adminAllCourses)}
                    icon={<IconLibrary/>}
                    description="Total number of courses"
                />
                <AdminStatsBox
                    options={{
                        value: users?.length || 0,
                        diffInPercent: null,
                        diffValue: null,
                    }}
                    title="Users"
                    link={getPath(Paths.adminUsers)}
                    icon={<IconUser/>}
                    description="Total number of users"
                />
                <AdminStatsBox
                    options={{
                        value: toggles?.length || 0,
                        diffInPercent: null,
                        diffValue: null,
                    }}
                    title="Toggles"
                    link={getPath(Paths.adminToggles)}
                    icon={<IconToggleLeft/>}
                    description="Total number of toggles"
                />
            </Flex>
        </Box>
    );
};

export {AdminSummary};
