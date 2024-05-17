import { closeAllModals, useModals } from '@mantine/modals';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { openAddCourseModal } from '@/components/Modals/AddCourseModal';
import { openAddUserReviewModal } from '@/components/Modals/AddUserReview';
import { openEditUserReviewModal } from '@/components/Modals/EditUserReview';
import { openRecoveryModal } from '@/components/Modals/RecoveryModal';
import { openSignInModal } from '@/components/Modals/SignInModal';
import { openSignUpModal } from '@/components/Modals/SignUpModal';

interface ModalsHashControllerProps extends PropsWithChildren {
    withinPortal?: boolean;
}

export const ModalsHashController = ({ withinPortal = true }: ModalsHashControllerProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    let modalsContext = useModals();
    const modalSharedParams = useMemo(
        () => ({
            onClose: () => {
                closeAllModals();
                navigate('#');
            },
            withinPortal: withinPortal,
            fullScreen: isMobile,
            overlayProps: {
                backgroundOpacity: 0.55,
                blur: 3,
            },
        }),
        [navigate],
    );
    const modals = useMemo(
        () => ({
            'sign-in': { component: openSignInModal, params: { ...modalSharedParams } },
            'sign-up': { component: openSignUpModal, params: { ...modalSharedParams } },
            'forgot-password': { component: openRecoveryModal, params: { ...modalSharedParams } },
            'add-course': { component: openAddCourseModal, params: { ...modalSharedParams } },
            'add-user-review': {
                component: openAddUserReviewModal,
                params: { ...modalSharedParams, innerProps: { courseId: id } },
            },
            'edit-user-review': {
                component: openEditUserReviewModal,
                params: { ...modalSharedParams, innerProps: { courseId: id } },
            },
        }),
        [modalSharedParams, id],
    );

    useEffect(() => {
        if (location.hash.includes('#modal=')) {
            const modalKey = location.hash.replace('#modal=', '');
            const modal = modals[modalKey];
            if (modal) {
                modal.component(modal.params);
            }
        } else {
            if (modalsContext.modals.length > 0) {
                closeAllModals();
            }
        }
    }, [location]);
    return null;
};
