export enum Paths {
  home = "",
  ":id" = ":id",
  auth = "auth",
  reset = "reset",
  ":resetToken" = ":resetToken",
  login = "login",
  register = "register",
}

interface PathElement {
  parent: Paths | null;
}

const PATH_ELEMENTS: Record<Paths, PathElement> = {
  [Paths.home]: {
    parent: null,
  },
  [Paths[":id"]]: {
    parent: null,
  },
  [Paths.reset]: {
    parent: Paths.auth,
  },
  [Paths[":resetToken"]]: {
    parent: Paths.reset,
  },
};

const getPath = (pathToResolve: Paths) => {
  let fullPath = `/${Paths[pathToResolve]}`;
  let current = pathToResolve;

  while (PATH_ELEMENTS[current] && PATH_ELEMENTS[current].parent) {
    const parent = PATH_ELEMENTS[current].parent;
    if (parent) {
      fullPath = `/${Paths[parent]}${fullPath}`;
      current = parent;
    } else {
      break;
    }
  }

  return fullPath;
};
export { PATH_ELEMENTS, getPath };
