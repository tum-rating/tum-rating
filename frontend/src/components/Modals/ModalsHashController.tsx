import { closeAllModals, useModals } from '@mantine/modals';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useUser } from '@/auth/useUser';
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
    const { courseId } = useParams();
    const { data: user } = useUser();
    let modalsContext = useModals();
    const modalSharedParams = useMemo(
        () => ({
            onClose: () => {
                closeAllModals();
                navigate('#');
            },
            withinPortal: withinPortal,
            fullScreen: isMobile,
            withCloseButton: false,
            overlayProps: {
                backgroundOpacity: 0.55,
                blur: 3,
            },
        }),
        [navigate],
    );
    const modals = useMemo(
        () => ({
            'sign-in': { component: openSignInModal, params: { ...modalSharedParams }, notForLoggedUser: true },
            'sign-up': { component: openSignUpModal, params: { ...modalSharedParams }, notForLoggedUser: true },
            'forgot-password': { component: openRecoveryModal, params: { ...modalSharedParams }, notForLoggedUser: true },
            'add-course': { component: openAddCourseModal, params: { ...modalSharedParams } },
            'add-user-review': {
                component: openAddUserReviewModal,
                params: { ...modalSharedParams, innerProps: { courseId } },
            },
            'edit-user-review': {
                component: openEditUserReviewModal,
                params: { ...modalSharedParams, innerProps: { courseId } },
            },
        }),
        [modalSharedParams, courseId],
    );

    useEffect(() => {
        if (location.hash.includes('#modal=')) {
            const modalKey = location.hash.replace('#modal=', '');
            const modal = modals[modalKey];

            if (modal) {
                if (user && modal.notForLoggedUser) {
                    closeAllModals();
                    navigate('#');
                    return;
                }
                let emptyKeyFlag = false;
                if (modal.params.innerProps) {
                    Object.keys(modal.params.innerProps).forEach((key) => {
                        if (modal.params.innerProps[key] === undefined) {
                            emptyKeyFlag = true;
                        }
                    });
                }

                if (!emptyKeyFlag) {
                    modal.component(modal.params);
                } else {
                    // eslint-disable-next-line no-console
                    console.error(`Modal ${modalKey} cannot be opened because some keys in innerProps are undefined.`);
                }
            }
        } else {
            if (modalsContext.modals.length > 0) {
                closeAllModals();
            }
        }
    }, [location]);
    return null;
};
