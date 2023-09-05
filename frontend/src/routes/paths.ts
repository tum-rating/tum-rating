export enum Paths {
    home = '/',
    auth = 'auth',
    activate = 'activate',
    recovery = 'recovery',
    courses = 'courses',
    courseDetail = ':id',
}

interface PathElement {
    parent: Paths | null;
}

const PATH_ELEMENTS: Record<Paths, PathElement> = {
    [Paths.home]: {
        parent: null,
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
    let fullPath = `/${pathToResolve}`; // Use pathToResolve directly
    let current = pathToResolve;
    while (PATH_ELEMENTS[current] && PATH_ELEMENTS[current].parent) {
        const parent = PATH_ELEMENTS[current].parent;
        if (parent) {
            fullPath = `/${parent}${fullPath}`; // Use parent directly
            current = parent;
        } else {
            break;
        }
    }

    return fullPath;
};

export {PATH_ELEMENTS, getPath};
