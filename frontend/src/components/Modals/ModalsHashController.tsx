import {useLocation, useNavigate} from "react-router-dom";
import {PropsWithChildren, useEffect} from "react";
import {openSignUpModal} from "@/components/Modals/SignUpModal";
import {openSignInModal} from "@/components/Modals/SignInModal";
import {openRecoveryModal} from "@/components/Modals/RecoveryModal";
import {openAddCourseModal} from "@/components/Modals/AddCourseModal";
import {openAddUserReviewModal} from "@/components/Modals/AddUserReview";
import {openEditUserReviewModal} from "@/components/Modals/EditUserReview";
import {openSpotlight} from "@/components/Modals/SpotlightModal";
import {isMobile} from 'react-device-detect';
import {useModals,closeAllModals} from "@mantine/modals";

export const ModalsHashController = (_: PropsWithChildren) => {
    const location = useLocation();
    const navigate = useNavigate()
    let modalsContext = useModals();
    const modalSharedParams = () => {
       return {
           onClose: () => {
               //TODO cosik tu trzeba poprawic
               //https://github.com/mantinedev/mantine/issues/3623#issuecomment-1462329628
               closeAllModals()
               navigate('#')
           },
           transitionProps: {
               duration: 0
           },
           isMobile: isMobile
       }
    }
    const modals = {
        "sign-in": {component: openSignInModal, params: {...modalSharedParams()}},
        "sign-up": {component: openSignUpModal, params: {...modalSharedParams()}},
        "forgot-password": {component: openRecoveryModal, params: {...modalSharedParams()}},
        "add-course": {component: openAddCourseModal, params: {...modalSharedParams()}},
        "add-user-review": {component: openAddUserReviewModal, params: {...modalSharedParams()}},
        "edit-user-review": {component: openEditUserReviewModal, params: {...modalSharedParams()}},
        "spotlight": {component: openSpotlight, params: {...modalSharedParams()}},
    }

    useEffect(() => {
        if (location.hash.includes('#modal=')) {
            const modalKey = location.hash.replace('#modal=', '')
            const modal = modals[modalKey];
            if (modal) {
                modal.component({...modal.params})
            }
        } else {
            if (modalsContext.modals.length > 0) {
                closeAllModals()
            }

        }
    }, [location]);
    return null;
}