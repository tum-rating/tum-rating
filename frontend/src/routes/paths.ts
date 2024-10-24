export enum Paths {
    home = '/',
    auth = 'auth',
    oAuthRedirect = 'oauth/redirect',
    activate = 'activate',
    recovery = 'recovery',
    courses = 'courses',
    courseDetail = ':courseId',
    signIn = '#modal=sign-in',
    signUp = '#modal=sign-up',
    addCourse = '#modal=add-course',
    addUserReview = '#modal=add-user-review',
    editUserReview = '#modal=edit-user-review',
    spotlight = '#modal=spotlight',
    forgotPassword = '#modal=forgot-password',
    userSettings = '#modal=settings',
    //---contact
    feedback = 'feedback',
    privacyPolicy = 'privacy-policy',
    termsOfService = 'terms-of-service',
    about = 'about',
    //---admin
    admin = 'admin',
    adminUsers = 'users',
    adminAllCourses = 'all-courses',
    adminCoursesProposals = 'courses-proposals',
    adminReviews = 'reviews',
    //--- admin collections details
    adminUserDetails = ':userId',
    adminCoursesProposalsDetails = ':courseProposalId',
    adminCoursesDetails = ':adminCourseId',
    adminToggles = 'toggles',
}

type PathElement = {
    [key in Paths]: {
        parent: Paths | null;
    };
};

const PATH_ELEMENTS: PathElement = {
    [Paths.home]: {
        parent: null,
    },
    [Paths.auth]: {
        parent: null,
    },
    [Paths.courses]: {
        parent: Paths.home,
    },
    [Paths.courseDetail]: {
        parent: Paths.courses,
    },
    [Paths.addCourse]: {
        parent: null,
    },
    [Paths.addUserReview]: {
        parent: null,
    },
    [Paths.editUserReview]: {
        parent: null,
    },
    [Paths.spotlight]: {
        parent: null,
    },
    [Paths.oAuthRedirect]: {
        parent: null,
    },
    //--contact
    [Paths.feedback]: {
        parent: null,
    },
    [Paths.privacyPolicy]: {
        parent: null,
    },
    [Paths.termsOfService]: {
        parent: null,
    },
    [Paths.about]: {
        parent: null,
    },
    //---auth
    [Paths.activate]: {
        parent: Paths.auth,
    },
    [Paths.recovery]: {
        parent: Paths.auth,
    },
    //---auth-modals
    [Paths.signIn]: {
        parent: null,
    },
    [Paths.signUp]: {
        parent: null,
    },
    [Paths.forgotPassword]: {
        parent: null,
    },
    [Paths.userSettings]: {
        parent: null,
    },
    //---admin
    [Paths.admin]: {
        parent: null,
    },
    [Paths.adminUsers]: {
        parent: Paths.admin,
    },
    [Paths.adminAllCourses]: {
        parent: Paths.admin,
    },
    [Paths.adminCoursesProposals]: {
        parent: Paths.admin,
    },
    [Paths.adminReviews]: {
        parent: Paths.admin,
    },
    [Paths.adminUserDetails]: {
        parent: Paths.adminUsers,
    },
    [Paths.adminCoursesProposalsDetails]: {
        parent: Paths.adminCoursesProposals,
    },
    [Paths.adminCoursesDetails]: {
        parent: Paths.adminAllCourses,
    },
    [Paths.adminToggles]: {
        parent: Paths.admin,
    },
};

const getPath = (pathToResolve: Paths) => {
    let fullPath = `/${pathToResolve}`;
    let current = pathToResolve;
    if (fullPath.includes('#modal=')) fullPath = fullPath.replace('/', '');

    while (PATH_ELEMENTS[current] && PATH_ELEMENTS[current].parent) {
        const parent = PATH_ELEMENTS[current].parent;
        if (parent) {
            fullPath = `/${parent}${fullPath}`;
            current = parent;
        } else {
            break;
        }
    }

    return fullPath;
};

export {PATH_ELEMENTS, getPath};
