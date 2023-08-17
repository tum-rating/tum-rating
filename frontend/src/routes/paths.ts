export enum Paths {
  home = '/',
  ':id' = ':id',
  auth = 'auth',
  activate = 'activate',
  recovery = 'recovery',
}

interface PathElement {
  parent: Paths | null;
}

const PATH_ELEMENTS: Record<Paths, PathElement> = {
  [Paths.home]: {
    parent: null,
  },
  [Paths[':id']]: {
    parent: null,
  },
  [Paths.recovery]: {
    parent: Paths.auth,
  },
  [Paths.activate]: {
    parent: Paths.auth,
  },
};

const getPath = (pathToResolve: Paths) => {
  console.log(pathToResolve);
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

export { PATH_ELEMENTS, getPath };
