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


export const ModalsHashController = (_: PropsWithChildren) => {
    const location = useLocation();
    const navigate = useNavigate()
    const modals = {
        "sign-in": {component: openSignInModal, params: {}},
        "sign-up": {component: openSignUpModal, params: {}},
        "recovery": {component: openRecoveryModal, params: {}},
        "add-course": {component: openAddCourseModal, params: {}},
        "add-user-review": {component: openAddUserReviewModal, params: {}},
        "edit-user-review": {component: openEditUserReviewModal, params: {}},
        "spotlight": {component: openSpotlight, params: {isMobile}},
    }

    useEffect(() => {
        if (location.hash.includes('#modal=')) {
            const modal = modals[location.hash.replace('#modal=', '')];
            if (modal) modal.component({...modal.params, onClose: () => navigate('#')})
        }
    }, [location]);
    return null;
}