export enum Paths {
    home = '/',
    auth = 'auth',
    activate = 'activate',
    recovery = 'recovery',
    courses = 'courses',
    courseDetail = ':id',
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
    [Paths.recovery]: {
        parent: Paths.auth,
    },
    [Paths.activate]: {
        parent: Paths.auth,
    },
};

const getPath = (pathToResolve: Paths) => {
    let fullPath = `/${pathToResolve}`;
    let current = pathToResolve;
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
