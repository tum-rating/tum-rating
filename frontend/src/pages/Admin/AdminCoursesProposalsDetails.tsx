import {useParams} from 'react-router-dom';

import {AdminCollectionDetailsWrapper} from '@/components/AdminCollectionDetailsWrapper';
import {ProposalExpansion} from '@/components/AdminTable/CoursesProposals/ProposalExpansion.tsx';

const AdminCoursesProposalsDetails = () => {
    const {courseProposalId: id} = useParams();
    return (
        <AdminCollectionDetailsWrapper>
            <ProposalExpansion
                courseProposalId={id}
                style={{
                    borderRadius: 'var(--mantine-radius-xs)',
                }}
            />
        </AdminCollectionDetailsWrapper>
    );
};

export {AdminCoursesProposalsDetails};
