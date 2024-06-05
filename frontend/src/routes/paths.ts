export enum Paths {
    home = '/',
    auth = 'auth',
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
    //---admin
    admin = 'admin',
    adminUsers = 'users',
    adminAllCourses = 'all-courses',
    adminCoursesProposals = 'courses-proposals',
    //--- admin collections details
    adminUserDetails = ':userId',
    adminCoursesProposalsDetails = ':courseProposalId',
    adminCoursesDetails = ':adminCourseId',
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
        parent: Paths.courses,
    },
    [Paths.addUserReview]: {
        parent: Paths.courses,
    },
    [Paths.editUserReview]: {
        parent: Paths.courses,
    },
    [Paths.spotlight]: {
        parent: Paths.courses,
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
    [Paths.adminUserDetails]: {
        parent: Paths.adminUsers,
    },
    [Paths.adminCoursesProposalsDetails]: {
        parent: Paths.adminCoursesProposals,
    },
    [Paths.adminCoursesDetails]: {
        parent: Paths.adminAllCourses,
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

export { PATH_ELEMENTS, getPath };
