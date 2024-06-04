import {useParams} from 'react-router-dom';

import { AdminCollectionDetailsWrapper } from '@/components/AdminCollectionDetailsWrapper';
import { UserExpansion } from '@/components/AdminTable/Users/UserExpansion.tsx';

const AdminUserDetails = () => {
    const { userId: id} = useParams();
    return (
        <AdminCollectionDetailsWrapper>
            <UserExpansion userId={id} style={{
                borderRadius: "var(--mantine-radius-xs)"
            }} />
        </AdminCollectionDetailsWrapper>
    );
};

export { AdminUserDetails };
