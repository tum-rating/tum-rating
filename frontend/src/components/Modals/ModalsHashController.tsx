import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PropsWithChildren, useEffect } from 'react';
import { openSignUpModal } from '@/components/Modals/SignUpModal';
import { openSignInModal } from '@/components/Modals/SignInModal';
import { openRecoveryModal } from '@/components/Modals/RecoveryModal';
import { openAddCourseModal } from '@/components/Modals/AddCourseModal';
import { openAddUserReviewModal } from '@/components/Modals/AddUserReview';
import { openEditUserReviewModal } from '@/components/Modals/EditUserReview';
import { openSpotlight } from '@/components/Modals/SpotlightModal';
import { isMobile } from 'react-device-detect';
import { closeAllModals, useModals } from '@mantine/modals';

export const ModalsHashController = (_: PropsWithChildren) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    let modalsContext = useModals();
    const modalSharedParams = {
        onClose: () => {
            //TODO cosik tu trzeba poprawic
            //https://github.com/mantinedev/mantine/issues/3623#issuecomment-1462329628
            closeAllModals();
            navigate('#');
        },
        fullScreen: isMobile,
        transitionProps: {
            duration: 0,
        },
        overlayProps: {
            backgroundOpacity: 0.55,
            blur: 3,
        },
    };
    const modals = {
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
        spotlight: { component: openSpotlight, params: { ...modalSharedParams } },
    };

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
